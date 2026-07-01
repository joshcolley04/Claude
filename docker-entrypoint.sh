#!/bin/sh
set -e

# Turnkey startup for the all-in-one Docker setup:
#  1. Wait for Postgres, 2. apply the schema, 3. seed a demo user (first run),
#  4. start the server. Safe to re-run — db push and seed are idempotent.

echo "→ Applying database schema..."
npx prisma db push --skip-generate

if [ "${SEED_ON_START:-true}" = "true" ]; then
  echo "→ Seeding demo data (idempotent)..."
  npx tsx prisma/seed.ts || echo "  (seed skipped/failed — continuing)"
fi

echo "→ Starting TRADE24/7 on port 3000..."
exec npm run start
