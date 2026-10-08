/// <reference types="@cloudflare/vitest-plugin/types" />
import type { D1Migration } from 'cloudflare:test'

// Test-only binding injected by vitest.config.ts.
declare global {
  namespace Cloudflare {
    interface Env {
      TEST_MIGRATIONS: Array<D1Migration>
    }
  }
}
