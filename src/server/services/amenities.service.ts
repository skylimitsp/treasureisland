/**
 * Amenities catalogue and slot requests (light reservations, staff confirm).
 * @author Joseph Nartey
 * @github devjoemedia
 */
import { and, asc, desc, eq, inArray, ne, sql } from 'drizzle-orm'

import { amenities, amenitySlots, slotRequests } from '#/server/db/schema'
import { first } from '#/server/lib/rows'
import { ApiError, notFound } from '#/server/lib/errors'
import { today } from '#/server/lib/dates'
import { nextReference } from '#/server/lib/references'
import type { Database } from '#/server/db/client'
import type { PageQuery } from '#/server/lib/pagination'
import type { Amenity, SlotRequest, SlotRequestInput } from '#/types'

type AmenityRow = typeof amenities.$inferSelect
type SlotRow = typeof slotRequests.$inferSelect
type SlotDefRow = typeof amenitySlots.$inferSelect

export const toAmenity = (a: AmenityRow): Amenity => ({
  id: a.id,
  slug: a.slug,
  name: a.name,
  category: a.category,
  blurb: a.blurb,
  description: a.description,
  image: a.image,
  imageAlt: a.imageAlt ?? undefined,
  hero: a.hero,
  gallery: a.gallery,
  highlights: a.highlights ?? undefined,
  icon: a.icon,
  hours: a.hours ?? undefined,
  location: a.location ?? undefined,
  capacity: a.capacity ?? undefined,
  price: a.price,
  priceNote: a.priceNote ?? undefined,
  bookable: a.bookable,
})

export const toSlotRequest = (
  s: SlotRow,
): SlotRequest & { status: SlotRow['status'] } => ({
  id: s.id,
  slug: s.slug,
  amenityName: s.amenityName,
  date: s.date,
  slot: s.slot,
  partySize: s.partySize,
  name: s.name,
  email: s.email,
  note: s.note ?? undefined,
  status: s.status as SlotRequest['status'],
  createdAt: s.createdAt,
})

export async function listAmenities(
  db: Database,
  { includeInactive = false } = {},
) {
  return db
    .select()
    .from(amenities)
    .where(includeInactive ? undefined : eq(amenities.active, true))
    .orderBy(asc(amenities.sort), asc(amenities.name))
}

export async function getAmenity(db: Database, slug: string) {
  const row = await db.query.amenities.findFirst({
    where: and(eq(amenities.slug, slug), eq(amenities.active, true)),
  })
  if (!row) throw notFound('Amenity')
  return row
}

export async function relatedAmenities(db: Database, slug: string) {
  await getAmenity(db, slug)
  return db
    .select()
    .from(amenities)
    .where(and(ne(amenities.slug, slug), eq(amenities.active, true)))
    .orderBy(asc(amenities.sort))
}

// Day of week (0 = Sunday) for a date-only string, in resort time (UTC).
const dayOfWeek = (date: string) => new Date(`${date}T00:00:00Z`).getUTCDay()

export async function listSlotDefinitions(
  db: Database,
  amenityId: string,
  { activeOnly = false } = {},
) {
  return db
    .select()
    .from(amenitySlots)
    .where(
      and(
        eq(amenitySlots.amenityId, amenityId),
        activeOnly ? eq(amenitySlots.active, true) : undefined,
      ),
    )
    .orderBy(asc(amenitySlots.sort), asc(amenitySlots.label))
}

// Slots offered on a date with remaining capacity (pending + confirmed requests count).
export async function slotAvailability(
  db: Database,
  slug: string,
  date: string,
) {
  const amenity = await getAmenity(db, slug)
  const defs = (
    await listSlotDefinitions(db, amenity.id, { activeOnly: true })
  ).filter((d) => !d.daysOfWeek || d.daysOfWeek.includes(dayOfWeek(date)))
  if (!defs.length) return { amenity, slots: [] }

  const taken = await db
    .select({
      slot: slotRequests.slot,
      guests: sql<number>`coalesce(sum(${slotRequests.partySize}), 0)`,
    })
    .from(slotRequests)
    .where(
      and(
        eq(slotRequests.amenityId, amenity.id),
        eq(slotRequests.date, date),
        inArray(slotRequests.status, ['pending', 'confirmed']),
      ),
    )
    .groupBy(slotRequests.slot)
  const used = new Map(taken.map((t) => [t.slot, t.guests]))
  return {
    amenity,
    slots: defs.map((d) => {
      const remaining = Math.max(0, d.capacity - (used.get(d.label) ?? 0))
      return {
        id: d.id,
        label: d.label,
        capacity: d.capacity,
        remaining,
        available: remaining > 0,
      }
    }),
  }
}

export async function createSlotRequest(db: Database, input: SlotRequestInput) {
  const amenity = await getAmenity(db, input.slug)
  if (!amenity.bookable)
    throw new ApiError(
      'VALIDATION',
      `${amenity.name} cannot be reserved online`,
    )
  if (input.date < today())
    throw new ApiError('VALIDATION', 'Pick a date from today onwards')

  // With slot definitions, the slot must be offered that day and have room for the party.
  const hasDefinitions =
    (await listSlotDefinitions(db, amenity.id, { activeOnly: true })).length > 0
  let capacity: number | null = null
  if (hasDefinitions) {
    const { slots } = await slotAvailability(db, amenity.slug, input.date)
    const slot = slots.find((s) => s.label === input.slot)
    if (!slot)
      throw new ApiError('VALIDATION', 'That time is not offered on this date')
    if (slot.remaining < input.partySize) {
      throw new ApiError(
        'CONFLICT',
        slot.remaining
          ? `Only ${slot.remaining} places left at ${slot.label}`
          : `${slot.label} is fully booked`,
      )
    }
    capacity = slot.capacity
  }

  const id = await nextReference(db, 'SLT')
  const now = new Date().toISOString()
  // Capacity re-checked inside the insert so two guests can't overfill a slot.
  const result = await db.run(sql`
    INSERT INTO slot_requests (id, amenity_id, slug, amenity_name, date, slot, party_size,
      name, email, note, status, created_at)
    SELECT ${id}, ${amenity.id}, ${amenity.slug}, ${amenity.name}, ${input.date}, ${input.slot},
      ${input.partySize}, ${input.name}, ${input.email}, ${input.note ?? null}, 'pending', ${now}
    WHERE ${capacity} IS NULL OR (SELECT coalesce(sum(party_size), 0) FROM slot_requests
      WHERE amenity_id = ${amenity.id} AND date = ${input.date} AND slot = ${input.slot}
        AND status IN ('pending', 'confirmed')) + ${input.partySize} <= ${capacity}
  `)
  if (!result.meta.changes)
    throw new ApiError('CONFLICT', 'That time just filled up')
  const row = first(
    await db.select().from(slotRequests).where(eq(slotRequests.id, id)),
  )
  if (!row) throw notFound('Slot request')
  return row
}

export async function createSlotDefinition(
  db: Database,
  amenityId: string,
  input: Omit<typeof amenitySlots.$inferInsert, 'id' | 'amenityId'>,
) {
  const amenity = await db.query.amenities.findFirst({
    where: eq(amenities.id, amenityId),
  })
  if (!amenity) throw notFound('Amenity')
  const [row] = await db
    .insert(amenitySlots)
    .values({ ...input, amenityId })
    .returning()
  return row
}

export async function updateSlotDefinition(
  db: Database,
  amenityId: string,
  slotId: string,
  patch: Partial<SlotDefRow>,
) {
  const row = first(
    await db
      .update(amenitySlots)
      .set(patch)
      .where(
        and(eq(amenitySlots.id, slotId), eq(amenitySlots.amenityId, amenityId)),
      )
      .returning(),
  )
  if (!row) throw notFound('Slot')
  return row
}

export async function deleteSlotDefinition(
  db: Database,
  amenityId: string,
  slotId: string,
) {
  const row = first(
    await db
      .delete(amenitySlots)
      .where(
        and(eq(amenitySlots.id, slotId), eq(amenitySlots.amenityId, amenityId)),
      )
      .returning(),
  )
  if (!row) throw notFound('Slot')
}

export async function createAmenity(
  db: Database,
  input: Omit<typeof amenities.$inferInsert, 'id'>,
) {
  const exists = await db.query.amenities.findFirst({
    where: eq(amenities.slug, input.slug),
  })
  if (exists)
    throw new ApiError('CONFLICT', 'An amenity with this slug already exists')
  const [row] = await db.insert(amenities).values(input).returning()
  return row
}

export async function listSlotRequests(
  db: Database,
  status: SlotRow['status'] | undefined,
  page: PageQuery,
) {
  return db
    .select()
    .from(slotRequests)
    .where(status ? eq(slotRequests.status, status) : undefined)
    .orderBy(desc(slotRequests.createdAt))
    .limit(page.limit + 1)
    .offset(page.cursor)
}

export async function changeSlotStatus(
  db: Database,
  id: string,
  status: SlotRow['status'],
) {
  const row = first(
    await db
      .update(slotRequests)
      .set({ status })
      .where(eq(slotRequests.id, id))
      .returning(),
  )
  if (!row) throw notFound('Slot request')
  return row
}

export async function updateAmenity(
  db: Database,
  id: string,
  patch: Partial<AmenityRow>,
) {
  const row = first(
    await db
      .update(amenities)
      .set(patch)
      .where(eq(amenities.id, id))
      .returning(),
  )
  if (!row) throw notFound('Amenity')
  return row
}
