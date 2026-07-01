import { prisma } from "@/lib/prisma";
import type { Opportunity } from "@/types/market";
import { getCandles } from "./providers";
import { SCAN_UNIVERSE } from "./universe";
import { mockOpportunities } from "./mock-data";

// Re-export pure scoring helpers for existing callers.
export { computeOverallScore, SCORE_WEIGHTS } from "./scoring";

/**
 * Run the scanner across the default universe, using live/mock candles, and
 * persist the resulting opportunities. Previous ACTIVE scanner rows are marked
 * EXPIRED so the table reflects the latest run. Safe to call from a cron job.
 */
/**
 * Assemble scan inputs for the universe: candles, live per-symbol signals
 * (fundamentals + sentiment) and a shared market-wide macro score. Signal
 * fetches degrade gracefully to neutral, so this never throws on missing feeds.
 */
async function buildScanInputs() {
  const { getSignals, getMacroScore } = await import("./signals");
  const macroScore = await getMacroScore();
  return Promise.all(
    SCAN_UNIVERSE.map(async (u) => ({
      symbol: u.symbol,
      name: u.name,
      assetClass: u.assetClass,
      candles: await getCandles(u.symbol, u.assetClass, 120),
      signals: await getSignals(u.symbol, u.assetClass),
      macroScore,
    })),
  );
}

export async function scanAndPersist(): Promise<Opportunity[]> {
  // Lazy import to keep the scanner (and its indicator deps) out of the hot
  // path for read-only requests.
  const { runScan } = await import("./scanner");

  const inputs = await buildScanInputs();
  const results = runScan(inputs, 0);

  // Expire the previous scanner batch, then persist the new one.
  await prisma.opportunity.updateMany({
    where: { source: "scanner", status: "ACTIVE" },
    data: { status: "EXPIRED" },
  });

  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

  for (const r of results) {
    const meta = SCAN_UNIVERSE.find((u) => u.symbol === r.symbol);
    const instrument = await prisma.instrument.upsert({
      where: { symbol_assetClass: { symbol: r.symbol, assetClass: r.assetClass } },
      update: { name: r.name },
      create: {
        symbol: r.symbol,
        name: r.name,
        assetClass: r.assetClass,
        sector: meta?.sector,
      },
    });

    await prisma.opportunity.create({
      data: {
        instrumentId: instrument.id,
        direction: r.direction,
        currentPrice: r.currentPrice,
        suggestedEntry: r.suggestedEntry,
        stopLoss: r.stopLoss,
        takeProfit1: r.takeProfit1,
        takeProfit2: r.takeProfit2,
        holdingPeriod: r.holdingPeriod,
        positionSizePct: r.positionSizePct,
        riskReward: r.riskReward,
        overallScore: r.scores.overall,
        technicalScore: r.scores.technical,
        fundamentalScore: r.scores.fundamental,
        momentumScore: r.scores.momentum,
        volumeScore: r.scores.volume,
        institutionalScore: r.scores.institutional,
        sentimentScore: r.scores.sentiment,
        macroScore: r.scores.macro,
        liquidityScore: r.scores.liquidity,
        riskScore: r.scores.risk,
        confidence: r.confidence,
        thesis: r.thesis,
        strengths: r.strengths.join("\n"),
        weaknesses: r.weaknesses.join("\n"),
        principalRisks: r.principalRisks.join("\n"),
        invalidation: r.invalidation,
        source: "scanner",
        status: "ACTIVE",
        expiresAt,
      },
    });
  }

  return results;
}

export async function getTopOpportunities(limit = 10): Promise<Opportunity[]> {
  try {
    const rows = await prisma.opportunity.findMany({
      where: { status: "ACTIVE" },
      include: { instrument: true },
      orderBy: { overallScore: "desc" },
      take: limit,
    });
    if (rows.length > 0) return rows.map(rowToOpportunity);
  } catch {
    // DB unavailable — fall through to a live in-memory scan.
  }

  // No persisted opportunities yet: run an in-memory scan for a useful result.
  try {
    const { runScan } = await import("./scanner");
    const inputs = await buildScanInputs();
    const results = runScan(inputs, 0);
    if (results.length > 0) return results.slice(0, limit);
  } catch {
    // ignore and use mock
  }

  return [...mockOpportunities]
    .sort((a, b) => b.scores.overall - a.scores.overall)
    .slice(0, limit);
}

export async function getOpportunityById(
  id: string,
): Promise<Opportunity | null> {
  try {
    const row = await prisma.opportunity.findUnique({
      where: { id },
      include: { instrument: true },
    });
    if (row) return rowToOpportunity(row);
  } catch {
    // ignore
  }
  return mockOpportunities.find((o) => o.id === id) ?? null;
}

// --- mapping ---------------------------------------------------------------

type OpportunityRow = {
  id: string;
  direction: string;
  currentPrice: number;
  suggestedEntry: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2: number | null;
  holdingPeriod: string | null;
  positionSizePct: number | null;
  riskReward: number | null;
  overallScore: number;
  technicalScore: number;
  fundamentalScore: number;
  momentumScore: number;
  volumeScore: number;
  institutionalScore: number;
  sentimentScore: number;
  macroScore: number;
  liquidityScore: number;
  riskScore: number;
  confidence: number;
  thesis: string;
  strengths: string;
  weaknesses: string;
  principalRisks: string;
  invalidation: string | null;
  instrument: { symbol: string; name: string; assetClass: string };
};

function splitLines(s: string): string[] {
  return s.split("\n").map((l) => l.trim()).filter(Boolean);
}

function rowToOpportunity(row: OpportunityRow): Opportunity {
  return {
    id: row.id,
    symbol: row.instrument.symbol,
    name: row.instrument.name,
    assetClass: row.instrument.assetClass as Opportunity["assetClass"],
    direction: row.direction as Opportunity["direction"],
    currentPrice: row.currentPrice,
    suggestedEntry: row.suggestedEntry,
    stopLoss: row.stopLoss,
    takeProfit1: row.takeProfit1,
    takeProfit2: row.takeProfit2 ?? undefined,
    holdingPeriod: row.holdingPeriod ?? "",
    positionSizePct: row.positionSizePct ?? 0,
    riskReward: row.riskReward ?? 0,
    confidence: row.confidence,
    scores: {
      overall: row.overallScore,
      technical: row.technicalScore,
      fundamental: row.fundamentalScore,
      momentum: row.momentumScore,
      volume: row.volumeScore,
      institutional: row.institutionalScore,
      sentiment: row.sentimentScore,
      macro: row.macroScore,
      liquidity: row.liquidityScore,
      risk: row.riskScore,
    },
    thesis: row.thesis,
    strengths: splitLines(row.strengths),
    weaknesses: splitLines(row.weaknesses),
    principalRisks: splitLines(row.principalRisks),
    invalidation: row.invalidation ?? "",
  };
}
