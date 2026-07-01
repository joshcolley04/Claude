import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getAllocation,
  getPortfolioSummary,
  getPositions,
} from "@/server/services/market-data";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { AllocationChart } from "@/components/dashboard/allocation-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency, formatPercent, trendClass } from "@/lib/utils";

export const metadata: Metadata = { title: "Portfolio" };

export default async function PortfolioPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;
  const [summary, positions, allocation] = await Promise.all([
    getPortfolioSummary(userId),
    getPositions(userId),
    getAllocation(userId),
  ]);

  const invested = summary.totalValue - summary.cashBalance;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Portfolio"
        description="Holdings, cost basis, gains/losses and diversification."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Value" value={formatCurrency(summary.totalValue)} change={summary.dayPnlPct} hint="today" />
        <StatCard label="Invested" value={formatCurrency(invested)} />
        <StatCard label="Cash" value={formatCurrency(summary.cashBalance)} />
        <StatCard label="Weekly / Monthly" value={formatPercent(summary.monthPnlPct)} change={summary.weekPnlPct} hint="week" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Holdings</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="pb-2 font-medium">Asset</th>
                  <th className="pb-2 text-right font-medium">Qty</th>
                  <th className="pb-2 text-right font-medium">Avg Cost</th>
                  <th className="pb-2 text-right font-medium">Price</th>
                  <th className="pb-2 text-right font-medium">Value</th>
                  <th className="pb-2 text-right font-medium">Unrealized</th>
                  <th className="pb-2 text-right font-medium">Weight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {positions.map((p) => (
                  <tr key={p.symbol}>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{p.symbol}</span>
                        <Badge variant="muted" className="text-[10px]">{p.assetClass}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">{p.name}</div>
                    </td>
                    <td className="py-2.5 text-right tabular-nums">{p.quantity}</td>
                    <td className="py-2.5 text-right tabular-nums">{formatCurrency(p.avgCost)}</td>
                    <td className="py-2.5 text-right tabular-nums">{formatCurrency(p.price)}</td>
                    <td className="py-2.5 text-right tabular-nums">{formatCurrency(p.marketValue)}</td>
                    <td className={cn("py-2.5 text-right tabular-nums", trendClass(p.unrealizedPnl))}>
                      {formatCurrency(p.unrealizedPnl)} ({formatPercent(p.unrealizedPnlPct)})
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-muted-foreground">
                      {p.allocationPct.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Diversification</CardTitle>
          </CardHeader>
          <CardContent>
            <AllocationChart data={allocation} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
