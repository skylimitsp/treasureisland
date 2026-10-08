import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import {
  bool,
  createdAt,
  id,
  json,
  updatedAt,
} from '#/server/db/schema/columns'
import type { AmenityIcon, EventPackage } from '#/types'

export const amenities = sqliteTable('amenities', {
  id: id(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  blurb: text('blurb').notNull(),
  description: text('description').notNull(),
  image: text('image').notNull(),
  imageAlt: text('image_alt'),
  hero: text('hero').notNull(),
  gallery: json<Array<string>>('gallery').notNull(),
  highlights: json<Array<string>>('highlights'),
  icon: text('icon').$type<AmenityIcon>().notNull(),
  hours: text('hours'),
  location: text('location'),
  capacity: text('capacity'),
  price: text('price'),
  priceNote: text('price_note'),
  bookable: bool('bookable').notNull().default(false),
  active: bool('active').notNull().default(true),
  sort: integer('sort').notNull().default(0),
  updatedAt: updatedAt(),
})

// Bookable time slots per amenity; capacity is total guests per slot per day.
export const amenitySlots = sqliteTable(
  'amenity_slots',
  {
    id: id(),
    amenityId: text('amenity_id')
      .notNull()
      .references(() => amenities.id, { onDelete: 'cascade' }),
    label: text('label').notNull(),
    capacity: integer('capacity').notNull(),
    daysOfWeek: json<Array<number>>('days_of_week'),
    active: bool('active').notNull().default(true),
    sort: integer('sort').notNull().default(0),
  },
  (t) => [index('amenity_slots_amenity_idx').on(t.amenityId)],
)

export const slotRequests = sqliteTable(
  'slot_requests',
  {
    id: text('id').primaryKey(),
    amenityId: text('amenity_id')
      .notNull()
      .references(() => amenities.id),
    slug: text('slug').notNull(),
    amenityName: text('amenity_name').notNull(),
    date: text('date').notNull(),
    slot: text('slot').notNull(),
    partySize: integer('party_size').notNull(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    note: text('note'),
    status: text('status', {
      enum: ['pending', 'confirmed', 'declined'],
    }).notNull(),
    createdAt: createdAt(),
  },
  (t) => [index('slot_requests_amenity_idx').on(t.amenityId, t.date)],
)

export const eventTeasers = sqliteTable('event_teasers', {
  slug: text('slug').primaryKey(),
  name: text('name').notNull(),
  blurb: text('blurb').notNull(),
  image: text('image').notNull(),
  video: text('video'),
  tag: text('tag').notNull(),
  kicker: text('kicker').notNull(),
  cta: text('cta').notNull(),
  sort: integer('sort').notNull().default(0),
})

export const EVENT_CATEGORIES = [
  'weddings',
  'birthdays',
  'family',
  'meetings',
] as const

export const eventTypes = sqliteTable('event_types', {
  slug: text('slug').primaryKey(),
  category: text('category', { enum: EVENT_CATEGORIES }).notNull(),
  name: text('name').notNull(),
  title: text('title').notNull(),
  blurb: text('blurb').notNull(),
  description: json<Array<string>>('description').notNull(),
  icon: text('icon').notNull(),
  inclusions: json<Array<string>>('inclusions'),
  capacityMin: integer('capacity_min'),
  capacityMax: integer('capacity_max'),
  fromPrice: integer('from_price'),
  gallery: json<Array<string>>('gallery').notNull(),
  packages: json<Array<EventPackage>>('packages'),
  sort: integer('sort').notNull().default(0),
})

export const eventEnquiries = sqliteTable(
  'event_enquiries',
  {
    id: text('id').primaryKey(),
    eventType: text('event_type', { enum: EVENT_CATEGORIES }).notNull(),
    date: text('date').notNull(),
    flexibleDates: bool('flexible_dates').notNull(),
    guests: integer('guests').notNull(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    phone: text('phone').notNull(),
    budget: text('budget'),
    message: text('message').notNull(),
    consent: bool('consent').notNull(),
    status: text('status', { enum: ['new', 'contacted', 'closed'] }).notNull(),
    assignedTo: text('assigned_to'),
    createdAt: createdAt(),
  },
  (t) => [index('enquiries_status_idx').on(t.status, t.createdAt)],
)

export const enquiryNotes = sqliteTable('enquiry_notes', {
  id: id(),
  enquiryId: text('enquiry_id')
    .notNull()
    .references(() => eventEnquiries.id, { onDelete: 'cascade' }),
  body: text('body').notNull(),
  byUser: text('by_user'),
  createdAt: createdAt(),
})
