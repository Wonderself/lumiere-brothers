#!/bin/sh
set -e

echo "=== Lumiere Startup ==="

# Wait for PostgreSQL to be ready
echo "Waiting for database..."
MAX_RETRIES=30
RETRY=0
until node -e "
  const { Pool } = require('pg');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  pool.query('SELECT 1').then(() => { pool.end(); process.exit(0); }).catch(() => { pool.end(); process.exit(1); });
" 2>/dev/null; do
  RETRY=$((RETRY + 1))
  if [ "$RETRY" -ge "$MAX_RETRIES" ]; then
    echo "Database not ready after ${MAX_RETRIES} attempts, starting anyway..."
    break
  fi
  echo "  Retry $RETRY/$MAX_RETRIES..."
  sleep 2
done
echo "Database is ready!"

# Run Prisma schema push (idempotent — safe to run every time)
echo "Syncing database schema..."
npx prisma db push --skip-generate 2>&1 || echo "Warning: db push failed, schema may already be in sync"

# Seed database if SEED_DB=true (only on first deploy)
if [ "$SEED_DB" = "true" ]; then
  echo "Seeding database..."
  npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts 2>&1 || echo "Warning: seed failed (data may already exist)"
fi

echo "Starting Next.js server..."
exec node server.js
