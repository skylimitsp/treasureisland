import { getCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'

import { createDb } from '#/server/db/client'
import { SESSION_COOKIE, getSessionUser } from '#/server/services/auth.service'
import type { AppEnv } from '#/server/env'

// Attaches the DB and (if a valid cookie is present) the signed-in staff member.
export const context = createMiddleware<AppEnv>(async (c, next) => {
  const db = createDb(c.env.DB)
  c.set('db', db)
  const token = getCookie(c, SESSION_COOKIE)
  c.set('user', token ? await getSessionUser(db, token) : null)
  await next()
})
