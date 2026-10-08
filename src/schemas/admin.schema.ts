import { z } from 'zod'

import { isoDate } from '#/schemas/common.schema'
import { eventCategory } from '#/schemas/enquiry.schema'

const nonEmpty = <T extends z.ZodRawShape>(shape: T) =>
  z
    .object(shape)
    .partial()
    .refine((v) => Object.keys(v).length > 0, 'Nothing to update')

export const bookingStatus = z.enum([
  'pending',
  'confirmed',
  'checked_in',
  'checked_out',
  'cancelled',
])

export const statusChangeSchema = <T extends z.ZodEnum>(status: T) =>
  z.object({ status, note: z.string().trim().max(1000).optional() })

export const bookingStatusChangeSchema = statusChangeSchema(bookingStatus)
export const enquiryStatusChangeSchema = statusChangeSchema(
  z.enum(['new', 'contacted', 'closed']),
)
export const slotStatusChangeSchema = statusChangeSchema(
  z.enum(['pending', 'confirmed', 'declined']),
)

export const bookingListQuery = z.object({
  status: bookingStatus.optional(),
  from: isoDate.optional(),
  to: isoDate.optional(),
  q: z.string().trim().max(100).optional(),
})

export const bookingUpdateSchema = nonEmpty({
  checkIn: isoDate,
  checkOut: isoDate,
  guests: z.number().int().min(1).max(20),
  phone: z.string().trim().max(30),
  notes: z.string().trim().max(4000),
})

export const manualBookingSchema = z.object({
  roomSlug: z.string().min(1),
  guestName: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email(),
  phone: z.string().trim().max(30).optional(),
  checkIn: isoDate,
  checkOut: isoDate,
  guests: z.number().int().min(1).max(20),
  source: z.enum(['phone', 'walk_in']),
  status: z.enum(['pending', 'confirmed']).default('confirmed'),
  notes: z.string().trim().max(4000).optional(),
})

// Matches the current dashboard mutations exactly.
export const availabilityPatchSchema = nonEmpty({
  open: z.boolean(),
  blockedNote: z.string().trim().max(200),
})

export const roomBlockSchema = z
  .object({
    roomId: z.string().min(1),
    from: isoDate,
    to: isoDate,
    note: z.string().trim().max(200).default(''),
  })
  .refine((b) => b.to > b.from, {
    path: ['to'],
    message: 'End must be after start',
  })

export const roomPatchSchema = nonEmpty({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(4000),
  pricePerNight: z.number().min(0).max(1_000_000),
  maxGuests: z.number().int().min(1).max(20),
  beds: z.string().trim().max(120).nullable(),
  bathroom: z.string().trim().max(120),
  amenities: z.array(z.string().trim().max(80)).max(40),
  image: z.string().trim().max(500),
  inventory: z.number().int().min(0).max(500),
  active: z.boolean(),
  sort: z.number().int(),
})

export const roomCreateSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().trim().min(2).max(120),
  category: z.enum(['double', 'family', 'deluxe']),
  description: z.string().trim().max(4000),
  pricePerNight: z.number().min(0).max(1_000_000),
  maxGuests: z.number().int().min(1).max(20),
  beds: z.string().trim().max(120).nullable().default(null),
  view: z.enum(['Beach', 'River', 'Jungle']).nullable().default(null),
  bathroom: z.string().trim().max(120),
  amenities: z.array(z.string().trim().max(80)).max(40).default([]),
  image: z.string().trim().max(500),
  inventory: z.number().int().min(0).max(500).default(1),
})

export const reviewPatchSchema = nonEmpty({
  featured: z.boolean(),
  quote: z.string().trim().min(2).max(2000),
  name: z.string().trim().min(2).max(120),
  origin: z.string().trim().max(120),
  rating: z.number().int().min(1).max(5).nullable(),
  sort: z.number().int(),
})

export const reviewCreateSchema = z.object({
  quote: z.string().trim().min(2).max(2000),
  name: z.string().trim().min(2).max(120),
  origin: z.string().trim().max(120).default(''),
  rating: z.number().int().min(1).max(5).nullable().default(null),
  featured: z.boolean().default(false),
})

export const faqSchema = z.object({
  q: z.string().trim().min(2).max(300),
  a: z.string().trim().min(2).max(4000),
})

export const reorderSchema = z.object({
  ids: z.array(z.string()).min(1).max(500),
})

export const noteSchema = z.object({ body: z.string().trim().min(1).max(4000) })

export const menuSectionSchema = z.object({
  id: z.string().regex(/^[a-z-]+$/),
  title: z.string().trim().min(1).max(80),
  group: z.enum(['food', 'drinks']),
  order: z.number().int(),
  tagline: z.string().trim().max(200).nullable().default(null),
})

export const menuItemSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).default(''),
  category: z.string().regex(/^[a-z-]+$/),
  price: z.number().min(0).max(1_000_000),
  available: z.boolean().default(true),
  sort: z.number().int().default(0),
})

export const amenityPatchSchema = nonEmpty({
  name: z.string().trim().min(2).max(120),
  blurb: z.string().trim().max(500),
  description: z.string().trim().max(8000),
  hours: z.string().trim().max(120).nullable(),
  location: z.string().trim().max(120).nullable(),
  capacity: z.string().trim().max(120).nullable(),
  price: z.string().trim().max(120).nullable(),
  priceNote: z.string().trim().max(300).nullable(),
  bookable: z.boolean(),
  active: z.boolean(),
  gallery: z.array(z.string().max(500)).max(40),
  highlights: z.array(z.string().max(200)).max(20).nullable(),
  sort: z.number().int(),
})

const slug = z
  .string()
  .regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers and dashes')

// Mirrors `EventPackage`; prices are major units like the rest of the API.
export const eventPackageSchema = z.object({
  slug,
  name: z.string().trim().min(2).max(120),
  tierLevel: z.number().int().min(0).optional(),
  blurb: z.string().trim().max(600),
  inclusions: z.array(z.string().trim().max(120)).max(30).optional(),
  capacityMin: z.number().int().min(0).optional(),
  capacityMax: z.number().int().min(0).optional(),
  fromPrice: z.number().min(0).nullable().optional(),
  featured: z.boolean().optional(),
})

const eventTypeFields = {
  category: eventCategory,
  name: z.string().trim().min(2).max(80),
  title: z.string().trim().min(2).max(160),
  blurb: z.string().trim().max(600),
  description: z.array(z.string().trim().max(4000)).max(20),
  icon: z.string().trim().min(1).max(40),
  inclusions: z.array(z.string().trim().max(120)).max(30).nullable(),
  capacityMin: z.number().int().min(0).nullable(),
  capacityMax: z.number().int().min(0).nullable(),
  fromPrice: z.number().min(0).nullable(),
  gallery: z.array(z.string().max(500)).max(40),
  packages: z.array(eventPackageSchema).max(20).nullable(),
  sort: z.number().int(),
}

export const eventTypePatchSchema = nonEmpty(eventTypeFields)

export const eventTypeCreateSchema = z.object({
  ...eventTypeFields,
  slug,
  icon: eventTypeFields.icon.default('Heart'),
  inclusions: eventTypeFields.inclusions.default(null),
  capacityMin: eventTypeFields.capacityMin.default(null),
  capacityMax: eventTypeFields.capacityMax.default(null),
  fromPrice: eventTypeFields.fromPrice.default(null),
  gallery: eventTypeFields.gallery.default([]),
  packages: eventTypeFields.packages.default(null),
  sort: eventTypeFields.sort.default(0),
})

export const amenityCreateSchema = z.object({
  slug,
  name: z.string().trim().min(2).max(120),
  category: z.string().trim().min(1).max(80),
  blurb: z.string().trim().max(500),
  description: z.string().trim().max(8000),
  image: z.string().trim().max(500),
  imageAlt: z.string().trim().max(300).nullable().default(null),
  hero: z.string().trim().max(500),
  gallery: z.array(z.string().max(500)).max(40).default([]),
  highlights: z.array(z.string().max(200)).max(20).nullable().default(null),
  icon: z.enum([
    'utensils',
    'film',
    'bath',
    'ship',
    'sailboat',
    'waves',
    'compass',
    'gamepad',
  ]),
  hours: z.string().trim().max(120).nullable().default(null),
  location: z.string().trim().max(120).nullable().default(null),
  capacity: z.string().trim().max(120).nullable().default(null),
  price: z.string().trim().max(120).nullable().default(null),
  priceNote: z.string().trim().max(300).nullable().default(null),
  bookable: z.boolean().default(false),
  sort: z.number().int().default(0),
})

const slotFields = {
  label: z.string().trim().min(1).max(60),
  capacity: z.number().int().min(1).max(1000),
  daysOfWeek: z.array(z.number().int().min(0).max(6)).min(1).max(7).nullable(),
  active: z.boolean(),
  sort: z.number().int(),
}

export const slotDefinitionSchema = z.object({
  ...slotFields,
  daysOfWeek: slotFields.daysOfWeek.default(null),
  active: slotFields.active.default(true),
  sort: slotFields.sort.default(0),
})

export const slotDefinitionPatchSchema = nonEmpty(slotFields)

export const settingsPatchSchema = z
  .object({
    currency: z.enum(['USD', 'GHS']),
    taxRatePercent: z.number().min(0).max(50),
    pendingHoldHours: z
      .number()
      .int()
      .min(1)
      .max(24 * 14),
    features: z.object({ menu: z.boolean() }).partial(),
    contact: z.record(z.string(), z.string().max(200)),
    socials: z.record(z.string(), z.string().url().or(z.literal(''))),
  })
  .partial()
