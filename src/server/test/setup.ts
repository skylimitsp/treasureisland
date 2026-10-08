import { applyD1Migrations } from 'cloudflare:test'
import { env } from 'cloudflare:workers'

// Idempotent: D1 records applied migrations, so re-running per file is cheap.
await applyD1Migrations(env.DB, env.TEST_MIGRATIONS)
