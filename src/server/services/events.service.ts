/**
 * Events: teasers, event types (with packages) and the enquiry pipeline.
 * @author Joseph Nartey
 * @github devjoemedia
 */
import { and, asc, desc, eq, like, or } from 'drizzle-orm'

import {
  enquiryNotes,
  eventEnquiries,
  eventTeasers,
  eventTypes,
} from '#/server/db/schema'
import { first } from '#/server/lib/rows'
import { ApiError, notFound } from '#/server/lib/errors'
import { toMajor } from '#/server/lib/money'
import { nextReference } from '#/server/lib/references'
import type { Database } from '#/server/db/client'
import type { PageQuery } from '#/server/lib/pagination'
import type {
  EnquiryStatus,
  EventEnquiry,
  EventEnquiryInput,
  EventTeaser,
  EventType,
} from '#/types'

type TypeRow = typeof eventTypes.$inferSelect
type EnquiryRow = typeof eventEnquiries.$inferSelect

export const toTeaser = (t: typeof eventTeasers.$inferSelect): EventTeaser => ({
  slug: t.slug,
  name: t.name,
  blurb: t.blurb,
  image: t.image,
  video: t.video ?? undefined,
  tag: t.tag,
  kicker: t.kicker,
  cta: t.cta,
})

export const toEventType = (t: TypeRow): EventType => ({
  slug: t.slug,
  category: t.category,
  name: t.name,
  title: t.title,
  blurb: t.blurb,
  description: t.description,
  icon: t.icon,
  inclusions: t.inclusions ?? undefined,
  capacityMin: t.capacityMin ?? undefined,
  capacityMax: t.capacityMax ?? undefined,
  fromPrice: t.fromPrice === null ? null : toMajor(t.fromPrice),
  gallery: t.gallery,
  packages: t.packages ?? undefined,
})

export const toEnquiry = (
  e: EnquiryRow,
): EventEnquiry & { assignedTo: string | null } => ({
  id: e.id,
  eventType: e.eventType,
  date: e.date,
  flexibleDates: e.flexibleDates,
  guests: e.guests,
  name: e.name,
  email: e.email,
  phone: e.phone,
  budget: e.budget,
  message: e.message,
  consent: e.consent,
  status: e.status,
  assignedTo: e.assignedTo,
  createdAt: e.createdAt,
})

export async function listTeasers(db: Database) {
  return db.select().from(eventTeasers).orderBy(asc(eventTeasers.sort))
}

export async function listEventTypes(db: Database) {
  return db.select().from(eventTypes).orderBy(asc(eventTypes.sort))
}

export async function updateEventType(
  db: Database,
  slug: string,
  patch: Partial<TypeRow>,
) {
  const row = first(
    await db
      .update(eventTypes)
      .set(patch)
      .where(eq(eventTypes.slug, slug))
      .returning(),
  )
  if (!row) throw notFound('Event type')
  return row
}

export async function createEventType(
  db: Database,
  input: typeof eventTypes.$inferInsert,
) {
  const exists = await db.query.eventTypes.findFirst({
    where: eq(eventTypes.slug, input.slug),
  })
  if (exists)
    throw new ApiError(
      'CONFLICT',
      'An event type with this slug already exists',
    )
  const [row] = await db.insert(eventTypes).values(input).returning()
  return row
}

// Enquiries store the category, not the slug, so removing a type leaves them intact.
export async function deleteEventType(db: Database, slug: string) {
  const row = first(
    await db.delete(eventTypes).where(eq(eventTypes.slug, slug)).returning(),
  )
  if (!row) throw notFound('Event type')
}

export async function createEnquiry(db: Database, input: EventEnquiryInput) {
  const id = await nextReference(db, 'ENQ')
  const [row] = await db
    .insert(eventEnquiries)
    .values({ ...input, id, status: 'new' })
    .returning()
  return row
}

export async function listEnquiries(
  db: Database,
  filters: { status?: EnquiryStatus; q?: string },
  page: PageQuery,
) {
  const q = filters.q ? `%${filters.q}%` : undefined
  return db
    .select()
    .from(eventEnquiries)
    .where(
      and(
        filters.status ? eq(eventEnquiries.status, filters.status) : undefined,
        q
          ? or(
              like(eventEnquiries.id, q),
              like(eventEnquiries.name, q),
              like(eventEnquiries.email, q),
            )
          : undefined,
      ),
    )
    .orderBy(desc(eventEnquiries.createdAt))
    .limit(page.limit + 1)
    .offset(page.cursor)
}

export async function getEnquiry(db: Database, id: string) {
  const row = await db.query.eventEnquiries.findFirst({
    where: eq(eventEnquiries.id, id),
  })
  if (!row) throw notFound('Enquiry')
  const notes = await db
    .select()
    .from(enquiryNotes)
    .where(eq(enquiryNotes.enquiryId, id))
    .orderBy(asc(enquiryNotes.createdAt))
  return { ...toEnquiry(row), notes }
}

export async function changeEnquiryStatus(
  db: Database,
  id: string,
  status: EnquiryStatus,
) {
  const row = first(
    await db
      .update(eventEnquiries)
      .set({ status })
      .where(eq(eventEnquiries.id, id))
      .returning(),
  )
  if (!row) throw notFound('Enquiry')
  return row
}

export async function addEnquiryNote(
  db: Database,
  id: string,
  body: string,
  byUser: string,
) {
  await getEnquiry(db, id)
  const [row] = await db
    .insert(enquiryNotes)
    .values({ enquiryId: id, body, byUser })
    .returning()
  return row
}
