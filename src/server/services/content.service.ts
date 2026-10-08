/**
 * Editorial content: reviews/testimonials, FAQs, keyed content blocks, menu.
 * @author Joseph Nartey
 * @github devjoemedia
 */
import { asc, eq } from 'drizzle-orm'

import {
  contentBlocks,
  faqs,
  menuItems,
  menuSections,
  reviews,
} from '#/server/db/schema'
import { first } from '#/server/lib/rows'
import { ApiError, notFound } from '#/server/lib/errors'
import { toMajor, toMinor } from '#/server/lib/money'
import type { Database } from '#/server/db/client'
import type { MenuItem, MenuSection, Review, Testimonial } from '#/types'

type ReviewRow = typeof reviews.$inferSelect

export const toReview = (r: ReviewRow): Review => ({
  id: r.id,
  quote: r.quote,
  name: r.name,
  origin: r.origin,
  rating: r.rating ?? undefined,
  featured: r.featured,
})

export const toTestimonial = (r: ReviewRow): Testimonial => ({
  id: r.id,
  quote: r.quote,
  name: r.name,
  origin: r.origin,
  rating: r.rating ?? undefined,
})

export async function listReviews(db: Database, { featuredOnly = false } = {}) {
  return db
    .select()
    .from(reviews)
    .where(featuredOnly ? eq(reviews.featured, true) : undefined)
    .orderBy(asc(reviews.sort), asc(reviews.createdAt))
}

export async function createReview(
  db: Database,
  input: typeof reviews.$inferInsert,
) {
  const [row] = await db.insert(reviews).values(input).returning()
  return row
}

export async function updateReview(
  db: Database,
  id: string,
  patch: Partial<ReviewRow>,
) {
  const row = first(
    await db.update(reviews).set(patch).where(eq(reviews.id, id)).returning(),
  )
  if (!row) throw notFound('Review')
  return row
}

export async function deleteReview(db: Database, id: string) {
  const row = first(
    await db.delete(reviews).where(eq(reviews.id, id)).returning(),
  )
  if (!row) throw notFound('Review')
}

export async function listFaqs(db: Database) {
  return db.select().from(faqs).orderBy(asc(faqs.sort))
}

export async function createFaq(db: Database, input: { q: string; a: string }) {
  const existing = await listFaqs(db)
  const [row] = await db
    .insert(faqs)
    .values({ ...input, sort: existing.length })
    .returning()
  return row
}

export async function updateFaq(
  db: Database,
  id: string,
  patch: { q?: string; a?: string },
) {
  const row = first(
    await db.update(faqs).set(patch).where(eq(faqs.id, id)).returning(),
  )
  if (!row) throw notFound('FAQ')
  return row
}

export async function deleteFaq(db: Database, id: string) {
  const row = first(await db.delete(faqs).where(eq(faqs.id, id)).returning())
  if (!row) throw notFound('FAQ')
}

export async function reorderFaqs(db: Database, ids: Array<string>) {
  await db.batch(
    ids.map((id, sort) =>
      db.update(faqs).set({ sort }).where(eq(faqs.id, id)),
    ) as [never, ...Array<never>],
  )
  return listFaqs(db)
}

export const CONTENT_KEYS = ['about'] as const
export type ContentKey = (typeof CONTENT_KEYS)[number]

export async function getContent(db: Database, key: string) {
  const row = await db.query.contentBlocks.findFirst({
    where: eq(contentBlocks.key, key),
  })
  if (!row) throw notFound('Content')
  return row.value
}

export async function putContent(
  db: Database,
  key: string,
  value: unknown,
  by: string,
) {
  if (!CONTENT_KEYS.includes(key as ContentKey)) {
    throw new ApiError('NOT_FOUND', `Unknown content block "${key}"`)
  }
  await db
    .insert(contentBlocks)
    .values({ key, value, updatedBy: by })
    .onConflictDoUpdate({
      target: contentBlocks.key,
      set: { value, updatedBy: by },
    })
  return value
}

export const toMenuItem = (m: typeof menuItems.$inferSelect): MenuItem => ({
  id: m.id,
  name: m.name,
  description: m.description,
  category: m.category,
  price: toMajor(m.price),
  available: m.available,
})

export const toMenuSection = (
  s: typeof menuSections.$inferSelect,
): MenuSection => ({
  id: s.id,
  title: s.title,
  group: s.group,
  order: s.order,
  tagline: s.tagline ?? undefined,
})

export async function getMenu(db: Database) {
  const [items, sections] = await Promise.all([
    db.select().from(menuItems).orderBy(asc(menuItems.sort)),
    db.select().from(menuSections).orderBy(asc(menuSections.order)),
  ])
  return { items: items.map(toMenuItem), sections: sections.map(toMenuSection) }
}

export async function upsertMenuSection(
  db: Database,
  input: typeof menuSections.$inferInsert,
) {
  const [row] = await db
    .insert(menuSections)
    .values(input)
    .onConflictDoUpdate({ target: menuSections.id, set: input })
    .returning()
  return toMenuSection(row)
}

export async function deleteMenuSection(db: Database, id: string) {
  const used = await db.query.menuItems.findFirst({
    where: eq(menuItems.category, id as never),
  })
  if (used)
    throw new ApiError(
      'CONFLICT',
      'Move or delete the items in this section first',
    )
  const row = first(
    await db
      .delete(menuSections)
      .where(eq(menuSections.id, id as never))
      .returning(),
  )
  if (!row) throw notFound('Menu section')
}

type MenuItemInput = Omit<typeof menuItems.$inferInsert, 'price' | 'id'> & {
  price: number
}

export async function createMenuItem(db: Database, input: MenuItemInput) {
  const [row] = await db
    .insert(menuItems)
    .values({ ...input, price: toMinor(input.price) })
    .returning()
  return toMenuItem(row)
}

export async function updateMenuItem(
  db: Database,
  id: string,
  input: MenuItemInput,
) {
  const row = first(
    await db
      .update(menuItems)
      .set({ ...input, price: toMinor(input.price) })
      .where(eq(menuItems.id, id))
      .returning(),
  )
  if (!row) throw notFound('Menu item')
  return toMenuItem(row)
}

export async function deleteMenuItem(db: Database, id: string) {
  const row = first(
    await db.delete(menuItems).where(eq(menuItems.id, id)).returning(),
  )
  if (!row) throw notFound('Menu item')
}
