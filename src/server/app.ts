import { Hono } from 'hono'
import { secureHeaders } from 'hono/secure-headers'

import { ApiError } from '#/server/lib/errors'
import { context } from '#/server/middleware/context'
import { sameOrigin } from '#/server/middleware/same-origin'
import { requireAdmin, requireStaff } from '#/server/middleware/require-role'
import { catalogueRoutes } from '#/server/routes/public/catalogue.route'
import { submissionRoutes } from '#/server/routes/public/submissions.route'
import { authRoutes } from '#/server/routes/public/auth.route'
import { operationsRoutes } from '#/server/routes/admin/operations.route'
import { catalogueAdminRoutes } from '#/server/routes/admin/catalogue.route'
import { peopleRoutes } from '#/server/routes/admin/people.route'
import type { AppEnv } from '#/server/env'

// REST API for the site and dashboard; mounted by src/routes/api/v1/$.ts.
export const app = new Hono<AppEnv>().basePath('/api/v1')

app.use('*', secureHeaders())
app.use('*', sameOrigin)
app.use('*', context)
app.use('*', async (c, next) => {
  const started = Date.now()
  await next()
  console.info(
    JSON.stringify({
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
      ms: Date.now() - started,
    }),
  )
})

app.get('/health', async (c) => {
  await c.env.DB.prepare('select 1').first()
  return c.json({ data: { status: 'ok', time: new Date().toISOString() } })
})

app.route('/', catalogueRoutes)
app.route('/', submissionRoutes)
app.route('/auth', authRoutes)

app.use('/admin/*', requireStaff)
// Admin-only areas (each path and its sub-paths); everything else under /admin is staff.
const ADMIN_ONLY = [
  'users',
  'subscribers',
  'media',
  'settings',
  'audit-log',
  'calendar',
]
for (const area of ADMIN_ONLY) {
  app.use(`/admin/${area}`, requireAdmin)
  app.use(`/admin/${area}/*`, requireAdmin)
}
app.route('/admin', operationsRoutes)
app.route('/admin', catalogueAdminRoutes)
app.route('/admin', peopleRoutes)

app.notFound((c) =>
  c.json(
    {
      error: {
        code: 'NOT_FOUND',
        message: `No route for ${c.req.method} ${c.req.path}`,
      },
    },
    404,
  ),
)

app.onError((err, c) => {
  if (err instanceof ApiError) {
    return c.json(
      { error: { code: err.code, message: err.message, details: err.details } },
      err.status,
    )
  }
  console.error('[api] unhandled', err)
  return c.json(
    { error: { code: 'INTERNAL', message: 'Something went wrong' } },
    500,
  )
})
