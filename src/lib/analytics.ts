/**
 * Portfolio / return analytics — pure functions over an equity series or a set
 * of per-trade returns. Used by both the Analytics page (real portfolio) and
 * the backtesting engine so metrics are computed identically everywhere.
 */

export interface ReturnMetrics {
  totalReturnPct: number;
  cagrPct: number | null;
  maxDrawdownPct: number;
  volatilityPct: number; // annualised, from daily returns
  sharpe: number | null; // annualised, rf = 0
}

/** Daily simple returns from an equity/value series. */
export function dailyReturns(values: number[]): number[] {
  const out: number[] = [];
  for (let i = 1; i < values.length; i++) {
    const prev = values[i - 1];
    if (prev === 0) {
      out.push(0);
      continue;
    }
    out.push((values[i] - prev) / prev);
  }
  return out;
}

export function mean(xs: number[]): number {
  if (xs.length === 0) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

export function stddev(xs: number[]): number {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  const variance = xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1);
  return Math.sqrt(variance);
}

/** Maximum peak-to-trough drawdown of an equity series, as a negative %. */
export function maxDrawdownPct(values: number[]): number {
  let peak = -Infinity;
  let maxDd = 0;
  for (const v of values) {
    if (v > peak) peak = v;
    if (peak > 0) {
      const dd = (v - peak) / peak;
      if (dd < maxDd) maxDd = dd;
    }
  }
  return maxDd * 100;
}

const TRADING_DAYS = 252;

/** Full set of return metrics for an equity series (daily cadence assumed). */
export function returnMetrics(values: number[]): ReturnMetrics {
  if (values.length < 2) {
    return { totalReturnPct: 0, cagrPct: null, maxDrawdownPct: 0, volatilityPct: 0, sharpe: null };
  }
  const start = values[0];
  const end = values[values.length - 1];
  const totalReturn = start > 0 ? (end - start) / start : 0;

  const rets = dailyReturns(values);
  const dailyVol = stddev(rets);
  const volatilityPct = dailyVol * Math.sqrt(TRADING_DAYS) * 100;

  const years = values.length / TRADING_DAYS;
  const cagr =
    start > 0 && end > 0 && years > 0 ? Math.pow(end / start, 1 / years) - 1 : null;

  const avgDaily = mean(rets);
  const sharpe = dailyVol > 0 ? (avgDaily / dailyVol) * Math.sqrt(TRADING_DAYS) : null;

  return {
    totalReturnPct: totalReturn * 100,
    cagrPct: cagr === null ? null : cagr * 100,
    maxDrawdownPct: maxDrawdownPct(values),
    volatilityPct,
    sharpe,
  };
}

export interface TradeStats {
  trades: number;
  winRatePct: number;
  avgReturnPct: number;
  profitFactor: number | null; // gross gains / gross losses
}

/** Aggregate statistics from a list of per-trade percentage returns. */
export function tradeStats(returnsPct: number[]): TradeStats {
  const trades = returnsPct.length;
  if (trades === 0) {
    return { trades: 0, winRatePct: 0, avgReturnPct: 0, profitFactor: null };
  }
  const wins = returnsPct.filter((r) => r > 0);
  const grossGain = wins.reduce((a, b) => a + b, 0);
  const grossLoss = returnsPct.filter((r) => r < 0).reduce((a, b) => a + Math.abs(b), 0);
  return {
    trades,
    winRatePct: (wins.length / trades) * 100,
    avgReturnPct: mean(returnsPct),
    profitFactor: grossLoss > 0 ? grossGain / grossLoss : null,
  };
}
