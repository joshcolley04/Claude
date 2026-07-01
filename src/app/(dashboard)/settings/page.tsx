import type { Metadata } from "next";
import { MessageCircle, Coins, LineChart, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { WhatsAppTest } from "@/components/settings/whatsapp-test";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { env } from "@/lib/env";

export const metadata: Metadata = { title: "Settings" };

const INTEGRATIONS = [
  { name: "Coinbase", icon: Coins, desc: "Crypto balances & prices (OAuth)", status: "Available" },
  { name: "TradingView", icon: LineChart, desc: "Charts & alerts", status: "Available" },
  { name: "Robinhood", icon: ShieldCheck, desc: "No official public API", status: "Planned" },
];

/** Live status of the feeds that power quotes and the opportunity scores. */
function dataFeeds() {
  return [
    { name: "Equity / ETF data", desc: "Finnhub quotes, candles & fundamentals", live: Boolean(env.marketData.finnhub) },
    { name: "Crypto data", desc: "CoinGecko quotes & candles", live: true },
    { name: "AI Analyst", desc: `${env.ai.model} (grounded in your data)`, live: Boolean(env.ai.apiKey) },
    { name: "News & sentiment", desc: "Article aggregation & sentiment scoring", live: Boolean(env.news.newsApi || env.news.marketaux) },
  ];
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Risk parameters, notifications, connected services and appearance."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Risk parameters */}
        <Card>
          <CardHeader>
            <CardTitle>Risk & Position Sizing</CardTitle>
            <CardDescription>
              These parameters drive opportunity filtering and alerts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="risk">Risk Tolerance</Label>
              <select
                id="risk"
                defaultValue="MODERATE"
                className="h-10 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="CONSERVATIVE">Conservative</option>
                <option value="MODERATE">Moderate</option>
                <option value="AGGRESSIVE">Aggressive</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="maxpos">Max Position (%)</Label>
                <Input id="maxpos" type="number" defaultValue={10} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="minconf">Min Confidence</Label>
                <Input id="minconf" type="number" defaultValue={70} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sl">Default Stop-Loss (%)</Label>
                <Input id="sl" type="number" defaultValue={8} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tp">Default Take-Profit (%)</Label>
                <Input id="tp" type="number" defaultValue={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* WhatsApp */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-primary" />
              WhatsApp Notifications
            </CardTitle>
            <CardDescription>
              High-conviction alerts via the official WhatsApp Business Cloud API.
              Credentials are read from environment variables only.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WhatsAppTest />
          </CardContent>
        </Card>
      </div>

      {/* Integrations */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Services</CardTitle>
          <CardDescription>
            Broker & market-data integrations use OAuth or API keys — never stored in code.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {INTEGRATIONS.map((i) => {
            const Icon = i.icon;
            return (
              <div key={i.name} className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                <div className="flex items-center justify-between">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <Badge variant={i.status === "Available" ? "success" : "muted"}>
                    {i.status}
                  </Badge>
                </div>
                <p className="mt-2 font-medium">{i.name}</p>
                <p className="text-xs text-muted-foreground">{i.desc}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Data feeds */}
      <Card>
        <CardHeader>
          <CardTitle>Data Feeds</CardTitle>
          <CardDescription>
            Live feeds that power quotes and the opportunity scores. Absent feeds
            fall back to mock data (dev) or keep the related score component neutral.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {dataFeeds().map((f) => (
            <div key={f.name} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] p-4">
              <div>
                <p className="font-medium">{f.name}</p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
              <Badge variant={f.live ? "success" : "muted"}>
                {f.live ? "Live" : "Mock"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
