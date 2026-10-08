/**
 * Rooms: catalogue, availability, server-side quotes, blocks and admin edits.
 * @author Joseph Nartey
 * @github devjoemedia
 */
import { and, asc, eq, gt, inArray, lt, or, sql } from 'drizzle-orm'

import { bookings, roomBlocks, rooms } from '#/server/db/schema'
import { first } from '#/server/lib/rows'
import { ApiError, notFound } from '#/server/lib/errors'
import { addHours, nightsBetween, today } from '#/server/lib/dates'
import { toMajor, toMinor } from '#/server/lib/money'
import type { Database } from '#/server/db/client'
import type { Settings } from '#/server/services/settings.service'
import type { Room, RoomAvailability } from '#/types'

type RoomRow = typeof rooms.$inferSelect

export const MAX_NIGHTS = 30

export const toRoom = (r: RoomRow): Room & { currency: string } => ({
  id: r.id,
  slug: r.slug,
  name: r.name,
  category: r.category,
  description: r.description,
  pricePerNight: toMajor(r.pricePerNight),
  currency: r.currency,
  maxGuests: r.maxGuests,
  beds: r.beds,
  view: r.view,
  bathroom: r.bathroom,
  amenities: r.amenities,
  image: r.image,
})

export async function listRooms(
  db: Database,
  { includeInactive = false } = {},
) {
  const rows = await db
    .select()
    .from(rooms)
    .where(includeInactive ? undefined : eq(rooms.active, true))
    .orderBy(asc(rooms.sort), asc(rooms.name))
  return rows
}

export async function getRoomBySlug(db: Database, slug: string) {
  const room = await db.query.rooms.findFirst({
    where: and(eq(rooms.slug, slug), eq(rooms.active, true)),
  })
  if (!room) throw notFound('Room')
  return room
}

// Bookings that hold inventory: confirmed/checked-in, or pending still inside its hold window.
export function holdingBookings(holdHours: number) {
  const cutoff = addHours(-holdHours)
  return or(
    inArray(bookings.status, ['confirmed', 'checked_in']),
    and(eq(bookings.status, 'pending'), gt(bookings.createdAt, cutoff)),
  )
}

export async function checkAvailability(
  db: Database,
  room: RoomRow,
  checkIn: string,
  checkOut: string,
  settings: Settings,
  excludeBookingId?: string,
) {
  const [{ taken }] = await db
    .select({ taken: sql<number>`count(*)` })
    .from(bookings)
    .where(
      and(
        eq(bookings.roomId, room.id),
        holdingBookings(settings.pendingHoldHours),
        lt(bookings.checkIn, checkOut),
        gt(bookings.checkOut, checkIn),
        excludeBookingId
          ? sql`${bookings.id} <> ${excludeBookingId}`
          : undefined,
      ),
    )
  const blocked = await db.query.roomBlocks.findFirst({
    where: and(
      eq(roomBlocks.roomId, room.id),
      lt(roomBlocks.from, checkOut),
      gt(roomBlocks.to, checkIn),
    ),
  })
  const open = room.active && room.open && !blocked
  // Guest-facing reasons stay generic; staff notes are shown only in the dashboard.
  return {
    available: open && taken < room.inventory,
    remaining: open ? Math.max(0, room.inventory - taken) : 0,
    reason: !open
      ? 'Not available for these dates'
      : taken >= room.inventory
        ? 'Fully booked for these dates'
        : null,
  }
}

export function validateStay(
  room: RoomRow,
  checkIn: string,
  checkOut: string,
  guests: number,
  { allowPast = false } = {},
) {
  const nights = nightsBetween(checkIn, checkOut)
  if (!allowPast && checkIn < today()) {
    throw new ApiError('VALIDATION', 'Check-in cannot be in the past')
  }
  if (nights < 1 || nights > MAX_NIGHTS) {
    throw new ApiError('VALIDATION', `Stays must be 1 to ${MAX_NIGHTS} nights`)
  }
  if (guests > room.maxGuests) {
    throw new ApiError(
      'VALIDATION',
      `This room sleeps up to ${room.maxGuests} guests`,
    )
  }
  return nights
}

// All money in minor units; taxes from settings until real rates are confirmed.
export function priceStay(room: RoomRow, nights: number, settings: Settings) {
  const subtotal = room.pricePerNight * nights
  const taxes = Math.round((subtotal * settings.taxRatePercent) / 100)
  return { subtotal, taxes, total: subtotal + taxes, currency: room.currency }
}

export async function quote(
  db: Database,
  slug: string,
  input: { checkIn: string; checkOut: string; guests: number },
  settings: Settings,
) {
  const room = await getRoomBySlug(db, slug)
  const nights = validateStay(room, input.checkIn, input.checkOut, input.guests)
  const price = priceStay(room, nights, settings)
  const availability = await checkAvailability(
    db,
    room,
    input.checkIn,
    input.checkOut,
    settings,
  )
  return {
    roomSlug: room.slug,
    ...input,
    nights,
    pricePerNight: toMajor(room.pricePerNight),
    subtotal: toMajor(price.subtotal),
    taxes: toMajor(price.taxes),
    total: toMajor(price.total),
    currency: price.currency,
    ...availability,
  }
}

// Shape used by the dashboard's availability screen (`RoomAvailability`).
export async function availabilityGrid(
  db: Database,
  settings: Settings,
  from = today(),
  to?: string,
) {
  const end =
    to ??
    new Date(Date.parse(`${from}T00:00:00Z`) + 86_400_000)
      .toISOString()
      .slice(0, 10)
  const rows = await listRooms(db, { includeInactive: true })
  return Promise.all(
    rows.map(
      async (
        r,
      ): Promise<
        RoomAvailability & { remaining: number; inventory: number }
      > => {
        const a = await checkAvailability(db, r, from, end, settings)
        return {
          roomId: r.id,
          roomName: r.name,
          slug: r.slug,
          pricePerNight: toMajor(r.pricePerNight),
          open: r.open,
          blockedNote: r.blockedNote,
          remaining: a.remaining,
          inventory: r.inventory,
        }
      },
    ),
  )
}

export async function setRoomOpen(
  db: Database,
  roomId: string,
  patch: { open?: boolean; blockedNote?: string },
) {
  const row = first(
    await db.update(rooms).set(patch).where(eq(rooms.id, roomId)).returning(),
  )
  if (!row) throw notFound('Room')
  return {
    roomId: row.id,
    roomName: row.name,
    slug: row.slug,
    pricePerNight: toMajor(row.pricePerNight),
    open: row.open,
    blockedNote: row.blockedNote,
  } satisfies RoomAvailability
}

export async function updateRoom(
  db: Database,
  id: string,
  patch: Partial<Omit<RoomRow, 'id' | 'pricePerNight'>> & {
    pricePerNight?: number
  },
) {
  const { pricePerNight, ...rest } = patch
  const row = first(
    await db
      .update(rooms)
      .set({
        ...rest,
        ...(pricePerNight !== undefined && {
          pricePerNight: toMinor(pricePerNight),
        }),
      })
      .where(eq(rooms.id, id))
      .returning(),
  )
  if (!row) throw notFound('Room')
  return row
}

export async function createRoom(
  db: Database,
  input: Omit<typeof rooms.$inferInsert, 'pricePerNight' | 'currency'> & {
    pricePerNight: number
  },
  settings: Settings,
) {
  const exists = await db.query.rooms.findFirst({
    where: eq(rooms.slug, input.slug),
  })
  if (exists)
    throw new ApiError('CONFLICT', 'A room with this slug already exists')
  const [row] = await db
    .insert(rooms)
    .values({
      ...input,
      pricePerNight: toMinor(input.pricePerNight),
      currency: settings.currency,
    })
    .returning()
  return row
}

export async function listBlocks(db: Database, from = today()) {
  return db
    .select()
    .from(roomBlocks)
    .where(gt(roomBlocks.to, from))
    .orderBy(asc(roomBlocks.from))
}

export async function createBlock(
  db: Database,
  input: { roomId: string; from: string; to: string; note: string },
  createdBy: string,
) {
  const room = await db.query.rooms.findFirst({
    where: eq(rooms.id, input.roomId),
  })
  if (!room) throw notFound('Room')
  const [row] = await db
    .insert(roomBlocks)
    .values({ ...input, createdBy })
    .returning()
  return row
}

export async function deleteBlock(db: Database, id: string) {
  const row = first(
    await db.delete(roomBlocks).where(eq(roomBlocks.id, id)).returning(),
  )
  if (!row) throw notFound('Block')
  return row
}
