import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { createdAt, id, json } from '#/server/db/schema/columns'

export const media = sqliteTable('media', {
  id: id(),
  key: text('key').notNull().unique(),
  contentType: text('content_type').notNull(),
  size: integer('size').notNull(),
  alt: text('alt').notNull().default(''),
  uploadedBy: text('uploaded_by'),
  createdAt: createdAt(),
})

export const auditLog = sqliteTable(
  'audit_log',
  {
    id: id(),
    actorId: text('actor_id'),
    action: text('action').notNull(),
    entity: text('entity').notNull(),
    entityId: text('entity_id'),
    diff: json<unknown>('diff'),
    createdAt: createdAt(),
  },
  (t) => [index('audit_entity_idx').on(t.entity, t.entityId)],
)

// Per-year sequences for reference codes, e.g. key `TI-2026` → 7.
export const counters = sqliteTable('counters', {
  key: text('key').primaryKey(),
  value: integer('value').notNull(),
})

// Replays the first response for a repeated Idempotency-Key (double-submit guard).
export const idempotencyKeys = sqliteTable('idempotency_keys', {
  key: text('key').primaryKey(),
  scope: text('scope').notNull(),
  status: integer('status').notNull(),
  body: text('body').notNull(),
  createdAt: createdAt(),
})
