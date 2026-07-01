import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { MarketOverview } from "@/components/dashboard/market-overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockQuotes } from "@/server/services/mock-data";

export const metadata: Metadata = { title: "Watchlists" };

// Phase 1 uses illustrative groupings; watchlists become user-editable in phase 2.
const WATCHLISTS = [
  { name: "High Conviction", symbols: ["NVDA", "AAPL"] },
  { name: "AI Stocks", symbols: ["NVDA", "MSFT"] },
  { name: "Crypto", symbols: ["BTC-USD", "ETH-USD"] },
  { name: "Indices", symbols: ["SPX", "NDX"] },
];

export default function WatchlistsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Watchlists"
        description="Organise the assets you track. Create growth, dividend, AI, crypto and custom lists."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {WATCHLISTS.map((wl) => {
          const quotes = mockQuotes.filter((q) => wl.symbols.includes(q.symbol));
          return (
            <Card key={wl.name}>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>{wl.name}</CardTitle>
                <Badge variant="muted">{quotes.length} assets</Badge>
              </CardHeader>
              <CardContent>
                <MarketOverview quotes={quotes} />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
