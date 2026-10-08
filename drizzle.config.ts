import { defineConfig } from 'drizzle-kit'

// Generates SQL migrations into ./drizzle; apply them with `wrangler d1 migrations apply`.
export default defineConfig({
  dialect: 'sqlite',
  schema: './src/server/db/schema/index.ts',
  out: './drizzle',
})
