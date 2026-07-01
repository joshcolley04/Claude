import { env } from "@/lib/env";
import type { AssetClass, Quote } from "@/types/market";
import type { Candle } from "@/lib/indicators";
import type { MarketDataProvider } from "./types";

const BASE = "https://finnhub.io/api/v1";

/** Finnhub adapter for stocks, ETFs and indices. */
export const finnhubProvider: MarketDataProvider = {
  name: "finnhub",

  supports(assetClass: AssetClass) {
    return (
      assetClass === "STOCK" ||
      assetClass === "ETF" ||
      assetClass === "INDEX"
    );
  },

  async getQuote(symbol, assetClass): Promise<Quote | null> {
    const key = env.marketData.finnhub;
    if (!key) return null;
    try {
      const res = await fetch(
        `${BASE}/quote?symbol=${encodeURIComponent(symbol)}&token=${key}`,
        { next: { revalidate: 30 } },
      );
      if (!res.ok) return null;
      // c = current, pc = previous close, dp = percent change, v not provided here
      const d = (await res.json()) as {
        c: number;
        pc: number;
        dp: number;
      };
      if (!d.c) return null;
      return {
        symbol,
        name: symbol,
        assetClass,
        price: d.c,
        changePct: d.dp ?? (d.pc ? ((d.c - d.pc) / d.pc) * 100 : 0),
        currency: "USD",
      };
    } catch {
      return null;
    }
  },

  async getCandles(symbol, _assetClass, days): Promise<Candle[] | null> {
    const key = env.marketData.finnhub;
    if (!key) return null;
    const to = Math.floor(Date.now() / 1000);
    const from = to - days * 86400;
    try {
      const res = await fetch(
        `${BASE}/stock/candle?symbol=${encodeURIComponent(symbol)}&resolution=D&from=${from}&to=${to}&token=${key}`,
        { next: { revalidate: 300 } },
      );
      if (!res.ok) return null;
      const d = (await res.json()) as {
        s: string;
        t: number[];
        o: number[];
        h: number[];
        l: number[];
        c: number[];
        v: number[];
      };
      if (d.s !== "ok" || !d.t?.length) return null;
      return d.t.map((time, i) => ({
        time,
        open: d.o[i],
        high: d.h[i],
        low: d.l[i],
        close: d.c[i],
        volume: d.v[i],
      }));
    } catch {
      return null;
    }
  },
};
