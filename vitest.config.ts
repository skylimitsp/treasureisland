import { defineConfig } from 'vitest/config'
import { cloudflareTest, readD1Migrations } from '@cloudflare/vitest-plugin'

// API tests run inside workerd against a real (local) D1 with the app's migrations.
export default defineConfig(async () => {
  const migrations = await readD1Migrations('./drizzle')
  return {
    resolve: { tsconfigPaths: true },
    plugins: [
      cloudflareTest({
        wrangler: { configPath: './wrangler.test.jsonc' },
        miniflare: {
          // Blank secrets so tests never send real email or call Turnstile.
          bindings: {
            TEST_MIGRATIONS: migrations,
            RESEND_API_KEY: '',
            TURNSTILE_SECRET: '',
          },
        },
      }),
    ],
    test: {
      include: ['src/server/**/*.test.ts'],
      setupFiles: ['./src/server/test/setup.ts'],
    },
  }
})
