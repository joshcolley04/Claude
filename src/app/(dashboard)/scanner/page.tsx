import type { Metadata } from "next";
import { getTopOpportunities } from "@/server/services/opportunities";
import { PageHeader } from "@/components/layout/page-header";
import { OpportunityCard } from "@/components/opportunities/opportunity-card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Market Scanner" };

const SIGNALS = [
  "Momentum",
  "Breakouts",
  "Trend reversals",
  "Relative strength",
  "Volume spikes",
  "Support & resistance",
  "Institutional buying",
  "Market sentiment",
  "Macro catalysts",
  "News catalysts",
];

export default async function ScannerPage() {
  const opportunities = await getTopOpportunities(12);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Market Scanner"
        description="Continuously scans stocks, ETFs, crypto, forex, commodities and indices for high-quality setups."
      >
        <Badge variant="muted">AI-generated · not advice</Badge>
      </PageHeader>

      <div className="flex flex-wrap gap-2">
        {SIGNALS.map((s) => (
          <Badge key={s} variant="outline">{s}</Badge>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {opportunities.map((o) => (
          <OpportunityCard key={o.id} opportunity={o} />
        ))}
      </div>
    </div>
  );
}
