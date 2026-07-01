/**
 * Technical indicators — pure functions over price/volume series.
 *
 * All functions are side-effect free and return `null` when there is
 * insufficient data, so callers can degrade gracefully. Series are expected in
 * chronological order (oldest first).
 */

export interface Candle {
  time: number; // unix seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/** Simple Moving Average of the last `period` values. */
export function sma(values: number[], period: number): number | null {
  if (period <= 0 || values.length < period) return null;
  const slice = values.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

/** Exponential Moving Average (returns the latest EMA value). */
export function ema(values: number[], period: number): number | null {
  if (period <= 0 || values.length < period) return null;
  const k = 2 / (period + 1);
  // Seed with the SMA of the first `period` values.
  let prev = values.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < values.length; i++) {
    prev = values[i] * k + prev * (1 - k);
  }
  return prev;
}

/**
 * Relative Strength Index (Wilder's smoothing). Returns 0-100 or null.
 */
export function rsi(values: number[], period = 14): number | null {
  if (values.length < period + 1) return null;
  let gains = 0;
  let losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = values[i] - values[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  for (let i = period + 1; i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
  }
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

/** Percentage momentum over `period` bars. */
export function momentum(values: number[], period = 20): number | null {
  if (values.length < period + 1) return null;
  const past = values[values.length - 1 - period];
  const now = values[values.length - 1];
  if (past === 0) return null;
  return ((now - past) / past) * 100;
}

/** Average True Range — volatility measure used for stops/targets. */
export function atr(candles: Candle[], period = 14): number | null {
  if (candles.length < period + 1) return null;
  const trs: number[] = [];
  for (let i = 1; i < candles.length; i++) {
    const c = candles[i];
    const prevClose = candles[i - 1].close;
    trs.push(
      Math.max(
        c.high - c.low,
        Math.abs(c.high - prevClose),
        Math.abs(c.low - prevClose),
      ),
    );
  }
  return sma(trs, period);
}

/** Latest volume vs. its `period`-bar average, as a ratio (1 = average). */
export function volumeRatio(candles: Candle[], period = 20): number | null {
  if (candles.length < period + 1) return null;
  const vols = candles.map((c) => c.volume);
  const avg = sma(vols.slice(0, -1), period);
  if (!avg || avg === 0) return null;
  return vols[vols.length - 1] / avg;
}

/** Naive support/resistance from recent swing low/high. */
export function supportResistance(
  candles: Candle[],
  lookback = 30,
): { support: number; resistance: number } | null {
  if (candles.length < 2) return null;
  const slice = candles.slice(-lookback);
  return {
    support: Math.min(...slice.map((c) => c.low)),
    resistance: Math.max(...slice.map((c) => c.high)),
  };
}

/** Clamp a number into the 0-100 range and round it. */
export function clampScore(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}
