# Architecture

TRADE24/7 follows a clean, layered architecture. UI never talks to providers
directly — it goes through a service layer, which is the single seam where mock
data is swapped for live providers.

```
┌─────────────────────────────────────────────────────────────┐
│  UI (src/app, src/components)                                 │
│  Server Components fetch via services; Client Components       │
│  handle interactivity and call API routes.                     │
├─────────────────────────────────────────────────────────────┤
│  API Layer (src/app/api/*)                                     │
│  Auth, registration, AI analyst, WhatsApp test. Zod-validated. │
├─────────────────────────────────────────────────────────────┤
│  Service Layer (src/server/services/*)                         │
│  market-data · opportunities · news · ai-analyst · whatsapp    │
│  Falls back to mock-data when a provider key is absent.        │
├─────────────────────────────────────────────────────────────┤
│  Data (Prisma + PostgreSQL)  ·  Auth (NextAuth)                │
└─────────────────────────────────────────────────────────────┘
```

## Folder structure

```
.
├── prisma/
│   ├── schema.prisma        # data model
│   └── seed.ts              # demo user + baseline data
├── public/
├── src/
│   ├── app/
│   │   ├── (auth)/          # login, register (public)
│   │   ├── (dashboard)/     # authenticated app shell + pages
│   │   │   ├── dashboard/   portfolio/   scanner/   ai-analyst/
│   │   │   ├── news/        calendar/    watchlists/ analytics/ settings/
│   │   │   └── layout.tsx   # auth guard + sidebar/topbar/mobile-nav
│   │   ├── api/             # auth, register, ai/analyst, notifications
│   │   ├── layout.tsx       # root layout (fonts, providers)
│   │   ├── globals.css      # design tokens (dark-only)
│   │   └── page.tsx         # marketing landing
│   ├── components/
│   │   ├── ui/              # shadcn-style primitives (button, card, …)
│   │   ├── layout/          # sidebar, topbar, mobile-nav, page-header, brand
│   │   ├── dashboard/       # stat-card, charts, market-overview
│   │   ├── opportunities/   # opportunity-card, score-ring
│   │   ├── news/  calendar/ ai/  settings/
│   │   └── providers.tsx    # SessionProvider + React Query
│   ├── lib/                 # utils, prisma, auth, env, navigation, validations
│   ├── server/services/     # market-data, portfolio, scanner, opportunities,
│   │   │                     #   monitor, news, ai, whatsapp, universe, mock
│   │   └── providers/        # finnhub, coingecko, dispatcher (+cache), mock-candles
│   └── types/               # market types + next-auth augmentation
├── docs/
├── docker-compose.yml
└── Dockerfile
```

## Key decisions

- **Service seam + mock fallback.** Every data read goes through
  `src/server/services`. When a provider key is missing the service returns
  deterministic mock data, so the app is fully explorable in development. Live
  adapters slot in behind the same function signatures with zero UI changes.
- **Server Components for reads.** Pages are React Server Components that call
  services and stream HTML; only interactive pieces (charts, chat, forms) are
  Client Components.
- **Design tokens in CSS variables.** The dark-only palette (night/charcoal/
  slate/white/electric-blue) is defined once in `globals.css` and consumed by
  Tailwind semantic colors.
- **Typed env access.** `src/lib/env.ts` centralises env vars; optional
  integrations never throw at import time so the platform boots without keys.

## Opportunity scoring

`src/server/services/opportunities.ts` defines weighted component scores that
roll up into the overall 0–100 score, keeping the scanner and AI analyst
consistent. Weights live in `SCORE_WEIGHTS`.

## Phase 2: data flow

```
providers (finnhub / coingecko)                indicators.ts
        │  getQuote / getCandles                 (sma/ema/rsi/atr/…)
        ▼  (TTL cache, mock fallback)                   │
   ┌──────────────┐                              ┌───────────────┐
   │ portfolio.ts │  real positions/summary      │  scanner.ts   │  9-factor scores
   └──────┬───────┘  from holdings + quotes      └──────┬────────┘  + ATR-based levels
          │                                             │
   market-data.ts (facade)                       opportunities.ts (persist + read)
          │                                             │
          ▼                                             ▼
     dashboard / portfolio pages              monitor.ts → WhatsApp alerts
                                              (POST/GET /api/scan, cron)
```

- **Indicators** (`src/lib/indicators.ts`) are pure and unit-tested (SMA, EMA,
  RSI with Wilder smoothing, momentum, ATR, volume ratio, support/resistance).
- **Scanner** maps indicators to technical/momentum/volume/liquidity/risk
  scores; fundamental/institutional/sentiment/macro are neutral until Phase 3
  feeds land, and this is stated in the generated thesis so scores are never
  over-interpreted. Stops/targets are derived from ATR (2× ATR stop, 2R/3.5R
  targets).
- **Portfolio** computes positions from `Holding` rows valued with live quotes,
  day P&L from quote change, and week/month performance + the growth curve from
  candle history. Empty accounts fall back to mock data.
- **Monitor** persists a scan batch and alerts each opted-in user on
  opportunities meeting their own `minConfidenceScore`, recording an `Alert`.

## Phase 3: live signals & grounded AI

```
signals.ts ── getSignals(symbol)        getMacroScore()
   │  fundamentals (Finnhub /metric)        economic calendar regime
   │  sentiment (news aggregation)                 │
   ▼                                               ▼
scanner.ts  ← ScanInput.signals / .macroScore  (override neutral components)
   │            absent feed ⇒ component stays neutral (never fabricated)
   ▼
opportunities.ts (buildScanInputs → persist / in-memory)

analyst-context.ts ── portfolio + market + top opportunities
        │
        ▼
ai-analyst.ts askAnalyst(messages, context)  → /api/ai/analyst
   live_context injected as FACTS; model still labels analysis/assumptions
```

- **`signals.ts`** maps raw fundamentals to a 0-100 quality score, aggregates
  per-symbol news sentiment, and derives a market-wide macro score from the
  near-term economic calendar (event risk + forecast surprise). Institutional
  flow remains neutral pending a premium ownership feed.
- **Scanner** now accepts optional `signals` and `macroScore`; a shared `pick`
  helper uses a live value when present and keeps the component neutral (60)
  otherwise. The generated thesis states which components are live vs pending.
- **AI analyst** is grounded via `analyst-context.ts`, which is injected into
  the system prompt as `<live_context>` FACTS; the analyst still labels anything
  beyond it as analysis/assumption and never guarantees outcomes.
- **Settings → Data Feeds** shows each feed's Live/Mock status from `env`.

## Phase 3b: Coinbase broker connection

```
Settings ── /api/brokers/coinbase/connect ── OAuth (state cookie) ── Coinbase
                                                     │
        /api/brokers/coinbase/callback ── exchangeCode ── saveConnection (encrypted)
                                                     │
   /api/brokers/coinbase/accounts (read)   ── getAccessToken (auto-refresh) ── getAccounts
   /api/brokers/coinbase/order  (execute)  ── gates: session + tradingEnabled + confirm
```

- **`src/server/brokers/`** — `coinbase.ts` (OAuth + v2 API, pure token
  functions), `connection.ts` (encrypted persistence, auto-refresh), `types.ts`.
- **`src/lib/crypto.ts`** — AES-256-GCM encryption for tokens at rest
  (`ENCRYPTION_KEY`); unit-tested for roundtrip and tamper detection.
- **Trading safety** — three independent gates (auth, `settings.tradingEnabled`,
  explicit `confirm: true`) and a UI review/confirm step. The scanner, monitor
  and alerts never call the order endpoint; fills are recorded as `Transaction`
  + `Alert` rows for local bookkeeping.

## Phase 4: backtesting, analytics & TradingView

- **`src/lib/analytics.ts`** — pure return/risk metrics (daily returns, max
  drawdown, annualised volatility, Sharpe, CAGR, win rate, profit factor).
  Unit-tested against known values; powers both the Analytics page (real
  portfolio equity series) and the backtester.
- **`src/lib/backtest.ts`** — pure, deterministic long-only engine with fees,
  stop-loss and take-profit, plus built-in `maCrossover` and `rsiReversion`
  strategies (no look-ahead). Unit-tested for exact trade math, fee impact,
  stop exits and crossover detection. Served via `/api/backtest`.
- **TradingView webhook** (`/api/webhooks/tradingview` → `tradingview.ts`) —
  authenticates via `TRADINGVIEW_WEBHOOK_SECRET` (body or query), turns each
  alert into an Opportunity + Alerts + WhatsApp notifications. Optional
  auto-execution routes crypto signals to Coinbase, gated by BOTH
  `tradingEnabled` and `tvAutoExecute` (both default off) — the only automated
  order path in the app.
