/**
 * External signals — converts live feeds into the scanner's non-technical
 * score components (fundamental, sentiment) plus a market-wide macro score.
 *
 * Everything here degrades gracefully: when a feed is unavailable the relevant
 * field is `null`/undefined and the scanner keeps that component neutral, so a
 * score is never fabricated from missing data.
 *
 * Institutional flow requires a premium ownership feed and stays neutral until
 * a provider is wired in (documented, not silently faked).
 */
import type { AssetClass, ExternalSignals, Fundamentals } from "@/types/market";
import { clampScore } from "@/lib/indicators";
import { getFundamentals } from "./providers/fundamentals";
import { getSymbolSentiment, getEconomicCalendar } from "./news";

/** Map raw fundamentals onto a 0-100 quality score. */
export function scoreFundamentals(f: Fundamentals): number {
  let score = 50;

  if (f.netMarginPct !== null) {
    // >20% margin is excellent; <0% is poor.
    score += Math.max(-15, Math.min(20, f.netMarginPct * 0.8));
  }
  if (f.revenueGrowthPct !== null) {
    score += Math.max(-15, Math.min(20, f.revenueGrowthPct * 0.7));
  }
  if (f.roePct !== null) {
    score += Math.max(-10, Math.min(15, f.roePct * 0.4));
  }
  if (f.peRatio !== null && f.peRatio > 0) {
    // Reward reasonable valuations, penalise extreme multiples.
    if (f.peRatio < 15) score += 8;
    else if (f.peRatio > 45) score -= 10;
  }
  if (f.debtToEquity !== null && f.debtToEquity > 2) {
    score -= 8; // heavy leverage
  }
  return clampScore(score);
}

/** Gather per-symbol signals for the scanner. Equities/ETFs get fundamentals. */
export async function getSignals(
  symbol: string,
  assetClass: AssetClass,
): Promise<ExternalSignals> {
  const [fundamentals, sentimentScore] = await Promise.all([
    assetClass === "STOCK" || assetClass === "ETF"
      ? getFundamentals(symbol)
      : Promise.resolve(null),
    getSymbolSentiment(symbol),
  ]);

  return {
    fundamentalScore: fundamentals ? scoreFundamentals(fundamentals) : null,
    sentimentScore: sentimentScore,
    institutionalScore: null, // pending a live ownership feed
  };
}

/**
 * A market-wide macro score (0-100). Higher = more supportive backdrop.
 * Derived from the near-term economic calendar: a cluster of high-importance
 * events (rate decisions, inflation, jobs) implies event risk and lowers the
 * score; a quiet calendar raises it. When actuals beat/miss forecasts that
 * surprise nudges the score too.
 */
export async function getMacroScore(): Promise<number> {
  const events = await getEconomicCalendar();
  const now = Date.now();
  const soon = events.filter((e) => {
    const t = new Date(e.eventTime).getTime();
    return t >= now && t <= now + 1000 * 60 * 60 * 24 * 7; // next 7 days
  });

  let score = 65; // neutral-to-constructive baseline
  const highImpact = soon.filter((e) => e.importance === "HIGH").length;
  score -= highImpact * 5; // event risk

  // Reward realised prints that came in better than forecast (very rough).
  for (const e of soon) {
    if (e.actual && e.forecast) {
      const a = parseFloat(e.actual);
      const f = parseFloat(e.forecast);
      if (Number.isFinite(a) && Number.isFinite(f)) {
        score += a >= f ? 2 : -2;
      }
    }
  }
  return clampScore(score);
}
