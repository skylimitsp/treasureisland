import { createMiddleware } from 'hono/factory'

import { ApiError } from '#/server/lib/errors'
import type { AppEnv, Bindings } from '#/server/env'

type LimiterName = 'PUBLIC_WRITE_LIMITER' | 'LOGIN_LIMITER'

// Keys on the client IP plus the route, using the Workers Rate Limiting binding.
export const rateLimit = (name: LimiterName) =>
  createMiddleware<AppEnv>(async (c, next) => {
    const limiter = (c.env as Partial<Bindings>)[name]
    if (limiter) {
      const ip = c.req.header('cf-connecting-ip') ?? 'local'
      const { success } = await limiter.limit({
        key: `${ip}:${c.req.routePath}`,
      })
      if (!success)
        throw new ApiError(
          'RATE_LIMITED',
          'Too many requests. Please wait a minute.',
        )
    }
    await next()
  })
