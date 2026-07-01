/**
 * Scanner engine.
 *
 * Consumes candle series, computes technical indicators, and derives the 9
 * component scores that roll up (via computeOverallScore) into the overall
 * 0-100 opportunity score. Entry/stop/target levels are derived from ATR and
 * recent support/resistance so risk/reward is grounded in volatility.
 *
 * Fundamental / institutional / sentiment / macro components are neutral in
 * Phase 2 (no fundamental feed yet) and become live in Phase 3. This is stated
 * explicitly so scores are never over-interpreted.
 */
import type {
  AssetClass,
  Direction,
  Opportunity,
  OpportunityScores,
} from "@/types/market";
import {
  atr,
  clampScore,
  ema,
  momentum,
  rsi,
  sma,
  supportResistance,
  volumeRatio,
  type Candle,
} from "@/lib/indicators";
import { computeOverallScore } from "./scoring";

const NEUTRAL = 60; // placeholder for components without a live feed yet

export interface ScanInput {
  symbol: string;
  name: string;
  assetClass: AssetClass;
  candles: Candle[];
}

export interface ScanResult extends Opportunity {}

function technicalScore(candles: Candle[]): number {
  const closes = candles.map((c) => c.close);
  const last = closes[closes.length - 1];
  const ema20 = ema(closes, 20);
  const sma50 = sma(closes, 50);
  let score = 50;
  if (ema20 && last > ema20) score += 15;
  if (sma50 && last > sma50) score += 15;
  if (ema20 && sma50 && ema20 > sma50) score += 10; // bullish stack
  const r = rsi(closes, 14);
  if (r !== null) {
    if (r > 55 && r < 72) score += 10; // healthy strength
    else if (r >= 72) score -= 10; // overbought
    else if (r < 40) score -= 10;
  }
  return clampScore(score);
}

function momentumScore(candles: Candle[]): number {
  const closes = candles.map((c) => c.close);
  const m = momentum(closes, 20);
  if (m === null) return NEUTRAL;
  // Map -10%..+15% momentum onto 20..95.
  return clampScore(50 + m * 3);
}

function volumeScore(candles: Candle[]): number {
  const vr = volumeRatio(candles, 20);
  if (vr === null || candles[candles.length - 1].volume === 0) return NEUTRAL;
  return clampScore(40 + (vr - 1) * 60);
}

function liquidityScore(assetClass: AssetClass): number {
  // Crude proxy by asset class until per-symbol liquidity data lands.
  switch (assetClass) {
    case "INDEX":
    case "FOREX":
      return 96;
    case "STOCK":
    case "ETF":
      return 88;
    case "CRYPTO":
      return 82;
    default:
      return 75;
  }
}

function riskScore(candles: Candle[], last: number): number {
  const a = atr(candles, 14);
  if (!a || last === 0) return NEUTRAL;
  const atrPct = (a / last) * 100;
  // Lower volatility -> higher (better) risk score.
  return clampScore(90 - atrPct * 4);
}

/** Analyse one instrument and produce a scored opportunity (or null). */
export function scanInstrument(input: ScanInput): ScanResult | null {
  const { candles } = input;
  if (candles.length < 55) return null; // need enough history for SMA-50

  const closes = candles.map((c) => c.close);
  const last = closes[closes.length - 1];
  const a = atr(candles, 14) ?? last * 0.03;
  const sr = supportResistance(candles, 30);
  const ema20 = ema(closes, 20);

  const direction: Direction = ema20 && last >= ema20 ? "BUY" : "SELL";

  const components: Omit<OpportunityScores, "overall"> = {
    technical: technicalScore(candles),
    fundamental: NEUTRAL,
    momentum: momentumScore(candles),
    volume: volumeScore(candles),
    institutional: NEUTRAL,
    sentiment: NEUTRAL,
    macro: NEUTRAL,
    liquidity: liquidityScore(input.assetClass),
    risk: riskScore(candles, last),
  };
  const overall = computeOverallScore(components);
  const scores: OpportunityScores = { overall, ...components };

  // Volatility-based levels (2x ATR stop, targets at 2R / 3.5R).
  const isBuy = direction === "BUY";
  const stopDistance = a * 2;
  const stopLoss = isBuy ? last - stopDistance : last + stopDistance;
  const takeProfit1 = isBuy ? last + stopDistance * 2 : last - stopDistance * 2;
  const takeProfit2 = isBuy ? last + stopDistance * 3.5 : last - stopDistance * 3.5;
  const riskReward = 2;

  const confidence = clampScore(overall - 5 + (components.technical - 50) / 5);

  return {
    id: `scan-${input.symbol}`,
    symbol: input.symbol,
    name: input.name,
    assetClass: input.assetClass,
    direction,
    currentPrice: round(last),
    suggestedEntry: round(isBuy ? Math.min(last, sr?.support ? last : last) : last),
    stopLoss: round(stopLoss),
    takeProfit1: round(takeProfit1),
    takeProfit2: round(takeProfit2),
    holdingPeriod: "2-8 weeks",
    positionSizePct: overall >= 80 ? 6 : overall >= 70 ? 4 : 3,
    riskReward,
    confidence,
    scores,
    thesis: buildThesis(input, scores, direction),
    strengths: buildStrengths(scores),
    weaknesses: buildWeaknesses(scores),
    principalRisks: [
      "Broad market drawdown affecting all risk assets",
      "Adverse news or macro surprise",
    ],
    invalidation: `A daily close beyond the ${round(stopLoss)} stop invalidates the setup.`,
  };
}

/** Scan many instruments and return them ranked by overall score. */
export function runScan(inputs: ScanInput[], minScore = 0): ScanResult[] {
  return inputs
    .map(scanInstrument)
    .filter((r): r is ScanResult => r !== null && r.scores.overall >= minScore)
    .sort((a, b) => b.scores.overall - a.scores.overall);
}

// --- helpers ---------------------------------------------------------------

function round(n: number): number {
  return n >= 100 ? Math.round(n * 100) / 100 : Math.round(n * 10000) / 10000;
}

function buildThesis(
  input: ScanInput,
  scores: OpportunityScores,
  direction: Direction,
): string {
  return (
    `Analysis: ${input.symbol} shows ${direction === "BUY" ? "constructive" : "deteriorating"} technicals ` +
    `(technical ${scores.technical}/100, momentum ${scores.momentum}/100, volume ${scores.volume}/100). ` +
    `Assumption: current trend and liquidity conditions persist over the holding period. ` +
    `Fundamental, institutional, sentiment and macro components are neutral pending live feeds (Phase 3).`
  );
}

function buildStrengths(scores: OpportunityScores): string[] {
  const out: string[] = [];
  if (scores.technical >= 70) out.push("Strong technical structure");
  if (scores.momentum >= 70) out.push("Positive momentum");
  if (scores.volume >= 70) out.push("Above-average volume");
  if (scores.liquidity >= 85) out.push("Highly liquid");
  return out.length ? out : ["Balanced technical profile"];
}

function buildWeaknesses(scores: OpportunityScores): string[] {
  const out: string[] = [];
  if (scores.risk < 55) out.push("Elevated volatility");
  if (scores.momentum < 45) out.push("Weak momentum");
  if (scores.technical < 50) out.push("Technicals not yet confirmed");
  return out.length ? out : ["Fundamental confirmation pending"];
}
