# TRADE24/7™ — AI Investment Platform

An institutional-grade, AI-powered investment research and portfolio platform.
Track investments, monitor global markets, scan for high-quality opportunities,
and receive intelligent, risk-first trade alerts.

> **Not investment advice.** TRADE24/7 is a research and education tool. It never
> guarantees outcomes, and every AI output separates facts, analysis and
> assumptions and states the principal risks.

---

## ✨ Features

- **Dashboard** — portfolio value, daily/weekly/monthly P&L, cash, positions, allocation, performance chart, market overview, news, economic calendar and AI opportunities.
- **Portfolio Management** — holdings, average cost, unrealized P&L, diversification and sector allocation.
- **Market Scanner** — momentum, breakouts, reversals, relative strength, volume spikes, institutional flow and news/macro catalysts across stocks, ETFs, crypto, forex, commodities and indices.
- **AI Investment Analyst** — structured research with entry, stop-loss, targets, holding period, position size, risk/reward and confidence.
- **Opportunity Scoring** — a 0–100 score with a 9-factor breakdown (technical, fundamental, momentum, volume, institutional, sentiment, macro, liquidity, risk).
- **News Intelligence** — categorised financial news with "why it matters".
- **Economic Calendar** — rate decisions, inflation, GDP, employment, earnings and their likely market impact.
- **Watchlists** — growth, dividend, AI, crypto, high-conviction and custom lists.
- **WhatsApp Notifications** — high-conviction alerts via the official WhatsApp Business Cloud API, with a built-in "Send Test Notification".
- **Analytics** — win rate, average return, risk metrics, portfolio growth and an investment journal.
- **Settings** — risk tolerance, position sizing, stop-loss/take-profit defaults, notification preferences and connected services.

## 🧱 Tech Stack

Next.js 14 (App Router) · TypeScript · React · Tailwind CSS · Framer Motion ·
shadcn-style UI (Radix) · Lucide · Prisma · PostgreSQL · NextAuth ·
TanStack React Query · Recharts / TradingView Lightweight Charts · Docker.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env        # then edit values (see docs/SETUP.md)

# 3. Start PostgreSQL (Docker)
docker compose up -d db

# 4. Create the schema and seed a demo user
npm run db:push
npm run db:seed             # demo@trade247.local / Demo1234!

# 5. Run the dev server
npm run dev                 # http://localhost:3000
```

The platform runs end-to-end with **mock market data** when no provider keys are
set (`ENABLE_MOCK_DATA=true`), so you can explore the full UI immediately.

## 📚 Documentation

- [Architecture](docs/ARCHITECTURE.md) — folder structure, layers and data flow.
- [Setup & Integrations](docs/SETUP.md) — env vars, WhatsApp, market data, GitHub.
- [Deployment](docs/DEPLOYMENT.md) — Vercel / Docker, migrations and scaling.

## 🗺️ Roadmap (build phases)

- **Phase 1** — architecture, schema, auth, core layout, dashboard and all primary screens with a mock-data seam. ✅
- **Phase 2** — live market-data adapters (Finnhub, CoinGecko), a technical-indicator library, a scanner engine that produces the 9-factor scores, real portfolio computation from holdings, persisted opportunities, and a scheduled opportunity monitor that dispatches WhatsApp alerts. ✅
- **Phase 3 (this release)** — live fundamental (Finnhub metrics), sentiment (news aggregation) and macro (economic-calendar regime) feeds that activate the scanner's previously-neutral score components, plus an AI analyst grounded in the user's live portfolio, market overview and scanner opportunities. Any absent feed keeps its score component neutral rather than fabricating data. ✅
- **Phase 3b (this release)** — Coinbase broker connection via OAuth: balance/position sync plus optional live trading (buys/sells). Tokens are AES-256-GCM encrypted at rest; trading is off by default and every order requires explicit confirmation — the scanner/monitor never auto-trade. ✅
- **Phase 4 (this release)** — a pure, unit-tested backtesting engine (MA-crossover & RSI-reversion strategies with fees/stops/targets), real risk/return analytics (total return, CAGR, max drawdown, volatility, Sharpe, win rate, profit factor) on the Analytics page, and a **TradingView alert webhook** that turns TradingView alerts into in-app opportunities + notifications, with optional opt-in auto-execution routed to Coinbase. ✅
- **Later** — multi-portfolio support, a live institutional-ownership feed, and a live-trading broker such as Alpaca.

### Scheduled scanning

`POST`/`GET /api/scan` runs the scanner over the universe, persists opportunities
and sends alerts to opted-in users. Secure it with `CRON_SECRET`
(`Authorization: Bearer <secret>`); `vercel.json` schedules it hourly. Vercel
Cron adds the bearer token automatically when `CRON_SECRET` is set.

## 🔒 Security

Secrets live only in environment variables — never in source, prompts or the
database. All external input is validated with Zod. Authentication uses NextAuth
with hashed credentials (bcrypt) and OAuth providers where configured. Broker
OAuth tokens are AES-256-GCM encrypted at rest (`ENCRYPTION_KEY`) and never
logged. Trade execution is opt-in per user and gated behind explicit per-order
confirmation; automated flows never place orders.
