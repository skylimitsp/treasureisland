import { sql } from 'drizzle-orm'

import { counters } from '#/server/db/schema'
import type { Database } from '#/server/db/client'

export type ReferencePrefix = 'TI' | 'ENQ' | 'SLT'

// Atomic upsert-and-increment, so concurrent requests never share a code.
export async function nextReference(
  db: Database,
  prefix: ReferencePrefix,
): Promise<string> {
  const key = `${prefix}-${new Date().getUTCFullYear()}`
  const [row] = await db
    .insert(counters)
    .values({ key, value: 1 })
    .onConflictDoUpdate({
      target: counters.key,
      set: { value: sql`${counters.value} + 1` },
    })
    .returning({ value: counters.value })
  return `${key}-${String(row.value).padStart(4, '0')}`
}
