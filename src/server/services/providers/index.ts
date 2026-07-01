/**
 * Provider dispatcher.
 *
 * Routes quote/candle requests to the first registered provider that supports
 * the asset class and returns data. Falls back to deterministic mock data when
 * no provider is configured or a live call fails, so callers always get a
 * usable result. A tiny in-memory TTL cache smooths repeated reads and helps
 * respect provider rate limits.
 */
import { env } from "@/lib/env";
import type { AssetClass, Quote } from "@/types/market";
import type { Candle } from "@/lib/indicators";
import { finnhubProvider } from "./finnhub";
import { coingeckoProvider } from "./coingecko";
import { mockCandles } from "./mock-candles";
import { mockQuotes } from "../mock-data";
import type { MarketDataProvider } from "./types";

const PROVIDERS: MarketDataProvider[] = [finnhubProvider, coingeckoProvider];

// --- Simple TTL cache -------------------------------------------------------
interface CacheEntry<T> {
  value: T;
  expires: number;
}
const cache = new Map<string, CacheEntry<unknown>>();

async function cached<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  const hit = cache.get(key) as CacheEntry<T> | undefined;
  if (hit && hit.expires > Date.now()) return hit.value;
  const value = await fn();
  cache.set(key, { value, expires: Date.now() + ttlMs });
  return value;
}

function mockQuoteFor(symbol: string, assetClass: AssetClass): Quote {
  const found = mockQuotes.find((q) => q.symbol === symbol);
  if (found) return found;
  return { symbol, name: symbol, assetClass, price: 100, changePct: 0, currency: "USD" };
}

export async function getQuote(
  symbol: string,
  assetClass: AssetClass,
): Promise<Quote> {
  return cached(`quote:${assetClass}:${symbol}`, 30_000, async () => {
    for (const p of PROVIDERS) {
      if (!p.supports(assetClass)) continue;
      const q = await p.getQuote(symbol, assetClass);
      if (q) return q;
    }
    return mockQuoteFor(symbol, assetClass);
  });
}

export async function getQuotes(
  items: { symbol: string; assetClass: AssetClass }[],
): Promise<Quote[]> {
  return Promise.all(items.map((i) => getQuote(i.symbol, i.assetClass)));
}

export async function getCandles(
  symbol: string,
  assetClass: AssetClass,
  days = 120,
): Promise<Candle[]> {
  return cached(`candles:${assetClass}:${symbol}:${days}`, 300_000, async () => {
    if (!env.mockDataEnabled || hasLiveProvider(assetClass)) {
      for (const p of PROVIDERS) {
        if (!p.supports(assetClass)) continue;
        const c = await p.getCandles(symbol, assetClass, days);
        if (c && c.length > 0) return c;
      }
    }
    const base = mockQuoteFor(symbol, assetClass).price;
    return mockCandles(symbol, base, days);
  });
}

function hasLiveProvider(assetClass: AssetClass): boolean {
  if (assetClass === "CRYPTO") return true; // CoinGecko works without a key
  return Boolean(env.marketData.finnhub || env.marketData.polygon);
}
