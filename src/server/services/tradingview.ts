/**
 * TradingView alert ingestion.
 *
 * TradingView has no trade API; instead its alerts POST a webhook to us. We turn
 * each alert into an in-app Opportunity + Alert and notify opted-in users. If a
 * user has BOTH `tradingEnabled` and `tvAutoExecute` on (default off) and a
 * connected Coinbase account, a crypto signal is routed to Coinbase for
 * execution — this is the one automated order path and is opt-in only.
 */
import { prisma } from "@/lib/prisma";
import type { AssetClass, Direction } from "@/types/market";
import { sendOpportunityAlert } from "./whatsapp";

export interface TradingViewSignal {
  symbol: string;
  action: Direction; // BUY | SELL
  assetClass: AssetClass;
  price?: number;
  amount?: number; // optional crypto amount for auto-execution
  message?: string;
}

export interface IngestReport {
  opportunityId: string;
  alertsSent: number;
  autoExecuted: number;
}

export async function ingestTradingViewSignal(
  sig: TradingViewSignal,
): Promise<IngestReport> {
  const instrument = await prisma.instrument.upsert({
    where: { symbol_assetClass: { symbol: sig.symbol, assetClass: sig.assetClass } },
    update: {},
    create: { symbol: sig.symbol, name: sig.symbol, assetClass: sig.assetClass },
  });

  const price = sig.price ?? 0;
  const isBuy = sig.action === "BUY";
  // Signal-only levels (TradingView does not supply risk levels here).
  const stop = price ? (isBuy ? price * 0.92 : price * 1.08) : 0;
  const target = price ? (isBuy ? price * 1.16 : price * 0.84) : 0;

  const opportunity = await prisma.opportunity.create({
    data: {
      instrumentId: instrument.id,
      direction: sig.action,
      currentPrice: price,
      suggestedEntry: price,
      stopLoss: stop,
      takeProfit1: target,
      overallScore: 0,
      technicalScore: 0,
      fundamentalScore: 0,
      momentumScore: 0,
      volumeScore: 0,
      institutionalScore: 0,
      sentimentScore: 0,
      macroScore: 0,
      liquidityScore: 0,
      riskScore: 0,
      confidence: 0,
      thesis: sig.message ?? `TradingView alert: ${sig.action} ${sig.symbol}.`,
      strengths: "",
      weaknesses: "",
      principalRisks: "Signal source is an external TradingView alert; validate independently.",
      source: "tradingview",
      status: "ACTIVE",
    },
  });

  // Notify opted-in users and optionally auto-execute.
  const users = await prisma.user.findMany({
    where: { settings: { whatsappEnabled: true } },
    select: {
      id: true,
      settings: {
        select: { tradingEnabled: true, tvAutoExecute: true, tvOrderAmount: true },
      },
      notifications: {
        where: { channel: "whatsapp", active: true },
        select: { target: true },
      },
    },
  });

  let alertsSent = 0;
  let autoExecuted = 0;

  for (const user of users) {
    const recipient = user.notifications[0]?.target;
    const res = await sendOpportunityAlert(
      {
        id: opportunity.id,
        symbol: sig.symbol,
        name: sig.symbol,
        assetClass: sig.assetClass,
        direction: sig.action,
        currentPrice: price,
        suggestedEntry: price,
        stopLoss: stop,
        takeProfit1: target,
        holdingPeriod: "",
        positionSizePct: 0,
        riskReward: 0,
        confidence: 0,
        scores: {
          overall: 0, technical: 0, fundamental: 0, momentum: 0, volume: 0,
          institutional: 0, sentiment: 0, macro: 0, liquidity: 0, risk: 0,
        },
        thesis: sig.message ?? `TradingView alert: ${sig.action} ${sig.symbol}.`,
        strengths: [], weaknesses: [], principalRisks: [], invalidation: "",
      },
      recipient,
    );
    if (res.ok) alertsSent += 1;

    await prisma.alert.create({
      data: {
        userId: user.id,
        instrumentId: instrument.id,
        opportunityId: opportunity.id,
        type: "OPPORTUNITY",
        title: `TradingView: ${sig.action} ${sig.symbol}`,
        message: sig.message ?? `${sig.action} ${sig.symbol}`,
        deliveredVia: res.ok ? "whatsapp" : "in-app",
      },
    });

    const executed = await maybeAutoExecute(user.id, user.settings, sig);
    if (executed) autoExecuted += 1;
  }

  return { opportunityId: opportunity.id, alertsSent, autoExecuted };
}

async function maybeAutoExecute(
  userId: string,
  settings: { tradingEnabled: boolean; tvAutoExecute: boolean; tvOrderAmount: number | null } | null,
  sig: TradingViewSignal,
): Promise<boolean> {
  // All three must be true, plus a crypto asset and a configured amount.
  if (!settings?.tradingEnabled || !settings.tvAutoExecute) return false;
  if (sig.assetClass !== "CRYPTO") return false;
  const amount = sig.amount ?? settings.tvOrderAmount ?? 0;
  if (amount <= 0) return false;

  const { getAccessToken } = await import("@/server/brokers/connection");
  const { placeOrder, getAccounts } = await import("@/server/brokers/coinbase");

  const token = await getAccessToken(userId, "coinbase");
  if (!token) return false;

  // Resolve the account matching the base currency (e.g. BTC from BTC-USD).
  const base = sig.symbol.split("-")[0].toUpperCase();
  const accounts = await getAccounts(token).catch(() => []);
  const account = accounts.find((a) => a.currency.toUpperCase() === base);
  if (!account) return false;

  const result = await placeOrder(token, {
    accountId: account.id,
    side: sig.action,
    amount,
    currency: base,
  });
  if (!result.ok) return false;

  await prisma.alert.create({
    data: {
      userId,
      type: "SYSTEM",
      title: `Auto-executed ${sig.action} ${amount} ${base}`,
      message: `TradingView signal auto-executed via Coinbase.`,
      deliveredVia: "in-app",
    },
  });
  return true;
}
