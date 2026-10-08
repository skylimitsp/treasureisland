/**
 * Dashboard tiles and the recent-activity feed, computed from live tables.
 * @author Joseph Nartey
 * @github devjoemedia
 */
import { and, desc, eq, gte, inArray, lte, sql } from 'drizzle-orm'

import {
  bookings,
  eventEnquiries,
  newsletterSubscribers,
  rooms,
} from '#/server/db/schema'
import { today } from '#/server/lib/dates'
import { toMajor } from '#/server/lib/money'
import type { Database } from '#/server/db/client'
import type { ActivityItem, DashboardMetrics } from '#/types'

const count = sql<number>`count(*)`

export async function getMetrics(db: Database): Promise<DashboardMetrics> {
  const day = today()
  const monthStart = `${day.slice(0, 7)}-01`
  const live = inArray(bookings.status, ['confirmed', 'checked_in'])

  const [
    [bookedToday],
    [upcoming],
    [revenue],
    [occupied],
    [inventory],
    [pending],
    [subs],
    [requests],
  ] = await Promise.all([
    db
      .select({ n: count })
      .from(bookings)
      .where(gte(bookings.createdAt, `${day}T00:00:00.000Z`)),
    db
      .select({ n: count })
      .from(bookings)
      .where(and(live, gte(bookings.checkIn, day))),
    db
      .select({ n: sql<number>`coalesce(sum(${bookings.total}), 0)` })
      .from(bookings)
      .where(and(live, gte(bookings.checkIn, monthStart))),
    db
      .select({ n: count })
      .from(bookings)
      .where(
        and(
          live,
          lte(bookings.checkIn, day),
          sql`${bookings.checkOut} > ${day}`,
        ),
      ),
    db
      .select({ n: sql<number>`coalesce(sum(${rooms.inventory}), 0)` })
      .from(rooms)
      .where(eq(rooms.active, true)),
    db
      .select({ n: count })
      .from(eventEnquiries)
      .where(eq(eventEnquiries.status, 'new')),
    db
      .select({ n: count })
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.status, 'subscribed')),
    db
      .select({ n: count })
      .from(bookings)
      .where(eq(bookings.status, 'pending')),
  ])

  return {
    bookingsToday: bookedToday.n,
    upcomingBookings: upcoming.n,
    revenue: toMajor(revenue.n),
    occupancy: inventory.n ? Math.round((occupied.n / inventory.n) * 100) : 0,
    pendingEnquiries: pending.n,
    subscribers: subs.n,
    pendingBookings: requests.n,
  }
}

// Merges the newest bookings, enquiries and sign-ups into one timeline.
export async function getActivity(
  db: Database,
  limit = 10,
): Promise<Array<ActivityItem>> {
  const [b, e, s] = await Promise.all([
    db.select().from(bookings).orderBy(desc(bookings.createdAt)).limit(limit),
    db
      .select()
      .from(eventEnquiries)
      .orderBy(desc(eventEnquiries.createdAt))
      .limit(limit),
    db
      .select()
      .from(newsletterSubscribers)
      .orderBy(desc(newsletterSubscribers.createdAt))
      .limit(limit),
  ])
  const items: Array<ActivityItem> = [
    ...b.map((x) => ({
      id: x.id,
      kind: 'booking' as const,
      title: `${x.guestName} booked ${x.roomName}`,
      detail: `${x.checkIn} → ${x.checkOut} · ${x.status}`,
      createdAt: x.createdAt,
    })),
    ...e.map((x) => ({
      id: x.id,
      kind: 'enquiry' as const,
      title: `${x.name} enquired about ${x.eventType}`,
      detail: `${x.guests} guests · ${x.date}`,
      createdAt: x.createdAt,
    })),
    ...s.map((x) => ({
      id: x.id,
      kind: 'subscriber' as const,
      title: `${x.email} joined the newsletter`,
      detail: `${x.source} · ${x.status}`,
      createdAt: x.createdAt,
    })),
  ]
  return items
    .sort((a, z) => z.createdAt.localeCompare(a.createdAt))
    .slice(0, limit)
}
