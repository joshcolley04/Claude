/**
 * Portfolio computation.
 *
 * Builds real positions from the user's holdings, values them with live quotes,
 * and derives summary, allocation and a historical growth curve from candle
 * history. When an account has no holdings yet (e.g. the demo/mock user) it
 * falls back to the illustrative mock data so the UI is never empty.
 */
import { prisma } from "@/lib/prisma";
import type {
  AllocationSlice,
  AssetClass,
  PerformancePoint,
  PortfolioSummary,
  Position,
} from "@/types/market";
import type { Candle } from "@/lib/indicators";
import { getCandles, getQuote } from "./providers";
import {
  mockAllocation,
  mockPerformanceSeries,
  mockPortfolioSummary,
  mockPositions,
} from "./mock-data";

interface HoldingRow {
  symbol: string;
  name: string;
  assetClass: AssetClass;
  quantity: number;
  avgCost: number;
  sector: string | null;
}

/** Shape of a Holding row joined with its Instrument (matches the Prisma include). */
interface HoldingWithInstrument {
  quantity: number;
  avgCost: number;
  instrument: {
    symbol: string;
    name: string;
    assetClass: string;
    sector: string | null;
  };
}

async function loadHoldings(userId: string): Promise<{
  cashBalance: number;
  holdings: HoldingRow[];
}> {
  const portfolio = await prisma.portfolio.findFirst({
    where: { userId },
    include: { holdings: { include: { instrument: true } } },
    orderBy: { createdAt: "asc" },
  });
  if (!portfolio) return { cashBalance: 0, holdings: [] };
  return {
    cashBalance: portfolio.cashBalance,
    holdings: portfolio.holdings.map((h: HoldingWithInstrument) => ({
      symbol: h.instrument.symbol,
      name: h.instrument.name,
      assetClass: h.instrument.assetClass as AssetClass,
      quantity: h.quantity,
      avgCost: h.avgCost,
      sector: h.instrument.sector,
    })),
  };
}

export async function getPositions(userId: string): Promise<Position[]> {
  const { holdings } = await loadHoldings(userId);
  if (holdings.length === 0) return mockPositions;

  const priced = await Promise.all(
    holdings.map(async (h) => {
      const quote = await getQuote(h.symbol, h.assetClass);
      const price = quote.price;
      const marketValue = price * h.quantity;
      const cost = h.avgCost * h.quantity;
      const unrealizedPnl = marketValue - cost;
      return {
        symbol: h.symbol,
        name: h.name,
        assetClass: h.assetClass,
        quantity: h.quantity,
        avgCost: h.avgCost,
        price,
        marketValue,
        unrealizedPnl,
        unrealizedPnlPct: cost > 0 ? (unrealizedPnl / cost) * 100 : 0,
        allocationPct: 0, // filled in below
      } satisfies Position;
    }),
  );

  const total = priced.reduce((s, p) => s + p.marketValue, 0);
  for (const p of priced) {
    p.allocationPct = total > 0 ? (p.marketValue / total) * 100 : 0;
  }
  return priced.sort((a, b) => b.marketValue - a.marketValue);
}

export async function getPortfolioSummary(
  userId: string,
): Promise<PortfolioSummary> {
  const { cashBalance, holdings } = await loadHoldings(userId);
  if (holdings.length === 0) return mockPortfolioSummary;

  const positions = await getPositions(userId);
  const invested = positions.reduce((s, p) => s + p.marketValue, 0);
  const totalValue = invested + cashBalance;

  // Day P&L derived from each quote's day change.
  const quotes = await Promise.all(
    positions.map((p) => getQuote(p.symbol, p.assetClass)),
  );
  let dayPnl = 0;
  positions.forEach((p, i) => {
    const changePct = quotes[i].changePct;
    const prevPrice = p.price / (1 + changePct / 100);
    dayPnl += (p.price - prevPrice) * p.quantity;
  });

  // Week / month performance from candle history.
  const candleMap = await buildCandleMap(holdings);
  const valueNow = invested;
  const valueWeekAgo = valuePortfolioAt(holdings, candleMap, 5) ?? valueNow;
  const valueMonthAgo = valuePortfolioAt(holdings, candleMap, 21) ?? valueNow;

  const [txCount, openCount] = await Promise.all([
    prisma.transaction.count({
      where: { portfolio: { userId }, side: "SELL" },
    }),
    Promise.resolve(holdings.length),
  ]);

  return {
    totalValue,
    cashBalance,
    dayPnl,
    dayPnlPct: totalValue > 0 ? (dayPnl / totalValue) * 100 : 0,
    weekPnlPct: valueWeekAgo > 0 ? ((valueNow - valueWeekAgo) / valueWeekAgo) * 100 : 0,
    monthPnlPct: valueMonthAgo > 0 ? ((valueNow - valueMonthAgo) / valueMonthAgo) * 100 : 0,
    openPositions: openCount,
    closedPositions: txCount,
  };
}

export async function getAllocation(userId: string): Promise<AllocationSlice[]> {
  const { cashBalance, holdings } = await loadHoldings(userId);
  if (holdings.length === 0) return mockAllocation;

  const positions = await getPositions(userId);
  const bySector = new Map<string, number>();
  positions.forEach((p, i) => {
    const label = holdings[i]?.sector ?? assetClassLabel(p.assetClass);
    bySector.set(label, (bySector.get(label) ?? 0) + p.marketValue);
  });
  if (cashBalance > 0) bySector.set("Cash", cashBalance);

  const total = Array.from(bySector.values()).reduce((s, v) => s + v, 0);
  return Array.from(bySector.entries())
    .map(([label, value]) => ({
      label,
      value,
      pct: total > 0 ? (value / total) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value);
}

export async function getPerformanceSeries(
  userId: string,
  days = 90,
): Promise<PerformancePoint[]> {
  const { cashBalance, holdings } = await loadHoldings(userId);
  if (holdings.length === 0) return mockPerformanceSeries(days);

  const candleMap = await buildCandleMap(holdings, days + 5);
  const points: PerformancePoint[] = [];
  for (let offset = days; offset >= 0; offset--) {
    const value = valuePortfolioAt(holdings, candleMap, offset);
    if (value === null) continue;
    const d = new Date();
    d.setDate(d.getDate() - offset);
    points.push({ date: d.toISOString().slice(0, 10), value: Math.round(value + cashBalance) });
  }
  return points.length > 1 ? points : mockPerformanceSeries(days);
}

// --- helpers ---------------------------------------------------------------

async function buildCandleMap(
  holdings: HoldingRow[],
  days = 40,
): Promise<Map<string, Candle[]>> {
  const map = new Map<string, Candle[]>();
  await Promise.all(
    holdings.map(async (h) => {
      map.set(h.symbol, await getCandles(h.symbol, h.assetClass, days));
    }),
  );
  return map;
}

/** Value the portfolio `offset` trading days ago using candle closes. */
function valuePortfolioAt(
  holdings: HoldingRow[],
  candleMap: Map<string, Candle[]>,
  offset: number,
): number | null {
  let total = 0;
  let any = false;
  for (const h of holdings) {
    const candles = candleMap.get(h.symbol);
    if (!candles || candles.length === 0) continue;
    const idx = candles.length - 1 - offset;
    if (idx < 0) continue;
    total += candles[idx].close * h.quantity;
    any = true;
  }
  return any ? total : null;
}

function assetClassLabel(assetClass: AssetClass): string {
  switch (assetClass) {
    case "STOCK":
      return "Equities";
    case "ETF":
      return "ETFs";
    case "CRYPTO":
      return "Crypto";
    case "FOREX":
      return "Forex";
    case "COMMODITY":
      return "Commodities";
    case "INDEX":
      return "Indices";
    default:
      return "Other";
  }
}
