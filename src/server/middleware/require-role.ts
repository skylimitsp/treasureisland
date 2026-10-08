import { createMiddleware } from 'hono/factory'

import { ApiError } from '#/server/lib/errors'
import type { AppEnv } from '#/server/env'

type StaffRole = 'admin' | 'concierge'

export const requireRole = (...roles: Array<StaffRole>) =>
  createMiddleware<AppEnv>(async (c, next) => {
    const user = c.get('user')
    if (!user) throw new ApiError('UNAUTHENTICATED', 'Please sign in')
    if (!roles.includes(user.role)) {
      throw new ApiError('FORBIDDEN', 'You do not have access to this')
    }
    await next()
  })

export const requireStaff = requireRole('admin', 'concierge')
export const requireAdmin = requireRole('admin')

export function currentUser(c: {
  get: (k: 'user') => AppEnv['Variables']['user']
}) {
  const user = c.get('user')
  if (!user) throw new ApiError('UNAUTHENTICATED', 'Please sign in')
  return user
}
