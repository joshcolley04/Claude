import { env } from "@/lib/env";
import type { Fundamentals } from "@/types/market";

const BASE = "https://finnhub.io/api/v1";

/**
 * Fetch company fundamentals from Finnhub's `/stock/metric` endpoint.
 * Returns null when no key is configured or the call fails, so callers keep
 * the corresponding score component neutral.
 */
export async function getFundamentals(
  symbol: string,
): Promise<Fundamentals | null> {
  const key = env.marketData.finnhub;
  if (!key) return null;
  try {
    const res = await fetch(
      `${BASE}/stock/metric?symbol=${encodeURIComponent(symbol)}&metric=all&token=${key}`,
      { next: { revalidate: 60 * 60 * 12 } },
    );
    if (!res.ok) return null;
    const d = (await res.json()) as { metric?: Record<string, number | null> };
    const m = d.metric ?? {};
    return {
      peRatio: num(m.peBasicExclExtraTTM ?? m.peTTM),
      netMarginPct: num(m.netProfitMarginTTM),
      revenueGrowthPct: num(m.revenueGrowthTTMYoy),
      roePct: num(m.roeTTM),
      debtToEquity: num(m["totalDebt/totalEquityQuarterly"]),
    };
  } catch {
    return null;
  }
}

function num(v: number | null | undefined): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}
