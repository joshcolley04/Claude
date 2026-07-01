import type { Metadata } from "next";
import { Wallet, TrendingUp, PiggyBank, LineChart, Sparkles } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getAllocation,
  getMarketOverview,
  getPerformanceSeries,
  getPortfolioSummary,
  getPositions,
} from "@/server/services/market-data";
import { getTopOpportunities } from "@/server/services/opportunities";
import { getEconomicCalendar, getLatestNews } from "@/server/services/news";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { AllocationChart } from "@/components/dashboard/allocation-chart";
import { MarketOverview } from "@/components/dashboard/market-overview";
import { OpportunityCard } from "@/components/opportunities/opportunity-card";
import { NewsList } from "@/components/news/news-list";
import { EconomicCalendar } from "@/components/calendar/economic-calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPercent, trendClass } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const [summary, positions, allocation, performance, quotes, opportunities, news, events] =
    await Promise.all([
      getPortfolioSummary(userId),
      getPositions(userId),
      getAllocation(userId),
      getPerformanceSeries(userId, 90),
      getMarketOverview(),
      getTopOpportunities(3),
      getLatestNews(),
      getEconomicCalendar(),
    ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back${session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}`}
        description="Your portfolio and the markets at a glance."
      />

      {/* Top stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Portfolio Value"
          value={formatCurrency(summary.totalValue)}
          change={summary.dayPnlPct}
          hint="today"
          icon={Wallet}
        />
        <StatCard
          label="Today's P&L"
          value={formatCurrency(summary.dayPnl)}
          change={summary.dayPnlPct}
          icon={TrendingUp}
        />
        <StatCard
          label="Cash Balance"
          value={formatCurrency(summary.cashBalance)}
          hint={`${summary.openPositions} open · ${summary.closedPositions} closed`}
          icon={PiggyBank}
        />
        <StatCard
          label="Monthly Performance"
          value={formatPercent(summary.monthPnlPct)}
          change={summary.weekPnlPct}
          hint="this week"
          icon={LineChart}
        />
      </div>

      {/* Performance + allocation */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Portfolio Performance</CardTitle>
            <Badge variant="muted">90 days</Badge>
          </CardHeader>
          <CardContent>
            <PerformanceChart data={performance} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <AllocationChart data={allocation} />
          </CardContent>
        </Card>
      </div>

      {/* Opportunities */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-semibold">Highest-Conviction Opportunities</h2>
          </div>
          <Badge variant="muted">AI-generated · not advice</Badge>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {opportunities.map((o) => (
            <OpportunityCard key={o.id} opportunity={o} />
          ))}
        </div>
      </div>

      {/* Positions + market */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Open Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="pb-2 font-medium">Asset</th>
                    <th className="pb-2 text-right font-medium">Qty</th>
                    <th className="pb-2 text-right font-medium">Avg Cost</th>
                    <th className="pb-2 text-right font-medium">Price</th>
                    <th className="pb-2 text-right font-medium">Value</th>
                    <th className="pb-2 text-right font-medium">P&L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {positions.map((p) => (
                    <tr key={p.symbol}>
                      <td className="py-2.5">
                        <div className="font-medium">{p.symbol}</div>
                        <div className="text-xs text-muted-foreground">{p.name}</div>
                      </td>
                      <td className="py-2.5 text-right tabular-nums">{p.quantity}</td>
                      <td className="py-2.5 text-right tabular-nums">{formatCurrency(p.avgCost)}</td>
                      <td className="py-2.5 text-right tabular-nums">{formatCurrency(p.price)}</td>
                      <td className="py-2.5 text-right tabular-nums">{formatCurrency(p.marketValue)}</td>
                      <td className={cn("py-2.5 text-right tabular-nums", trendClass(p.unrealizedPnl))}>
                        {formatPercent(p.unrealizedPnlPct)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Market Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <MarketOverview quotes={quotes} />
          </CardContent>
        </Card>
      </div>

      {/* News + calendar */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>News Intelligence</CardTitle>
          </CardHeader>
          <CardContent>
            <NewsList items={news.slice(0, 4)} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Economic Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <EconomicCalendar events={events} showImpact={false} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
