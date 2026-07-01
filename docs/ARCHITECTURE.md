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
│   ├── server/services/     # market-data, opportunities, news, ai, whatsapp, mock
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
