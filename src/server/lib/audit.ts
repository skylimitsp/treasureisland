import { auditLog } from '#/server/db/schema'
import type { Database } from '#/server/db/client'

// Records who changed what from the dashboard; called by every admin mutation.
export async function audit(
  db: Database,
  entry: {
    actorId: string | null
    action: string
    entity: string
    entityId?: string | null
    diff?: unknown
  },
) {
  await db.insert(auditLog).values({
    actorId: entry.actorId,
    action: entry.action,
    entity: entry.entity,
    entityId: entry.entityId ?? null,
    diff: entry.diff ?? null,
  })
}
