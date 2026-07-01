import type { AssetClass, Quote } from "@/types/market";
import type { Candle } from "@/lib/indicators";

/**
 * A market-data provider adapter. Phase 2 ships Finnhub (equities/ETF) and
 * CoinGecko (crypto); more can be added without touching callers.
 */
export interface MarketDataProvider {
  readonly name: string;
  /** Which asset classes this provider can serve. */
  supports(assetClass: AssetClass): boolean;
  /** Latest quote for a symbol, or null if unavailable. */
  getQuote(symbol: string, assetClass: AssetClass): Promise<Quote | null>;
  /** Daily candles (oldest first), or null if unavailable. */
  getCandles(
    symbol: string,
    assetClass: AssetClass,
    days: number,
  ): Promise<Candle[] | null>;
}
