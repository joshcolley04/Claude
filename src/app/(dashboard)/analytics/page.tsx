import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPerformanceSeries } from "@/server/services/market-data";
import { returnMetrics } from "@/lib/analytics";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { BacktestPanel } from "@/components/analytics/backtest-panel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPercent } from "@/lib/utils";

export const metadata: Metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  const performance = await getPerformanceSeries(session!.user.id, 180);

  // Real risk/return metrics computed from the portfolio equity series.
  const metrics = returnMetrics(performance.map((p) => p.value));

  const cards = [
    { label: "Total Return (180d)", value: formatPercent(metrics.totalReturnPct) },
    { label: "Max Drawdown", value: formatPercent(metrics.maxDrawdownPct) },
    { label: "Volatility (ann.)", value: `${metrics.volatilityPct.toFixed(1)}%` },
    { label: "Sharpe (ann.)", value: metrics.sharpe?.toFixed(2) ?? "—" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Performance, risk metrics, strategy backtesting and your investment journal."
      />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((m) => (
          <StatCard key={m.label} label={m.label} value={m.value} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Portfolio Growth (180 days)</CardTitle>
        </CardHeader>
        <CardContent>
          <PerformanceChart data={performance} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Strategy Backtesting</CardTitle>
          <CardDescription>
            Simulate a rule-based strategy over historical data. Results are a
            simulation on past data — not a prediction of future performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BacktestPanel />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Investment Journal</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Record your thesis, conviction and lessons for each trade. Journaling
            becomes editable and searchable in a later update.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
