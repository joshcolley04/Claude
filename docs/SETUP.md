# Setup & Integrations

## 1. Prerequisites

- Node.js 20+
- Docker (for local PostgreSQL) or an existing PostgreSQL 14+ instance

## 2. Environment variables

Copy `.env.example` to `.env` and fill in values. Only two are required to boot:

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | ✅ | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | ✅ (prod) | e.g. `https://app.example.com` |
| `ANTHROPIC_API_KEY` | ⛅ | Enables the live AI Analyst; otherwise illustrative responses |
| `FINNHUB_API_KEY` / `POLYGON_API_KEY` / `COINGECKO_API_KEY` | ⛅ | Live market data; otherwise mock data |
| `NEWSAPI_KEY` / `MARKETAUX_API_KEY` | ⛅ | Live news |
| `WHATSAPP_*` | ⛅ | WhatsApp alerts (see below) |
| `GITHUB_*` / `GOOGLE_*` | ⛅ | OAuth sign-in |

`ENABLE_MOCK_DATA=true` (default) lets the app run fully with synthetic data.

## 3. Database

```bash
docker compose up -d db     # start PostgreSQL
npm run db:push             # apply the Prisma schema
npm run db:seed             # optional: demo user demo@trade247.local / Demo1234!
npm run db:studio           # optional: browse data
```

For production, prefer migrations: `npm run db:migrate`.

## 4. Local development

```bash
npm install
npm run dev                 # http://localhost:3000
```

## 5. WhatsApp Business API

TRADE24/7 uses the **official WhatsApp Business Cloud API** (Meta Graph API).
Credentials are read only from environment variables — never from code or the DB.

1. Create a Meta app at <https://developers.facebook.com> and add the
   **WhatsApp** product.
2. In the WhatsApp → API Setup panel, note:
   - **Phone number ID** → `WHATSAPP_PHONE_NUMBER_ID`
   - **Temporary/permanent access token** → `WHATSAPP_ACCESS_TOKEN`
   - **WhatsApp Business Account ID** → `WHATSAPP_BUSINESS_ACCOUNT_ID`
3. For production, generate a **permanent System User token** (Business Settings
   → System Users) with `whatsapp_business_messaging` permission.
4. Add the recipient number in E.164 form (e.g. `+447700900123`) as
   `WHATSAPP_DEFAULT_RECIPIENT`. For business-initiated messages outside the
   24-hour window, create and get approval for a message **template** and set
   `WHATSAPP_TEMPLATE_NAME`.
5. Verify: go to **Settings → WhatsApp Notifications → Send Test Notification**.
   Without credentials the test returns a *simulated OK* so you can wire the UI
   first; with credentials it delivers a real message.

Alerts are sent by `src/server/services/whatsapp.ts` when the monitoring logic
identifies an opportunity at or above your configured minimum confidence score.

## 6. Broker & market-data integrations

### Coinbase (OAuth — balances + optional trading)

1. Create an OAuth app at <https://www.coinbase.com/settings/api> (or the
   Coinbase Developer Platform) and note the **Client ID** and **Client Secret**.
2. Set the redirect/callback URL to
   `<NEXTAUTH_URL>/api/brokers/coinbase/callback` (must match exactly).
3. Fill in `.env`:
   ```
   COINBASE_CLIENT_ID="..."
   COINBASE_CLIENT_SECRET="..."
   COINBASE_REDIRECT_URI="http://localhost:3000/api/brokers/coinbase/callback"
   ENCRYPTION_KEY="$(openssl rand -base64 32)"   # encrypts stored tokens
   ```
4. In the app: **Settings → Coinbase → Connect Coinbase**. After authorising,
   balances appear automatically.
5. Requested scopes: `wallet:accounts:read`, `wallet:user:read`,
   `wallet:buys:create`, `wallet:sells:create`.

**Trading is OFF by default.** To place real orders, toggle *Enable live trading*
in Settings; each order then requires an explicit in-app confirmation. The
scanner, monitor and alerts **never** place orders — execution only happens from
a deliberate user action. OAuth tokens are AES-256-GCM encrypted at rest with
`ENCRYPTION_KEY` and are never logged or stored in plaintext.

### Others

- **TradingView** — charts via Lightweight Charts; alert ingestion via inbound
  webhook is planned. No portfolio/balances API exists.
- **Robinhood** — no official public API; a broker adapter interface is reserved
  for when an authorised integration (e.g. Alpaca) is added.

Never store user broker credentials in prompts, source code or config files.

## 7. GitHub setup

```bash
git init
git add .
git commit -m "Initial TRADE24/7 platform"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

Add the secrets from `.env` to your CI/hosting provider's environment settings —
never commit `.env`.
