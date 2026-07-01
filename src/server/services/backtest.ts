/**
 * Backtest service — fetches candle history for a symbol and runs a chosen
 * built-in strategy through the pure backtest engine.
 */
import type { AssetClass } from "@/types/market";
import {
  runBacktest,
  STRATEGIES,
  type BacktestResult,
  type StrategyKey,
} from "@/lib/backtest";
import { getCandles } from "./providers";

export interface BacktestRequest {
  symbol: string;
  assetClass: AssetClass;
  strategy: StrategyKey;
  days?: number;
  feePct?: number;
  stopPct?: number;
  takePct?: number;
}

export interface BacktestSummary {
  symbol: string;
  strategy: string;
  bars: number;
  result: BacktestResult;
}

export async function runSymbolBacktest(
  req: BacktestRequest,
): Promise<BacktestSummary> {
  const strategyDef = STRATEGIES[req.strategy];
  if (!strategyDef) throw new Error(`Unknown strategy: ${req.strategy}`);

  const days = Math.min(Math.max(req.days ?? 365, 60), 1000);
  const candles = await getCandles(req.symbol, req.assetClass, days);

  const result = runBacktest(candles, strategyDef.make(), {
    feePct: req.feePct ?? 0.001,
    stopPct: req.stopPct,
    takePct: req.takePct,
  });

  return {
    symbol: req.symbol,
    strategy: strategyDef.label,
    bars: candles.length,
    result,
  };
}
