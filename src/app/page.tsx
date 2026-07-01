import Link from "next/link";
import {
  ArrowRight,
  Radar,
  Sparkles,
  ShieldCheck,
  Bell,
  LineChart,
  Newspaper,
} from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { Button } from "@/components/ui/button";

const FEATURES = [
  { icon: LineChart, title: "Live Portfolio", desc: "Track value, P&L, allocation and risk across every asset class." },
  { icon: Radar, title: "Market Scanner", desc: "Momentum, breakouts, volume spikes and institutional flow — continuously." },
  { icon: Sparkles, title: "AI Analyst", desc: "Structured research with entries, stops, targets and confidence scores." },
  { icon: Newspaper, title: "News Intelligence", desc: "Aggregated, categorised news that explains why each story matters." },
  { icon: Bell, title: "WhatsApp Alerts", desc: "High-conviction opportunities delivered to your phone in real time." },
  { icon: ShieldCheck, title: "Risk-First", desc: "Capital preservation and disciplined position sizing, built in." },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-night">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-30" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-primary/20 blur-[160px]" />

      {/* Nav */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Brand />
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Get started</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-3xl px-6 pt-16 text-center sm:pt-24">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          AI-powered investment research
        </div>
        <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
          The markets, decoded.
          <span className="block bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            TRADE24/7™
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
          Track investments, scan global markets and surface high-conviction
          opportunities — with an AI analyst that always shows its reasoning and
          the risks.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/register">
              Start free <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          For research & education. Not investment advice.
        </p>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto mt-20 max-w-6xl px-6 pb-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="glass rounded-xl p-5">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
