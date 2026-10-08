/**
 * Newsletter: double opt-in subscribe, confirm, token unsubscribe, admin list.
 * @author Joseph Nartey
 * @github devjoemedia
 */
import { and, desc, eq, like } from 'drizzle-orm'

import { newsletterSubscribers } from '#/server/db/schema'
import { first } from '#/server/lib/rows'
import { notFound } from '#/server/lib/errors'
import { randomToken } from '#/server/lib/crypto'
import type { Database } from '#/server/db/client'
import type { PageQuery } from '#/server/lib/pagination'
import type { NewsletterSignup, NewsletterSource } from '#/types'

type SubscriberRow = typeof newsletterSubscribers.$inferSelect
type SubscriberStatus = SubscriberRow['status']

export const toSignup = (
  s: SubscriberRow,
): Omit<NewsletterSignup, 'status'> & {
  status: SubscriberStatus
} => ({
  id: s.id,
  email: s.email,
  source: s.source,
  status: s.status,
  createdAt: s.createdAt,
})

// Returns a confirm token when an email should be sent; null if already subscribed.
export async function subscribe(
  db: Database,
  email: string,
  source: NewsletterSource,
) {
  const existing = await db.query.newsletterSubscribers.findFirst({
    where: eq(newsletterSubscribers.email, email),
  })
  if (existing?.status === 'subscribed')
    return { subscriber: existing, confirmToken: null }

  const confirmToken = randomToken(24)
  const [row] = await db
    .insert(newsletterSubscribers)
    .values({
      email,
      source,
      status: 'pending',
      confirmToken,
      unsubscribeToken: randomToken(24),
    })
    .onConflictDoUpdate({
      target: newsletterSubscribers.email,
      set: { status: 'pending', confirmToken, source },
    })
    .returning()
  return { subscriber: row, confirmToken }
}

export async function confirm(db: Database, token: string) {
  const row = first(
    await db
      .update(newsletterSubscribers)
      .set({
        status: 'subscribed',
        confirmToken: null,
        confirmedAt: new Date().toISOString(),
      })
      .where(eq(newsletterSubscribers.confirmToken, token))
      .returning(),
  )
  if (!row) throw notFound('Subscription')
  return row
}

export async function unsubscribeByToken(db: Database, token: string) {
  const row = first(
    await db
      .update(newsletterSubscribers)
      .set({ status: 'unsubscribed' })
      .where(eq(newsletterSubscribers.unsubscribeToken, token))
      .returning(),
  )
  if (!row) throw notFound('Subscription')
  return row
}

export async function unsubscribeById(db: Database, id: string) {
  const row = first(
    await db
      .update(newsletterSubscribers)
      .set({ status: 'unsubscribed' })
      .where(eq(newsletterSubscribers.id, id))
      .returning(),
  )
  if (!row) throw notFound('Subscriber')
  return row
}

export async function listSubscribers(
  db: Database,
  filters: { status?: SubscriberStatus; q?: string },
  page?: PageQuery,
) {
  const query = db
    .select()
    .from(newsletterSubscribers)
    .where(
      and(
        filters.status
          ? eq(newsletterSubscribers.status, filters.status)
          : undefined,
        filters.q
          ? like(newsletterSubscribers.email, `%${filters.q}%`)
          : undefined,
      ),
    )
    .orderBy(desc(newsletterSubscribers.createdAt))
  return page ? query.limit(page.limit + 1).offset(page.cursor) : query
}

// RFC 4180 quoting; also neutralises spreadsheet formula injection.
export function toCsv(rows: Array<SubscriberRow>): string {
  const cell = (v: string) => {
    const safe = /^[=+\-@]/.test(v) ? `'${v}` : v
    return `"${safe.replace(/"/g, '""')}"`
  }
  const lines = rows.map((r) =>
    [r.email, r.source, r.status, r.createdAt, r.confirmedAt ?? '']
      .map(cell)
      .join(','),
  )
  return ['email,source,status,created_at,confirmed_at', ...lines].join('\r\n')
}
