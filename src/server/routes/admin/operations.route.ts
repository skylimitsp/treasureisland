import { Hono } from 'hono'

import { parse, readJson } from '#/server/lib/validate'
import { audit } from '#/server/lib/audit'
import { pageQuery, toPage } from '#/server/lib/pagination'
import { isoDate } from '#/schemas/common.schema'
import {
  availabilityPatchSchema,
  bookingListQuery,
  bookingStatusChangeSchema,
  bookingUpdateSchema,
  enquiryStatusChangeSchema,
  manualBookingSchema,
  noteSchema,
  roomBlockSchema,
  slotStatusChangeSchema,
} from '#/schemas/admin.schema'
import { currentUser } from '#/server/middleware/require-role'
import { getSettings } from '#/server/services/settings.service'
import { getActivity, getMetrics } from '#/server/services/dashboard.service'
import {
  changeBookingStatus,
  createBooking,
  getBookingWithHistory,
  listBookings,
  toBooking,
  updateBooking,
} from '#/server/services/bookings.service'
import {
  availabilityGrid,
  createBlock,
  deleteBlock,
  listBlocks,
  setRoomOpen,
} from '#/server/services/rooms.service'
import {
  addEnquiryNote,
  changeEnquiryStatus,
  getEnquiry,
  listEnquiries,
  toEnquiry,
} from '#/server/services/events.service'
import {
  changeSlotStatus,
  listSlotRequests,
  toSlotRequest,
} from '#/server/services/amenities.service'
import { notify } from '#/server/notifications/notify'
import { templates } from '#/server/notifications/templates'
import type { AppEnv } from '#/server/env'
import { z } from 'zod'

// Day-to-day front-desk work; open to concierge and admin.
export const operationsRoutes = new Hono<AppEnv>()

operationsRoutes.get('/metrics', async (c) =>
  c.json({ data: await getMetrics(c.get('db')) }),
)

operationsRoutes.get('/activity', async (c) => {
  const limit = Math.min(Number(c.req.query('limit') ?? 10) || 10, 50)
  return c.json({ data: await getActivity(c.get('db'), limit) })
})

operationsRoutes.get('/bookings', async (c) => {
  const filters = parse(bookingListQuery, c.req.query())
  const page = parse(pageQuery, c.req.query())
  const rows = await listBookings(c.get('db'), filters, page)
  const result = toPage(rows, page)
  return c.json({ ...result, data: result.data.map(toBooking) })
})

operationsRoutes.post('/bookings', async (c) => {
  const db = c.get('db')
  const user = currentUser(c)
  const input = parse(manualBookingSchema, await readJson(c.req.raw))
  const row = await createBooking(db, input, await getSettings(db), user.id)
  await audit(db, {
    actorId: user.id,
    action: 'booking.create',
    entity: 'booking',
    entityId: row.id,
  })
  return c.json({ data: toBooking(row) }, 201)
})

operationsRoutes.get('/bookings/:id', async (c) => {
  return c.json({
    data: await getBookingWithHistory(c.get('db'), c.req.param('id')),
  })
})

operationsRoutes.post('/bookings/:id/status', async (c) => {
  const db = c.get('db')
  const user = currentUser(c)
  const { status, note } = parse(
    bookingStatusChangeSchema,
    await readJson(c.req.raw),
  )
  const row = await changeBookingStatus(
    db,
    c.req.param('id'),
    status,
    user.id,
    note,
  )
  await audit(db, {
    actorId: user.id,
    action: 'booking.status',
    entity: 'booking',
    entityId: row.id,
    diff: { status },
  })
  if (status === 'confirmed' || status === 'cancelled') {
    notify(c.env, [{ to: row.email, ...templates.bookingStatus(row) }])
  }
  return c.json({ data: toBooking(row) })
})

operationsRoutes.patch('/bookings/:id', async (c) => {
  const db = c.get('db')
  const user = currentUser(c)
  const patch = parse(bookingUpdateSchema, await readJson(c.req.raw))
  const row = await updateBooking(
    db,
    c.req.param('id'),
    patch,
    await getSettings(db),
    user.id,
  )
  await audit(db, {
    actorId: user.id,
    action: 'booking.update',
    entity: 'booking',
    entityId: row.id,
    diff: patch,
  })
  return c.json({ data: toBooking(row) })
})

operationsRoutes.get('/availability', async (c) => {
  const db = c.get('db')
  const from = c.req.query('from')
    ? parse(isoDate, c.req.query('from'))
    : undefined
  const to = c.req.query('to') ? parse(isoDate, c.req.query('to')) : undefined
  return c.json({
    data: await availabilityGrid(db, await getSettings(db), from, to),
  })
})

operationsRoutes.patch('/availability/:roomId', async (c) => {
  const db = c.get('db')
  const user = currentUser(c)
  const patch = parse(availabilityPatchSchema, await readJson(c.req.raw))
  const data = await setRoomOpen(db, c.req.param('roomId'), patch)
  await audit(db, {
    actorId: user.id,
    action: 'room.availability',
    entity: 'room',
    entityId: data.roomId,
    diff: patch,
  })
  return c.json({ data })
})

operationsRoutes.get('/room-blocks', async (c) =>
  c.json({ data: await listBlocks(c.get('db')) }),
)

operationsRoutes.post('/room-blocks', async (c) => {
  const db = c.get('db')
  const user = currentUser(c)
  const input = parse(roomBlockSchema, await readJson(c.req.raw))
  const row = await createBlock(db, input, user.id)
  await audit(db, {
    actorId: user.id,
    action: 'room.block',
    entity: 'room',
    entityId: input.roomId,
    diff: input,
  })
  return c.json({ data: row }, 201)
})

operationsRoutes.delete('/room-blocks/:id', async (c) => {
  const db = c.get('db')
  const user = currentUser(c)
  const row = await deleteBlock(db, c.req.param('id'))
  await audit(db, {
    actorId: user.id,
    action: 'room.unblock',
    entity: 'room',
    entityId: row.roomId,
  })
  return c.body(null, 204)
})

const enquiryListQuery = z.object({
  status: z.enum(['new', 'contacted', 'closed']).optional(),
  q: z.string().trim().max(100).optional(),
})

operationsRoutes.get('/enquiries', async (c) => {
  const filters = parse(enquiryListQuery, c.req.query())
  const page = parse(pageQuery, c.req.query())
  const result = toPage(await listEnquiries(c.get('db'), filters, page), page)
  return c.json({ ...result, data: result.data.map(toEnquiry) })
})

operationsRoutes.get('/enquiries/:id', async (c) => {
  return c.json({ data: await getEnquiry(c.get('db'), c.req.param('id')) })
})

operationsRoutes.post('/enquiries/:id/status', async (c) => {
  const db = c.get('db')
  const user = currentUser(c)
  const { status } = parse(enquiryStatusChangeSchema, await readJson(c.req.raw))
  const row = await changeEnquiryStatus(db, c.req.param('id'), status)
  await audit(db, {
    actorId: user.id,
    action: 'enquiry.status',
    entity: 'enquiry',
    entityId: row.id,
    diff: { status },
  })
  return c.json({ data: toEnquiry(row) })
})

operationsRoutes.post('/enquiries/:id/notes', async (c) => {
  const user = currentUser(c)
  const { body } = parse(noteSchema, await readJson(c.req.raw))
  return c.json(
    {
      data: await addEnquiryNote(c.get('db'), c.req.param('id'), body, user.id),
    },
    201,
  )
})

const slotListQuery = z.object({
  status: z.enum(['pending', 'confirmed', 'declined']).optional(),
})

operationsRoutes.get('/slot-requests', async (c) => {
  const { status } = parse(slotListQuery, c.req.query())
  const page = parse(pageQuery, c.req.query())
  const result = toPage(await listSlotRequests(c.get('db'), status, page), page)
  return c.json({ ...result, data: result.data.map(toSlotRequest) })
})

operationsRoutes.post('/slot-requests/:id/status', async (c) => {
  const db = c.get('db')
  const user = currentUser(c)
  const { status } = parse(slotStatusChangeSchema, await readJson(c.req.raw))
  const row = await changeSlotStatus(db, c.req.param('id'), status)
  await audit(db, {
    actorId: user.id,
    action: 'slot.status',
    entity: 'slot_request',
    entityId: row.id,
    diff: { status },
  })
  if (status !== 'pending')
    notify(c.env, [{ to: row.email, ...templates.slotStatus(row) }])
  return c.json({ data: toSlotRequest(row) })
})
