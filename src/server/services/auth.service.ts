/**
 * Staff authentication: password login, DB-backed sessions, invites and resets.
 * @author Joseph Nartey
 * @github devjoemedia
 */
import { and, desc, eq, gt, isNull } from 'drizzle-orm'

import { authTokens, sessions, users } from '#/server/db/schema'
import { ApiError, notFound } from '#/server/lib/errors'
import { first } from '#/server/lib/rows'
import { addDays, addHours } from '#/server/lib/dates'
import {
  hashPassword,
  randomToken,
  sha256,
  verifyPassword,
} from '#/server/lib/crypto'
import type { Database } from '#/server/db/client'
import type { User } from '#/types'

export type SessionUser = User & { role: 'admin' | 'concierge' }

export const SESSION_COOKIE = 'ti_session'
export const SESSION_DAYS = 7

const toSessionUser = (u: typeof users.$inferSelect): SessionUser => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
  avatar: u.avatar ?? undefined,
})

export async function login(
  db: Database,
  email: string,
  password: string,
  userAgent: string | null,
) {
  const user = await db.query.users.findFirst({ where: eq(users.email, email) })
  // Same error for unknown email, wrong password and inactive accounts.
  const ok =
    user?.active && user.passwordHash
      ? await verifyPassword(password, user.passwordHash)
      : false
  if (!user || !ok)
    throw new ApiError('UNAUTHENTICATED', 'Email or password is incorrect')

  const token = await createSession(db, user.id, userAgent)
  await db
    .update(users)
    .set({ lastLoginAt: new Date().toISOString() })
    .where(eq(users.id, user.id))
  return { token, user: toSessionUser(user) }
}

export async function createSession(
  db: Database,
  userId: string,
  userAgent: string | null,
): Promise<string> {
  const token = randomToken()
  await db.insert(sessions).values({
    id: await sha256(token),
    userId,
    expiresAt: addDays(SESSION_DAYS),
    userAgent: userAgent?.slice(0, 200) ?? null,
  })
  return token
}

// Sliding expiry: a session used in its second half is extended.
export async function getSessionUser(
  db: Database,
  token: string,
): Promise<SessionUser | null> {
  const id = await sha256(token)
  const row = await db
    .select({ session: sessions, user: users })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(
      and(
        eq(sessions.id, id),
        gt(sessions.expiresAt, new Date().toISOString()),
      ),
    )
    .get()
  if (!row || !row.user.active) return null

  const halfLife = addDays(SESSION_DAYS / 2)
  if (row.session.expiresAt < halfLife) {
    await db
      .update(sessions)
      .set({ expiresAt: addDays(SESSION_DAYS) })
      .where(eq(sessions.id, id))
  }
  return toSessionUser(row.user)
}

export async function logout(db: Database, token: string) {
  await db.delete(sessions).where(eq(sessions.id, await sha256(token)))
}

export async function revokeUserSessions(db: Database, userId: string) {
  await db.delete(sessions).where(eq(sessions.userId, userId))
}

async function issueToken(
  db: Database,
  values: Omit<typeof authTokens.$inferInsert, 'id' | 'expiresAt'>,
  hours: number,
): Promise<string> {
  const token = randomToken()
  await db
    .insert(authTokens)
    .values({ ...values, id: await sha256(token), expiresAt: addHours(hours) })
  return token
}

async function consumeToken(
  db: Database,
  token: string,
  kind: 'invite' | 'reset',
) {
  // One conditional update, so two clicks on the same link can't both succeed.
  const row = first(
    await db
      .update(authTokens)
      .set({ usedAt: new Date().toISOString(), linkToken: null })
      .where(
        and(
          eq(authTokens.id, await sha256(token)),
          eq(authTokens.kind, kind),
          isNull(authTokens.usedAt),
          gt(authTokens.expiresAt, new Date().toISOString()),
        ),
      )
      .returning(),
  )
  if (!row)
    throw new ApiError('VALIDATION', 'This link is invalid or has expired')
  return row
}

export const INVITE_HOURS = 7 * 24

export async function createInvite(
  db: Database,
  email: string,
  role: 'admin' | 'concierge',
  createdBy: string,
): Promise<string> {
  const existing = await db.query.users.findFirst({
    where: eq(users.email, email),
  })
  if (existing?.passwordHash) {
    throw new ApiError(
      'CONFLICT',
      'A staff account with this email already exists',
    )
  }
  // A fresh invite replaces any pending one, so only one live link exists per person.
  await db
    .delete(authTokens)
    .where(
      and(
        eq(authTokens.kind, 'invite'),
        eq(authTokens.email, email),
        isNull(authTokens.usedAt),
      ),
    )
  const token = randomToken()
  await db.insert(authTokens).values({
    id: await sha256(token),
    kind: 'invite',
    email,
    role,
    createdBy,
    linkToken: token,
    expiresAt: addHours(INVITE_HOURS),
  })
  return token
}

export async function listPendingInvites(db: Database) {
  return db
    .select({
      id: authTokens.id,
      email: authTokens.email,
      role: authTokens.role,
      linkToken: authTokens.linkToken,
      expiresAt: authTokens.expiresAt,
      createdAt: authTokens.createdAt,
      invitedBy: users.name,
    })
    .from(authTokens)
    .leftJoin(users, eq(users.id, authTokens.createdBy))
    .where(
      and(
        eq(authTokens.kind, 'invite'),
        isNull(authTokens.usedAt),
        gt(authTokens.expiresAt, new Date().toISOString()),
      ),
    )
    .orderBy(desc(authTokens.createdAt))
}

export async function revokeInvite(db: Database, id: string) {
  const row = first(
    await db
      .delete(authTokens)
      .where(
        and(
          eq(authTokens.id, id),
          eq(authTokens.kind, 'invite'),
          isNull(authTokens.usedAt),
        ),
      )
      .returning(),
  )
  if (!row) throw notFound('Invite')
  return row
}

export async function acceptInvite(
  db: Database,
  token: string,
  name: string,
  password: string,
  userAgent: string | null,
) {
  const invite = await consumeToken(db, token, 'invite')
  const passwordHash = await hashPassword(password)
  const [user] = await db
    .insert(users)
    .values({
      name,
      email: invite.email,
      role: invite.role ?? 'concierge',
      passwordHash,
    })
    .onConflictDoUpdate({
      target: users.email,
      set: {
        name,
        passwordHash,
        role: invite.role ?? 'concierge',
        active: true,
      },
    })
    .returning()
  const sessionToken = await createSession(db, user.id, userAgent)
  return { token: sessionToken, user: toSessionUser(user) }
}

// Returns null for unknown emails so the endpoint can't be used to probe accounts.
export async function createPasswordReset(
  db: Database,
  email: string,
): Promise<{ token: string; name: string } | null> {
  const user = await db.query.users.findFirst({ where: eq(users.email, email) })
  if (!user?.active) return null
  const token = await issueToken(
    db,
    { kind: 'reset', email, userId: user.id },
    2,
  )
  return { token, name: user.name }
}

export async function resetPassword(
  db: Database,
  token: string,
  password: string,
) {
  const row = await consumeToken(db, token, 'reset')
  if (!row.userId)
    throw new ApiError('VALIDATION', 'This link is invalid or has expired')
  await db
    .update(users)
    .set({ passwordHash: await hashPassword(password) })
    .where(eq(users.id, row.userId))
  await revokeUserSessions(db, row.userId)
}
