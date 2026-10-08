/**
 * Bookings: race-safe creation, status workflow with history, staff edits.
 * @author Joseph Nartey
 * @github devjoemedia
 */
import { and, asc, desc, eq, gte, like, lte, or, sql } from 'drizzle-orm'

import { bookingEvents, bookings, rooms } from '#/server/db/schema'
import { first } from '#/server/lib/rows'
import { ApiError, notFound } from '#/server/lib/errors'
import { addHours } from '#/server/lib/dates'
import { toMajor } from '#/server/lib/money'
import { nextReference } from '#/server/lib/references'
import {
  checkAvailability,
  getRoomBySlug,
  priceStay,
  validateStay,
} from '#/server/services/rooms.service'
import type { PageQuery } from '#/server/lib/pagination'
import type { Database } from '#/server/db/client'
import type { Settings } from '#/server/services/settings.service'
import type { Booking, BookingStatus } from '#/types'

type BookingRow = typeof bookings.$inferSelect

export const toBooking = (
  b: BookingRow,
): Booking & Record<string, unknown> => ({
  id: b.id,
  roomSlug: b.roomSlug,
  roomName: b.roomName,
  guestName: b.guestName,
  email: b.email,
  phone: b.phone,
  checkIn: b.checkIn,
  checkOut: b.checkOut,
  guests: b.guests,
  nights: b.nights,
  subtotal: toMajor(b.subtotal),
  taxes: toMajor(b.taxes),
  total: toMajor(b.total),
  currency: b.currency,
  status: b.status,
  source: b.source,
  notes: b.notes,
  createdAt: b.createdAt,
})

const TRANSITIONS: Record<BookingStatus, Array<BookingStatus>> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['checked_in', 'cancelled'],
  checked_in: ['checked_out'],
  checked_out: [],
  cancelled: [],
}

export interface CreateBookingInput {
  roomSlug: string
  guestName: string
  email: string
  phone?: string
  checkIn: string
  checkOut: string
  guests: number
  source?: 'web' | 'phone' | 'walk_in'
  status?: 'pending' | 'confirmed'
  notes?: string
}

export async function createBooking(
  db: Database,
  input: CreateBookingInput,
  settings: Settings,
  actorId: string | null = null,
) {
  const room = await getRoomBySlug(db, input.roomSlug)
  const nights = validateStay(room, input.checkIn, input.checkOut, input.guests)
  const price = priceStay(room, nights, settings)
  // Cheap pre-check gives a precise reason and avoids burning reference numbers.
  const precheck = await checkAvailability(
    db,
    room,
    input.checkIn,
    input.checkOut,
    settings,
  )
  if (!precheck.available)
    throw new ApiError('CONFLICT', precheck.reason ?? 'Not available')
  const id = await nextReference(db, 'TI')
  const now = new Date().toISOString()
  const status = input.status ?? 'pending'

  // Inserts only if a unit is still free and no block overlaps — one statement, no race.
  const result = await db.run(sql`
    INSERT INTO bookings (id, room_id, room_slug, room_name, guest_name, email, phone,
      check_in, check_out, guests, nights, subtotal, taxes, total, currency, status,
      source, notes, created_at, updated_at)
    SELECT ${id}, ${room.id}, ${room.slug}, ${room.name}, ${input.guestName}, ${input.email},
      ${input.phone ?? null}, ${input.checkIn}, ${input.checkOut}, ${input.guests}, ${nights},
      ${price.subtotal}, ${price.taxes}, ${price.total}, ${price.currency}, ${status},
      ${input.source ?? 'web'}, ${input.notes ?? ''}, ${now}, ${now}
    WHERE (SELECT open AND active FROM rooms WHERE id = ${room.id}) = 1
      AND (SELECT count(*) FROM bookings
        WHERE room_id = ${room.id}
          AND (status IN ('confirmed', 'checked_in')
            OR (status = 'pending' AND created_at > ${addHours(-settings.pendingHoldHours)}))
          AND check_in < ${input.checkOut} AND check_out > ${input.checkIn})
        < (SELECT inventory FROM rooms WHERE id = ${room.id})
      AND NOT EXISTS (SELECT 1 FROM room_blocks
        WHERE room_id = ${room.id} AND "from" < ${input.checkOut} AND "to" > ${input.checkIn})
  `)
  if (!result.meta.changes) {
    throw new ApiError(
      'CONFLICT',
      'This room is no longer available for those dates',
    )
  }
  await db.insert(bookingEvents).values({
    bookingId: id,
    toStatus: status,
    byUser: actorId,
    note:
      input.source && input.source !== 'web'
        ? `Created by staff (${input.source})`
        : '',
  })
  return getBooking(db, id)
}

export async function getBooking(db: Database, id: string) {
  const row = await db.query.bookings.findFirst({ where: eq(bookings.id, id) })
  if (!row) throw notFound('Booking')
  return row
}

export async function getBookingWithHistory(db: Database, id: string) {
  const booking = await getBooking(db, id)
  const history = await db
    .select()
    .from(bookingEvents)
    .where(eq(bookingEvents.bookingId, id))
    .orderBy(asc(bookingEvents.createdAt))
  return { ...toBooking(booking), history }
}

export async function listBookings(
  db: Database,
  filters: { status?: BookingStatus; from?: string; to?: string; q?: string },
  page: PageQuery,
) {
  const q = filters.q ? `%${filters.q}%` : undefined
  return db
    .select()
    .from(bookings)
    .where(
      and(
        filters.status ? eq(bookings.status, filters.status) : undefined,
        filters.from ? gte(bookings.checkOut, filters.from) : undefined,
        filters.to ? lte(bookings.checkIn, filters.to) : undefined,
        q
          ? or(
              like(bookings.id, q),
              like(bookings.guestName, q),
              like(bookings.email, q),
            )
          : undefined,
      ),
    )
    .orderBy(desc(bookings.createdAt))
    .limit(page.limit + 1)
    .offset(page.cursor)
}

export async function changeBookingStatus(
  db: Database,
  id: string,
  to: BookingStatus,
  actorId: string,
  note = '',
) {
  const booking = await getBooking(db, id)
  if (booking.status === to) return booking
  if (!TRANSITIONS[booking.status].includes(to)) {
    throw new ApiError(
      'CONFLICT',
      `Cannot move a ${booking.status} booking to ${to}`,
    )
  }
  const row = first(
    await db
      .update(bookings)
      .set({ status: to })
      .where(and(eq(bookings.id, id), eq(bookings.status, booking.status)))
      .returning(),
  )
  if (!row)
    throw new ApiError('CONFLICT', 'The booking changed; reload and try again')
  await db.insert(bookingEvents).values({
    bookingId: id,
    fromStatus: booking.status,
    toStatus: to,
    byUser: actorId,
    note,
  })
  return row
}

export async function updateBooking(
  db: Database,
  id: string,
  patch: {
    checkIn?: string
    checkOut?: string
    guests?: number
    phone?: string
    notes?: string
  },
  settings: Settings,
  actorId: string,
) {
  const booking = await getBooking(db, id)
  const stayChanged =
    patch.checkIn !== undefined ||
    patch.checkOut !== undefined ||
    patch.guests !== undefined
  let pricing = {}
  if (stayChanged) {
    if (booking.status === 'cancelled') {
      throw new ApiError('CONFLICT', 'Cancelled bookings cannot be changed')
    }
    const room = await db.query.rooms.findFirst({
      where: eq(rooms.id, booking.roomId),
    })
    if (!room) throw notFound('Room')
    const checkIn = patch.checkIn ?? booking.checkIn
    const checkOut = patch.checkOut ?? booking.checkOut
    const guests = patch.guests ?? booking.guests
    const nights = validateStay(room, checkIn, checkOut, guests, {
      allowPast: true,
    })
    const a = await checkAvailability(db, room, checkIn, checkOut, settings, id)
    if (!a.available)
      throw new ApiError('CONFLICT', a.reason ?? 'Not available')
    const p = priceStay(room, nights, settings)
    pricing = {
      checkIn,
      checkOut,
      guests,
      nights,
      subtotal: p.subtotal,
      taxes: p.taxes,
      total: p.total,
    }
  }
  const [row] = await db
    .update(bookings)
    .set({
      ...pricing,
      ...(patch.phone !== undefined && { phone: patch.phone }),
      ...(patch.notes !== undefined && { notes: patch.notes }),
    })
    .where(eq(bookings.id, id))
    .returning()
  await db.insert(bookingEvents).values({
    bookingId: id,
    byUser: actorId,
    note: stayChanged ? 'Stay details changed' : 'Details updated',
  })
  return row
}
