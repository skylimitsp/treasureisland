/**
 * Staff directory: list, change role/active, with a last-admin safety check.
 * @author Joseph Nartey
 * @github devjoemedia
 */
import { and, asc, eq, ne, sql } from 'drizzle-orm'

import { users } from '#/server/db/schema'
import { ApiError, notFound } from '#/server/lib/errors'
import { revokeUserSessions } from '#/server/services/auth.service'
import type { Database } from '#/server/db/client'
import type { User } from '#/types'

type UserRow = typeof users.$inferSelect

export const toUser = (
  u: UserRow,
): User & { active: boolean; lastLoginAt: string | null } => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
  avatar: u.avatar ?? undefined,
  active: u.active,
  lastLoginAt: u.lastLoginAt,
})

export async function listUsers(db: Database) {
  return db.select().from(users).orderBy(asc(users.name))
}

export async function updateUser(
  db: Database,
  id: string,
  patch: { role?: 'admin' | 'concierge'; active?: boolean },
  actorId: string,
) {
  const user = await db.query.users.findFirst({ where: eq(users.id, id) })
  if (!user) throw notFound('Staff member')
  const losingAdmin =
    user.role === 'admin' &&
    (patch.role === 'concierge' || patch.active === false)
  if (losingAdmin) {
    const [{ n }] = await db
      .select({ n: sql<number>`count(*)` })
      .from(users)
      .where(
        and(eq(users.role, 'admin'), eq(users.active, true), ne(users.id, id)),
      )
    if (n === 0)
      throw new ApiError(
        'CONFLICT',
        'There must always be at least one active admin',
      )
  }
  if (id === actorId && patch.active === false) {
    throw new ApiError('CONFLICT', 'You cannot deactivate your own account')
  }
  const [row] = await db
    .update(users)
    .set(patch)
    .where(eq(users.id, id))
    .returning()
  if (patch.active === false) await revokeUserSessions(db, id)
  return row
}
