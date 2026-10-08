import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import {
  bool,
  createdAt,
  id,
  json,
  updatedAt,
} from '#/server/db/schema/columns'

// Money columns hold minor units (cents/pesewas); the API converts at the edge.
export const rooms = sqliteTable('rooms', {
  id: id(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  category: text('category', {
    enum: ['double', 'family', 'deluxe'],
  }).notNull(),
  description: text('description').notNull(),
  pricePerNight: integer('price_per_night').notNull(),
  currency: text('currency').notNull().default('USD'),
  maxGuests: integer('max_guests').notNull(),
  beds: text('beds'),
  view: text('view', { enum: ['Beach', 'River', 'Jungle'] }),
  bathroom: text('bathroom').notNull(),
  amenities: json<Array<string>>('amenities').notNull(),
  image: text('image').notNull(),
  inventory: integer('inventory').notNull().default(1),
  open: bool('open').notNull().default(true),
  blockedNote: text('blocked_note').notNull().default(''),
  active: bool('active').notNull().default(true),
  sort: integer('sort').notNull().default(0),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
})

// Date-range closures (maintenance, private hire); `to` is exclusive like check-out.
export const roomBlocks = sqliteTable(
  'room_blocks',
  {
    id: id(),
    roomId: text('room_id')
      .notNull()
      .references(() => rooms.id, { onDelete: 'cascade' }),
    from: text('from').notNull(),
    to: text('to').notNull(),
    note: text('note').notNull().default(''),
    createdBy: text('created_by'),
    createdAt: createdAt(),
  },
  (t) => [index('room_blocks_room_idx').on(t.roomId, t.from, t.to)],
)

export const BOOKING_STATUSES = [
  'pending',
  'confirmed',
  'checked_in',
  'checked_out',
  'cancelled',
] as const

// The reference code (TI-2026-0001) is the primary key, matching `Booking.id`.
export const bookings = sqliteTable(
  'bookings',
  {
    id: text('id').primaryKey(),
    roomId: text('room_id')
      .notNull()
      .references(() => rooms.id),
    roomSlug: text('room_slug').notNull(),
    roomName: text('room_name').notNull(),
    guestName: text('guest_name').notNull(),
    email: text('email').notNull(),
    phone: text('phone'),
    checkIn: text('check_in').notNull(),
    checkOut: text('check_out').notNull(),
    guests: integer('guests').notNull(),
    nights: integer('nights').notNull(),
    subtotal: integer('subtotal').notNull(),
    taxes: integer('taxes').notNull().default(0),
    total: integer('total').notNull(),
    currency: text('currency').notNull(),
    status: text('status', { enum: BOOKING_STATUSES }).notNull(),
    source: text('source', { enum: ['web', 'phone', 'walk_in'] })
      .notNull()
      .default('web'),
    notes: text('notes').notNull().default(''),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    index('bookings_room_dates_idx').on(t.roomId, t.checkIn, t.checkOut),
    index('bookings_status_idx').on(t.status),
  ],
)

export const bookingEvents = sqliteTable('booking_events', {
  id: id(),
  bookingId: text('booking_id')
    .notNull()
    .references(() => bookings.id, { onDelete: 'cascade' }),
  fromStatus: text('from_status'),
  toStatus: text('to_status'),
  note: text('note').notNull().default(''),
  byUser: text('by_user'),
  createdAt: createdAt(),
})
