import { createMiddleware } from 'hono/factory'

import { ApiError } from '#/server/lib/errors'
import type { AppEnv } from '#/server/env'

const SAFE = new Set(['GET', 'HEAD', 'OPTIONS'])

// CSRF guard: state-changing requests must come from this site's own pages.
export const sameOrigin = createMiddleware<AppEnv>(async (c, next) => {
  if (!SAFE.has(c.req.method)) {
    const origin = c.req.header('origin')
    const self = new URL(c.req.url).origin
    if (origin && origin !== self)
      throw new ApiError('FORBIDDEN', 'Cross-site request blocked')
  }
  await next()
})
