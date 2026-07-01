import { env } from "@/lib/env";
import type { AssetClass, Quote } from "@/types/market";
import type { Candle } from "@/lib/indicators";
import type { MarketDataProvider } from "./types";

const BASE = "https://api.coingecko.com/api/v3";

/** Map common trading symbols to CoinGecko coin IDs. */
const COIN_IDS: Record<string, string> = {
  "BTC-USD": "bitcoin",
  "ETH-USD": "ethereum",
  "SOL-USD": "solana",
  "BNB-USD": "binancecoin",
  "XRP-USD": "ripple",
  "ADA-USD": "cardano",
};

function coinId(symbol: string): string | null {
  if (COIN_IDS[symbol]) return COIN_IDS[symbol];
  // Fallback: lowercase base of a "BASE-QUOTE" pair is rarely a valid id, so
  // only trust the explicit map to avoid bad requests.
  return null;
}

function headers(): HeadersInit {
  const key = env.marketData.coingecko;
  return key ? { "x-cg-demo-api-key": key } : {};
}

/** CoinGecko adapter for crypto. Works without a key (rate-limited). */
export const coingeckoProvider: MarketDataProvider = {
  name: "coingecko",

  supports(assetClass: AssetClass) {
    return assetClass === "CRYPTO";
  },

  async getQuote(symbol): Promise<Quote | null> {
    const id = coinId(symbol);
    if (!id) return null;
    try {
      const res = await fetch(
        `${BASE}/simple/price?ids=${id}&vs_currencies=usd&include_24hr_change=true`,
        { headers: headers(), next: { revalidate: 30 } },
      );
      if (!res.ok) return null;
      const d = (await res.json()) as Record<
        string,
        { usd: number; usd_24h_change?: number }
      >;
      const entry = d[id];
      if (!entry) return null;
      return {
        symbol,
        name: symbol,
        assetClass: "CRYPTO",
        price: entry.usd,
        changePct: entry.usd_24h_change ?? 0,
        currency: "USD",
      };
    } catch {
      return null;
    }
  },

  async getCandles(symbol, _assetClass, days): Promise<Candle[] | null> {
    const id = coinId(symbol);
    if (!id) return null;
    try {
      const res = await fetch(
        `${BASE}/coins/${id}/ohlc?vs_currency=usd&days=${days}`,
        { headers: headers(), next: { revalidate: 300 } },
      );
      if (!res.ok) return null;
      // CoinGecko OHLC returns [time_ms, open, high, low, close] (no volume).
      const rows = (await res.json()) as number[][];
      if (!Array.isArray(rows) || rows.length === 0) return null;
      return rows.map(([t, o, h, l, c]) => ({
        time: Math.floor(t / 1000),
        open: o,
        high: h,
        low: l,
        close: c,
        volume: 0,
      }));
    } catch {
      return null;
    }
  },
};
