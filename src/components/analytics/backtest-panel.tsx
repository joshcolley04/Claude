"use client";

import { useState } from "react";
import { FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { cn, formatPercent, trendClass } from "@/lib/utils";
import type { PerformancePoint } from "@/types/market";

interface BacktestResponse {
  symbol: string;
  strategy: string;
  bars: number;
  metrics: {
    totalReturnPct: number;
    cagrPct: number | null;
    maxDrawdownPct: number;
    volatilityPct: number;
    sharpe: number | null;
  };
  stats: {
    trades: number;
    winRatePct: number;
    avgReturnPct: number;
    profitFactor: number | null;
  };
  equityCurve: number[];
}

const ASSET_CLASSES = ["STOCK", "ETF", "CRYPTO", "INDEX"] as const;

export function BacktestPanel() {
  const [symbol, setSymbol] = useState("AAPL");
  const [assetClass, setAssetClass] = useState<(typeof ASSET_CLASSES)[number]>("STOCK");
  const [strategy, setStrategy] = useState("ma_crossover");
  const [days, setDays] = useState(365);
  const [result, setResult] = useState<BacktestResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/backtest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: symbol.toUpperCase(), assetClass, strategy, days }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Backtest failed");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Backtest failed");
    } finally {
      setLoading(false);
    }
  }

  const curvePoints: PerformancePoint[] = result
    ? result.equityCurve.map((value, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (result.equityCurve.length - i));
        return { date: d.toISOString().slice(0, 10), value };
      })
    : [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="space-y-1.5">
          <Label htmlFor="bt-symbol">Symbol</Label>
          <Input id="bt-symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bt-class">Asset class</Label>
          <select
            id="bt-class"
            value={assetClass}
            onChange={(e) => setAssetClass(e.target.value as (typeof ASSET_CLASSES)[number])}
            className="h-10 w-full rounded-lg border border-white/10 bg-white/[0.03] px-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            {ASSET_CLASSES.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bt-strat">Strategy</Label>
          <select
            id="bt-strat"
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
            className="h-10 w-full rounded-lg border border-white/10 bg-white/[0.03] px-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="ma_crossover">MA Crossover (20/50)</option>
            <option value="rsi_reversion">RSI Reversion (14, 35/65)</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bt-days">History (days)</Label>
          <Input
            id="bt-days"
            type="number"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            min={60}
            max={1000}
          />
        </div>
      </div>

      <Button onClick={run} disabled={loading}>
        <FlaskConical className="h-4 w-4" />
        {loading ? "Running…" : "Run backtest"}
      </Button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Metric label="Total Return" value={formatPercent(result.metrics.totalReturnPct)} tone={trendClass(result.metrics.totalReturnPct)} />
            <Metric label="Max Drawdown" value={formatPercent(result.metrics.maxDrawdownPct)} tone="text-destructive" />
            <Metric label="Win Rate" value={`${result.stats.winRatePct.toFixed(0)}%`} />
            <Metric label="Trades" value={String(result.stats.trades)} />
            <Metric label="Avg / Trade" value={formatPercent(result.stats.avgReturnPct)} tone={trendClass(result.stats.avgReturnPct)} />
            <Metric label="Profit Factor" value={result.stats.profitFactor?.toFixed(2) ?? "—"} />
            <Metric label="Sharpe" value={result.metrics.sharpe?.toFixed(2) ?? "—"} />
            <Metric label="Volatility" value={`${result.metrics.volatilityPct.toFixed(0)}%`} />
          </div>
          <PerformanceChart data={curvePoints} />
          <p className="text-xs text-muted-foreground">
            Simulation of {result.strategy} on {result.bars} bars of {result.symbol}.
            Past simulated performance is not a prediction of future results.
          </p>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={cn("mt-0.5 text-lg font-semibold tabular-nums", tone)}>{value}</p>
    </div>
  );
}
