import { Hono } from 'hono'

import { parse } from '#/server/lib/validate'
import { ApiError } from '#/server/lib/errors'
import { quoteQuerySchema } from '#/schemas/booking.schema'
import { getSettings, publicSettings } from '#/server/services/settings.service'
import {
  getRoomBySlug,
  listRooms,
  quote,
  toRoom,
} from '#/server/services/rooms.service'
import {
  getAmenity,
  listAmenities,
  relatedAmenities,
  slotAvailability,
  toAmenity,
} from '#/server/services/amenities.service'
import {
  buildCalendar,
  isValidCalendarToken,
} from '#/server/services/calendar.service'
import { isoDate } from '#/schemas/common.schema'
import { mediaBucket } from '#/server/services/media.service'
import {
  listEventTypes,
  listTeasers,
  toEventType,
  toTeaser,
} from '#/server/services/events.service'
import {
  getContent,
  getMenu,
  listFaqs,
  listReviews,
  toTestimonial,
} from '#/server/services/content.service'
import type { AppEnv } from '#/server/env'

// Read-only public content; cached briefly at the edge/browser.
export const catalogueRoutes = new Hono<AppEnv>()

catalogueRoutes.use('*', async (c, next) => {
  await next()
  if (c.res.ok && !c.res.headers.has('cache-control')) {
    c.res.headers.set(
      'cache-control',
      'public, max-age=60, stale-while-revalidate=300',
    )
  }
})

catalogueRoutes.get('/site', async (c) => {
  return c.json({ data: publicSettings(await getSettings(c.get('db'))) })
})

catalogueRoutes.get('/stats', async (c) => {
  const rooms = await listRooms(c.get('db'))
  return c.json({ data: { rooms: rooms.length } })
})

catalogueRoutes.get('/rooms', async (c) => {
  const rows = await listRooms(c.get('db'))
  return c.json({ data: rows.map(toRoom) })
})

catalogueRoutes.get('/rooms/:slug', async (c) => {
  return c.json({
    data: toRoom(await getRoomBySlug(c.get('db'), c.req.param('slug'))),
  })
})

catalogueRoutes.get('/rooms/:slug/quote', async (c) => {
  const db = c.get('db')
  const input = parse(quoteQuerySchema, c.req.query())
  const data = await quote(
    db,
    c.req.param('slug'),
    input,
    await getSettings(db),
  )
  c.header('cache-control', 'no-store')
  return c.json({ data })
})

catalogueRoutes.get('/amenities', async (c) => {
  const rows = await listAmenities(c.get('db'))
  return c.json({ data: rows.map(toAmenity) })
})

catalogueRoutes.get('/amenities/:slug', async (c) => {
  return c.json({
    data: toAmenity(await getAmenity(c.get('db'), c.req.param('slug'))),
  })
})

catalogueRoutes.get('/amenities/:slug/related', async (c) => {
  const rows = await relatedAmenities(c.get('db'), c.req.param('slug'))
  return c.json({ data: rows.map(toAmenity) })
})

catalogueRoutes.get('/amenities/:slug/slots', async (c) => {
  const date = parse(isoDate, c.req.query('date'))
  const { slots } = await slotAvailability(
    c.get('db'),
    c.req.param('slug'),
    date,
  )
  c.header('cache-control', 'no-store')
  return c.json({ data: { date, slots } })
})

// Token-protected staff feed; a wrong token is a plain 404 so the URL isn't discoverable.
catalogueRoutes.get('/calendar.ics', async (c) => {
  const db = c.get('db')
  const token = c.req.query('token') ?? ''
  if (token.length < 16 || !(await isValidCalendarToken(db, token))) {
    throw new ApiError('NOT_FOUND', 'Not found')
  }
  const body = await buildCalendar(db, new URL(c.req.url).host)
  return c.body(body, 200, {
    'content-type': 'text/calendar; charset=utf-8',
    'cache-control': 'private, no-store',
  })
})

catalogueRoutes.get('/events/teasers', async (c) => {
  const rows = await listTeasers(c.get('db'))
  return c.json({ data: rows.map(toTeaser) })
})

catalogueRoutes.get('/events/types', async (c) => {
  const rows = await listEventTypes(c.get('db'))
  return c.json({ data: rows.map(toEventType) })
})

catalogueRoutes.get('/content/testimonials', async (c) => {
  const rows = await listReviews(c.get('db'), { featuredOnly: true })
  return c.json({ data: rows.map(toTestimonial) })
})

catalogueRoutes.get('/content/faqs', async (c) => {
  const rows = await listFaqs(c.get('db'))
  return c.json({ data: rows.map(({ q, a }) => ({ q, a })) })
})

catalogueRoutes.get('/content/about', async (c) => {
  return c.json({ data: await getContent(c.get('db'), 'about') })
})

// Mirrors the site's `menu` feature flag: hidden until the client publishes a menu.
catalogueRoutes.get('/menu', async (c) => {
  const db = c.get('db')
  const settings = await getSettings(db)
  if (!settings.features.menu)
    throw new ApiError('NOT_FOUND', 'The menu is not published yet')
  return c.json({ data: await getMenu(db) })
})

catalogueRoutes.get('/media/*', async (c) => {
  const key = c.req.path.replace(/^.*\/media\//, '')
  const object = await mediaBucket(c.env).get(key)
  if (!object) throw new ApiError('NOT_FOUND', 'File not found')
  return c.body(object.body, 200, {
    'content-type':
      object.httpMetadata?.contentType ?? 'application/octet-stream',
    'cache-control': 'public, max-age=31536000, immutable',
    etag: object.httpEtag,
  })
})
