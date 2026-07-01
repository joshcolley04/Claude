import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPerformanceSeries } from "@/server/services/market-data";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Analytics" };

// Illustrative performance metrics for Phase 1 (computed from trades in phase 2).
const METRICS = [
  { label: "Win Rate", value: "63%" },
  { label: "Avg Return / Trade", value: "+4.8%" },
  { label: "Profit Factor", value: "2.1" },
  { label: "Max Drawdown", value: "-11.4%" },
];

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  const performance = await getPerformanceSeries(session!.user.id, 180);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Performance, risk metrics, trade history and your investment journal."
      />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {METRICS.map((m) => (
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
          <CardTitle>Investment Journal</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Record your thesis, conviction and lessons for each trade. Journaling
            becomes editable and searchable in the next phase.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
