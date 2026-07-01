/**
 * Backtesting engine — pure and deterministic.
 *
 * Simulates a long-only strategy over a candle series: enter on a BUY signal
 * when flat, exit on a SELL signal (or an optional stop/target), and track the
 * equity curve and per-trade returns. Combined with `analytics.ts` this yields
 * total return, CAGR, win rate, profit factor, max drawdown and Sharpe.
 *
 * This answers "if I'd followed this rule over history, how would I have done?"
 * It is a simulation on past data and is NOT a prediction of future results.
 */
import type { Candle } from "./indicators";
import { ema, rsi, sma } from "./indicators";
import { returnMetrics, tradeStats, type ReturnMetrics, type TradeStats } from "./analytics";

export type Signal = "BUY" | "SELL" | null;

/**
 * A strategy inspects the closes up to and including index `i` and returns a
 * signal for that bar. It must not look ahead (only use closes[0..i]).
 */
export type Strategy = (closes: number[], i: number) => Signal;

export interface BacktestTrade {
  entryIndex: number;
  exitIndex: number;
  entryPrice: number;
  exitPrice: number;
  returnPct: number;
}

export interface BacktestOptions {
  /** Fractional cost applied on entry and on exit (e.g. 0.001 = 0.1%). */
  feePct?: number;
  /** Optional hard stop as a fraction below entry (e.g. 0.1 = -10%). */
  stopPct?: number;
  /** Optional take-profit as a fraction above entry. */
  takePct?: number;
  /** Starting equity for the curve. */
  initialEquity?: number;
}

export interface BacktestResult {
  trades: BacktestTrade[];
  equityCurve: number[];
  metrics: ReturnMetrics;
  stats: TradeStats;
}

export function runBacktest(
  candles: Candle[],
  strategy: Strategy,
  opts: BacktestOptions = {},
): BacktestResult {
  const feePct = opts.feePct ?? 0;
  const initialEquity = opts.initialEquity ?? 10_000;
  const closes = candles.map((c) => c.close);

  const trades: BacktestTrade[] = [];
  const equityCurve: number[] = [];
  let equity = initialEquity;
  let inPosition = false;
  let entryPrice = 0;
  let entryIndex = 0;

  const closeTrade = (i: number, exitPriceRaw: number) => {
    const exitPrice = exitPriceRaw * (1 - feePct);
    const gross = (exitPrice - entryPrice) / entryPrice;
    equity *= 1 + gross;
    trades.push({
      entryIndex,
      exitIndex: i,
      entryPrice,
      exitPrice,
      returnPct: gross * 100,
    });
    inPosition = false;
  };

  for (let i = 0; i < closes.length; i++) {
    const price = closes[i];

    if (inPosition) {
      // Check stop / target intrabar using this bar's low/high when available.
      const stop = opts.stopPct ? entryPrice * (1 - opts.stopPct) : null;
      const take = opts.takePct ? entryPrice * (1 + opts.takePct) : null;
      const low = candles[i].low;
      const high = candles[i].high;
      if (stop !== null && low <= stop) {
        closeTrade(i, stop);
      } else if (take !== null && high >= take) {
        closeTrade(i, take);
      }
    }

    const signal = strategy(closes, i);
    if (!inPosition && signal === "BUY") {
      entryPrice = price * (1 + feePct);
      entryIndex = i;
      inPosition = true;
    } else if (inPosition && signal === "SELL") {
      closeTrade(i, price);
    }

    // Mark-to-market equity for the curve.
    if (inPosition) {
      const mtm = (price - entryPrice) / entryPrice;
      equityCurve.push(equity * (1 + mtm));
    } else {
      equityCurve.push(equity);
    }
  }

  // Close any open position at the last price.
  if (inPosition) closeTrade(closes.length - 1, closes[closes.length - 1]);

  return {
    trades,
    equityCurve,
    metrics: returnMetrics(equityCurve),
    stats: tradeStats(trades.map((t) => t.returnPct)),
  };
}

// --- Built-in strategies ---------------------------------------------------

/** Moving-average crossover: BUY when fast EMA crosses above slow SMA, SELL below. */
export function maCrossover(fast = 20, slow = 50): Strategy {
  return (closes, i) => {
    if (i < slow) return null;
    const window = closes.slice(0, i + 1);
    const prevWindow = closes.slice(0, i);
    const f = ema(window, fast);
    const s = sma(window, slow);
    const pf = ema(prevWindow, fast);
    const ps = sma(prevWindow, slow);
    if (f === null || s === null || pf === null || ps === null) return null;
    if (pf <= ps && f > s) return "BUY";
    if (pf >= ps && f < s) return "SELL";
    return null;
  };
}

/** RSI mean-reversion: BUY when RSI crosses up through `buyBelow`, SELL through `sellAbove`. */
export function rsiReversion(period = 14, buyBelow = 35, sellAbove = 65): Strategy {
  return (closes, i) => {
    if (i < period + 1) return null;
    const now = rsi(closes.slice(0, i + 1), period);
    const prev = rsi(closes.slice(0, i), period);
    if (now === null || prev === null) return null;
    if (prev < buyBelow && now >= buyBelow) return "BUY";
    if (prev > sellAbove && now <= sellAbove) return "SELL";
    return null;
  };
}

export const STRATEGIES = {
  ma_crossover: { label: "MA Crossover (20/50)", make: () => maCrossover(20, 50) },
  rsi_reversion: { label: "RSI Reversion (14, 35/65)", make: () => rsiReversion(14, 35, 65) },
} as const;

export type StrategyKey = keyof typeof STRATEGIES;
