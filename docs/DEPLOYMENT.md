# Deployment

## Option A — Vercel (recommended for the web app)

1. Push the repo to GitHub.
2. Import the project in Vercel.
3. Add all environment variables from `.env` in **Project → Settings →
   Environment Variables** (set `NEXTAUTH_URL` to your production URL).
4. Provision managed PostgreSQL (Vercel Postgres, Neon, Supabase or RDS) and set
   `DATABASE_URL`.
5. The `build` script runs `prisma generate` automatically. Apply the schema
   once from your machine or a CI step:
   ```bash
   npx prisma migrate deploy
   ```

## Option B — Docker

```bash
# Build the production image
docker build -t trade247 .

# Run with your env file (point DATABASE_URL at a reachable Postgres)
docker run --env-file .env -p 3000:3000 trade247
```

Or the full stack — uncomment the `app` service in `docker-compose.yml`, then:

```bash
docker compose up -d --build
docker compose exec app npx prisma migrate deploy
```

## Migrations

- Development: `npm run db:migrate` (creates + applies a migration).
- Production: `npx prisma migrate deploy` (applies committed migrations only).

## Health & observability

- Add a `/api/health` route and wire your platform's health checks to it (phase 2).
- Route Prisma and app logs to your provider's log drain.

## Scaling recommendations

- **Stateless app tier.** The Next.js app is stateless (JWT sessions); scale
  horizontally behind a load balancer.
- **Database.** Use a managed Postgres with connection pooling (PgBouncer /
  Prisma Accelerate). Add read replicas for analytics-heavy reads.
- **Market-data ingestion.** Move live polling into background workers / cron
  (e.g. a queue + scheduled jobs) that write `PriceSnapshot` and `Opportunity`
  rows, so request paths stay fast.
- **Caching.** Cache quotes and news with short TTLs (React Query on the client,
  a Redis layer server-side) to respect provider rate limits.
- **Alerting jobs.** Run the opportunity-monitor + WhatsApp dispatch as a
  scheduled job separate from the web tier.
- **Secrets.** Use your platform's secret manager; rotate WhatsApp and provider
  tokens regularly.
