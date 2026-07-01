/**
 * Market data facade.
 *
 * The single seam the UI reads market data through. Portfolio computation is
 * delegated to `portfolio.ts` (real holdings, mock fallback); quotes route
 * through the provider dispatcher (Finnhub / CoinGecko, mock fallback).
 */
import type { Quote } from "@/types/market";
import { getQuotes } from "./providers";
import { MARKET_OVERVIEW } from "./universe";

export {
  getPortfolioSummary,
  getPositions,
  getAllocation,
  getPerformanceSeries,
} from "./portfolio";

export async function getMarketOverview(): Promise<Quote[]> {
  const quotes = await getQuotes(MARKET_OVERVIEW);
  // Preserve the configured display order and attach friendly names.
  return quotes.map((q, i) => ({ ...q, name: MARKET_OVERVIEW[i].name }));
}
