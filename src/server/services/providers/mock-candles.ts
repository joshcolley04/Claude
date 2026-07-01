import type { Candle } from "@/lib/indicators";

/**
 * Deterministic synthetic daily candles for a symbol, used when no provider is
 * configured. Seeded by the symbol so a given symbol always produces the same
 * series (stable demos + reproducible scanner output).
 */
export function mockCandles(symbol: string, base: number, days = 120): Candle[] {
  // Simple string hash -> seed.
  let seed = 0;
  for (let i = 0; i < symbol.length; i++) seed = (seed * 31 + symbol.charCodeAt(i)) >>> 0;

  const rand = () => {
    // Mulberry32 PRNG.
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const candles: Candle[] = [];
  let close = base * 0.8;
  const now = Math.floor(Date.now() / 1000);
  const drift = base * 0.0018; // gentle uptrend
  for (let i = days - 1; i >= 0; i--) {
    const vol = (rand() - 0.5) * base * 0.03;
    const open = close;
    close = Math.max(open + drift + vol, base * 0.1);
    const high = Math.max(open, close) + rand() * base * 0.01;
    const low = Math.min(open, close) - rand() * base * 0.01;
    candles.push({
      time: now - i * 86400,
      open,
      high,
      low,
      close,
      volume: Math.round(1_000_000 * (0.6 + rand())),
    });
  }
  return candles;
}
