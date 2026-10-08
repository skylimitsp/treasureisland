import { Hono } from 'hono'

import { parse, readJson } from '#/server/lib/validate'
import { audit } from '#/server/lib/audit'
import { toMinor } from '#/server/lib/money'
import {
  amenityCreateSchema,
  amenityPatchSchema,
  eventTypeCreateSchema,
  eventTypePatchSchema,
  faqSchema,
  menuItemSchema,
  menuSectionSchema,
  reorderSchema,
  reviewCreateSchema,
  reviewPatchSchema,
  roomCreateSchema,
  roomPatchSchema,
  slotDefinitionPatchSchema,
  slotDefinitionSchema,
} from '#/schemas/admin.schema'
import { currentUser, requireAdmin } from '#/server/middleware/require-role'
import { getSettings } from '#/server/services/settings.service'
import {
  createRoom,
  listRooms,
  toRoom,
  updateRoom,
} from '#/server/services/rooms.service'
import {
  createAmenity,
  createSlotDefinition,
  deleteSlotDefinition,
  listAmenities,
  listSlotDefinitions,
  toAmenity,
  updateAmenity,
  updateSlotDefinition,
} from '#/server/services/amenities.service'
import {
  createEventType,
  deleteEventType,
  listEventTypes,
  toEventType,
  updateEventType,
} from '#/server/services/events.service'
import {
  createFaq,
  createMenuItem,
  createReview,
  deleteFaq,
  deleteMenuItem,
  deleteMenuSection,
  deleteReview,
  getContent,
  getMenu,
  listFaqs,
  listReviews,
  putContent,
  reorderFaqs,
  toReview,
  updateFaq,
  updateMenuItem,
  updateReview,
  upsertMenuSection,
} from '#/server/services/content.service'
import type { Context } from 'hono'
import type { AppEnv } from '#/server/env'

// Content the public site renders. Reads are staff-wide; every write is admin-only.
export const catalogueAdminRoutes = new Hono<AppEnv>()

const log = (
  c: Context<AppEnv>,
  action: string,
  entity: string,
  entityId: string,
  diff?: unknown,
) =>
  audit(c.get('db'), {
    actorId: currentUser(c).id,
    action,
    entity,
    entityId,
    diff,
  })

catalogueAdminRoutes.get('/rooms', async (c) => {
  const rows = await listRooms(c.get('db'), { includeInactive: true })
  return c.json({
    data: rows.map((r) => ({
      ...toRoom(r),
      inventory: r.inventory,
      active: r.active,
      sort: r.sort,
    })),
  })
})

catalogueAdminRoutes.post('/rooms', requireAdmin, async (c) => {
  const db = c.get('db')
  const input = parse(roomCreateSchema, await readJson(c.req.raw))
  const row = await createRoom(db, input, await getSettings(db))
  await log(c, 'room.create', 'room', row.id, input)
  return c.json({ data: toRoom(row) }, 201)
})

catalogueAdminRoutes.patch('/rooms/:id', requireAdmin, async (c) => {
  const patch = parse(roomPatchSchema, await readJson(c.req.raw))
  const row = await updateRoom(c.get('db'), c.req.param('id'), patch)
  await log(c, 'room.update', 'room', row.id, patch)
  return c.json({ data: toRoom(row) })
})

// Rooms are archived, never hard-deleted, because bookings reference them.
catalogueAdminRoutes.delete('/rooms/:id', requireAdmin, async (c) => {
  const row = await updateRoom(c.get('db'), c.req.param('id'), {
    active: false,
  })
  await log(c, 'room.archive', 'room', row.id)
  return c.body(null, 204)
})

catalogueAdminRoutes.get('/amenities', async (c) => {
  const rows = await listAmenities(c.get('db'), { includeInactive: true })
  return c.json({
    data: rows.map((a) => ({
      ...toAmenity(a),
      active: a.active,
      sort: a.sort,
    })),
  })
})

catalogueAdminRoutes.patch('/amenities/:id', requireAdmin, async (c) => {
  const patch = parse(amenityPatchSchema, await readJson(c.req.raw))
  const row = await updateAmenity(c.get('db'), c.req.param('id'), patch)
  await log(c, 'amenity.update', 'amenity', row.id, patch)
  return c.json({ data: toAmenity(row) })
})

catalogueAdminRoutes.post('/amenities', requireAdmin, async (c) => {
  const input = parse(amenityCreateSchema, await readJson(c.req.raw))
  const row = await createAmenity(c.get('db'), input)
  await log(c, 'amenity.create', 'amenity', row.id, { slug: row.slug })
  return c.json({ data: toAmenity(row) }, 201)
})

// Archived, not deleted: past slot requests still reference the amenity.
catalogueAdminRoutes.delete('/amenities/:id', requireAdmin, async (c) => {
  const row = await updateAmenity(c.get('db'), c.req.param('id'), {
    active: false,
  })
  await log(c, 'amenity.archive', 'amenity', row.id)
  return c.body(null, 204)
})

catalogueAdminRoutes.get('/amenities/:id/slots', async (c) => {
  const rows = await listSlotDefinitions(c.get('db'), c.req.param('id'))
  return c.json({ data: rows })
})

catalogueAdminRoutes.post('/amenities/:id/slots', requireAdmin, async (c) => {
  const input = parse(slotDefinitionSchema, await readJson(c.req.raw))
  const row = await createSlotDefinition(c.get('db'), c.req.param('id'), input)
  await log(c, 'amenity_slot.create', 'amenity', c.req.param('id'), input)
  return c.json({ data: row }, 201)
})

catalogueAdminRoutes.patch(
  '/amenities/:id/slots/:slotId',
  requireAdmin,
  async (c) => {
    const patch = parse(slotDefinitionPatchSchema, await readJson(c.req.raw))
    const row = await updateSlotDefinition(
      c.get('db'),
      c.req.param('id'),
      c.req.param('slotId'),
      patch,
    )
    await log(c, 'amenity_slot.update', 'amenity', c.req.param('id'), patch)
    return c.json({ data: row })
  },
)

catalogueAdminRoutes.delete(
  '/amenities/:id/slots/:slotId',
  requireAdmin,
  async (c) => {
    await deleteSlotDefinition(
      c.get('db'),
      c.req.param('id'),
      c.req.param('slotId'),
    )
    await log(c, 'amenity_slot.delete', 'amenity', c.req.param('id'))
    return c.body(null, 204)
  },
)

catalogueAdminRoutes.get('/events/types', async (c) => {
  const rows = await listEventTypes(c.get('db'))
  return c.json({ data: rows.map(toEventType) })
})

catalogueAdminRoutes.patch('/events/types/:slug', requireAdmin, async (c) => {
  const { fromPrice, ...patch } = parse(
    eventTypePatchSchema,
    await readJson(c.req.raw),
  )
  const row = await updateEventType(c.get('db'), c.req.param('slug'), {
    ...patch,
    ...(fromPrice !== undefined && {
      fromPrice: fromPrice === null ? null : toMinor(fromPrice),
    }),
  })
  await log(c, 'event_type.update', 'event_type', row.slug, patch)
  return c.json({ data: toEventType(row) })
})

catalogueAdminRoutes.post('/events/types', requireAdmin, async (c) => {
  const { fromPrice, ...input } = parse(
    eventTypeCreateSchema,
    await readJson(c.req.raw),
  )
  const row = await createEventType(c.get('db'), {
    ...input,
    fromPrice: fromPrice === null ? null : toMinor(fromPrice),
  })
  await log(c, 'event_type.create', 'event_type', row.slug)
  return c.json({ data: toEventType(row) }, 201)
})

catalogueAdminRoutes.delete('/events/types/:slug', requireAdmin, async (c) => {
  await deleteEventType(c.get('db'), c.req.param('slug'))
  await log(c, 'event_type.delete', 'event_type', c.req.param('slug'))
  return c.body(null, 204)
})

catalogueAdminRoutes.get('/reviews', async (c) => {
  const rows = await listReviews(c.get('db'))
  return c.json({ data: rows.map(toReview) })
})

catalogueAdminRoutes.post('/reviews', requireAdmin, async (c) => {
  const input = parse(reviewCreateSchema, await readJson(c.req.raw))
  const row = await createReview(c.get('db'), input)
  await log(c, 'review.create', 'review', row.id)
  return c.json({ data: toReview(row) }, 201)
})

catalogueAdminRoutes.patch('/reviews/:id', requireAdmin, async (c) => {
  const patch = parse(reviewPatchSchema, await readJson(c.req.raw))
  const row = await updateReview(c.get('db'), c.req.param('id'), patch)
  await log(c, 'review.update', 'review', row.id, patch)
  return c.json({ data: toReview(row) })
})

catalogueAdminRoutes.delete('/reviews/:id', requireAdmin, async (c) => {
  await deleteReview(c.get('db'), c.req.param('id'))
  await log(c, 'review.delete', 'review', c.req.param('id'))
  return c.body(null, 204)
})

catalogueAdminRoutes.get('/faqs', async (c) =>
  c.json({ data: await listFaqs(c.get('db')) }),
)

catalogueAdminRoutes.post('/faqs', requireAdmin, async (c) => {
  const row = await createFaq(
    c.get('db'),
    parse(faqSchema, await readJson(c.req.raw)),
  )
  await log(c, 'faq.create', 'faq', row.id)
  return c.json({ data: row }, 201)
})

catalogueAdminRoutes.post('/faqs/reorder', requireAdmin, async (c) => {
  const { ids } = parse(reorderSchema, await readJson(c.req.raw))
  const rows = await reorderFaqs(c.get('db'), ids)
  await log(c, 'faq.reorder', 'faq', 'all', { ids })
  return c.json({ data: rows })
})

catalogueAdminRoutes.patch('/faqs/:id', requireAdmin, async (c) => {
  const patch = parse(faqSchema.partial(), await readJson(c.req.raw))
  const row = await updateFaq(c.get('db'), c.req.param('id'), patch)
  await log(c, 'faq.update', 'faq', row.id, patch)
  return c.json({ data: row })
})

catalogueAdminRoutes.delete('/faqs/:id', requireAdmin, async (c) => {
  await deleteFaq(c.get('db'), c.req.param('id'))
  await log(c, 'faq.delete', 'faq', c.req.param('id'))
  return c.body(null, 204)
})

catalogueAdminRoutes.get('/content/:key', async (c) => {
  return c.json({ data: await getContent(c.get('db'), c.req.param('key')) })
})

catalogueAdminRoutes.put('/content/:key', requireAdmin, async (c) => {
  const user = currentUser(c)
  const value = await readJson(c.req.raw)
  const data = await putContent(c.get('db'), c.req.param('key'), value, user.id)
  await log(c, 'content.update', 'content', c.req.param('key'))
  return c.json({ data })
})

// Admins manage the menu even while the public `menu` flag keeps it hidden.
catalogueAdminRoutes.get('/menu', async (c) =>
  c.json({ data: await getMenu(c.get('db')) }),
)

catalogueAdminRoutes.put('/menu/sections/:id', requireAdmin, async (c) => {
  const body = (await readJson(c.req.raw)) as Record<string, unknown>
  const input = parse(menuSectionSchema, { ...body, id: c.req.param('id') })
  const row = await upsertMenuSection(c.get('db'), input as never)
  await log(c, 'menu_section.upsert', 'menu_section', row.id, input)
  return c.json({ data: row })
})

catalogueAdminRoutes.delete('/menu/sections/:id', requireAdmin, async (c) => {
  await deleteMenuSection(c.get('db'), c.req.param('id'))
  await log(c, 'menu_section.delete', 'menu_section', c.req.param('id'))
  return c.body(null, 204)
})

catalogueAdminRoutes.post('/menu/items', requireAdmin, async (c) => {
  const input = parse(menuItemSchema, await readJson(c.req.raw))
  const row = await createMenuItem(c.get('db'), input as never)
  await log(c, 'menu_item.create', 'menu_item', row.id)
  return c.json({ data: row }, 201)
})

catalogueAdminRoutes.put('/menu/items/:id', requireAdmin, async (c) => {
  const input = parse(menuItemSchema, await readJson(c.req.raw))
  const row = await updateMenuItem(
    c.get('db'),
    c.req.param('id'),
    input as never,
  )
  await log(c, 'menu_item.update', 'menu_item', row.id, input)
  return c.json({ data: row })
})

catalogueAdminRoutes.delete('/menu/items/:id', requireAdmin, async (c) => {
  await deleteMenuItem(c.get('db'), c.req.param('id'))
  await log(c, 'menu_item.delete', 'menu_item', c.req.param('id'))
  return c.body(null, 204)
})
