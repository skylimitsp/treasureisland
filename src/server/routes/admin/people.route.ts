import { Hono } from 'hono'
import { z } from 'zod'
import { desc } from 'drizzle-orm'

import { auditLog } from '#/server/db/schema'
import { parse, readJson } from '#/server/lib/validate'
import { audit } from '#/server/lib/audit'
import { pageQuery, toPage } from '#/server/lib/pagination'
import { inviteSchema, updateUserSchema } from '#/schemas/auth.schema'
import { settingsPatchSchema } from '#/schemas/admin.schema'
import { currentUser } from '#/server/middleware/require-role'
import { createInvite } from '#/server/services/auth.service'
import { listUsers, toUser, updateUser } from '#/server/services/users.service'
import {
  listSubscribers,
  toCsv,
  toSignup,
  unsubscribeById,
} from '#/server/services/newsletter.service'
import { getSettings, updateSettings } from '#/server/services/settings.service'
import {
  deleteMedia,
  listMedia,
  mediaBucket,
  uploadMedia,
} from '#/server/services/media.service'
import { adminLink, notify } from '#/server/notifications/notify'
import { templates } from '#/server/notifications/templates'
import { ApiError } from '#/server/lib/errors'
import { rotateCalendarToken } from '#/server/services/calendar.service'
import type { AppEnv } from '#/server/env'

// Admin-only: staff, subscribers, media, settings and the audit trail.
export const peopleRoutes = new Hono<AppEnv>()

peopleRoutes.get('/users', async (c) => {
  const rows = await listUsers(c.get('db'))
  return c.json({ data: rows.map(toUser) })
})

peopleRoutes.patch('/users/:id', async (c) => {
  const db = c.get('db')
  const user = currentUser(c)
  const patch = parse(updateUserSchema, await readJson(c.req.raw))
  const row = await updateUser(db, c.req.param('id'), patch, user.id)
  await audit(db, {
    actorId: user.id,
    action: 'user.update',
    entity: 'user',
    entityId: row.id,
    diff: patch,
  })
  return c.json({ data: toUser(row) })
})

peopleRoutes.post('/users/invite', async (c) => {
  const db = c.get('db')
  const user = currentUser(c)
  const { email, role } = parse(inviteSchema, await readJson(c.req.raw))
  const token = await createInvite(db, email, role, user.id)
  notify(c.env, [
    {
      to: email,
      ...templates.staffInvite(
        role,
        adminLink(c.env, `/auth/invite?token=${token}`),
      ),
    },
  ])
  await audit(db, {
    actorId: user.id,
    action: 'user.invite',
    entity: 'user',
    entityId: email,
    diff: { role },
  })
  return c.json({ data: { email, role, status: 'invited' } }, 201)
})

const subscriberQuery = z.object({
  status: z.enum(['pending', 'subscribed', 'unsubscribed']).optional(),
  q: z.string().trim().max(100).optional(),
})

peopleRoutes.get('/subscribers', async (c) => {
  const filters = parse(subscriberQuery, c.req.query())
  const page = parse(pageQuery, c.req.query())
  const result = toPage(await listSubscribers(c.get('db'), filters, page), page)
  return c.json({ ...result, data: result.data.map(toSignup) })
})

peopleRoutes.get('/subscribers/export.csv', async (c) => {
  const db = c.get('db')
  const rows = await listSubscribers(db, { status: 'subscribed' })
  await audit(db, {
    actorId: currentUser(c).id,
    action: 'subscribers.export',
    entity: 'subscriber',
  })
  return c.body(toCsv(rows), 200, {
    'content-type': 'text/csv; charset=utf-8',
    'content-disposition': `attachment; filename="subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
    'cache-control': 'no-store',
  })
})

peopleRoutes.delete('/subscribers/:id', async (c) => {
  const db = c.get('db')
  const row = await unsubscribeById(db, c.req.param('id'))
  await audit(db, {
    actorId: currentUser(c).id,
    action: 'subscriber.unsubscribe',
    entity: 'subscriber',
    entityId: row.id,
  })
  return c.body(null, 204)
})

peopleRoutes.get('/media', async (c) =>
  c.json({ data: await listMedia(c.get('db')) }),
)

peopleRoutes.post('/media', async (c) => {
  const form = await c.req.formData()
  const file = form.get('file')
  if (!(file instanceof File))
    throw new ApiError('VALIDATION', 'Attach a file in the "file" field')
  const alt = String(form.get('alt') ?? '').slice(0, 300)
  const row = await uploadMedia(
    c.get('db'),
    mediaBucket(c.env),
    file,
    alt,
    currentUser(c).id,
  )
  return c.json({ data: row }, 201)
})

peopleRoutes.delete('/media/:id', async (c) => {
  await deleteMedia(c.get('db'), mediaBucket(c.env), c.req.param('id'))
  return c.body(null, 204)
})

peopleRoutes.get('/settings', async (c) =>
  c.json({ data: await getSettings(c.get('db')) }),
)

peopleRoutes.put('/settings', async (c) => {
  const db = c.get('db')
  const patch = parse(settingsPatchSchema, await readJson(c.req.raw))
  const data = await updateSettings(db, patch as never)
  await audit(db, {
    actorId: currentUser(c).id,
    action: 'settings.update',
    entity: 'settings',
    diff: patch,
  })
  return c.json({ data })
})

// Returns the feed URL once; rotating invalidates the previous URL immediately.
peopleRoutes.post('/calendar/token', async (c) => {
  const db = c.get('db')
  const token = await rotateCalendarToken(db)
  await audit(db, {
    actorId: currentUser(c).id,
    action: 'calendar.rotate',
    entity: 'settings',
  })
  const url = `${new URL(c.req.url).origin}/api/v1/calendar.ics?token=${token}`
  return c.json({ data: { url } }, 201)
})

peopleRoutes.get('/audit-log', async (c) => {
  const page = parse(pageQuery, c.req.query())
  const rows = await c
    .get('db')
    .select()
    .from(auditLog)
    .orderBy(desc(auditLog.createdAt))
    .limit(page.limit + 1)
    .offset(page.cursor)
  return c.json(toPage(rows, page))
})
