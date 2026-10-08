import { eq } from 'drizzle-orm'
import { createMiddleware } from 'hono/factory'

import { idempotencyKeys } from '#/server/db/schema'
import type { AppEnv } from '#/server/env'

// Replays the stored response when the same Idempotency-Key is sent twice.
export const idempotent = (scope: string) =>
  createMiddleware<AppEnv>(async (c, next) => {
    const key = c.req.header('idempotency-key')
    if (!key || key.length > 100) return next()
    const db = c.get('db')
    const id = `${scope}:${key}`
    const prior = await db.query.idempotencyKeys.findFirst({
      where: eq(idempotencyKeys.key, id),
    })
    if (prior) {
      return c.body(prior.body, prior.status as 200, {
        'content-type': 'application/json',
        'idempotent-replay': 'true',
      })
    }
    await next()
    if (c.res.status < 500) {
      const body = await c.res.clone().text()
      await db
        .insert(idempotencyKeys)
        .values({ key: id, scope, status: c.res.status, body })
        .onConflictDoNothing()
    }
  })
