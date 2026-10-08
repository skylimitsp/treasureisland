import { Hono } from 'hono'
import { waitUntil } from 'cloudflare:workers'
import { z } from 'zod'

import { parse, readJson } from '#/server/lib/validate'
import { audit } from '#/server/lib/audit'
import {
  campaignDraftSchema,
  campaignTestSchema,
} from '#/schemas/campaign.schema'
import { currentUser } from '#/server/middleware/require-role'
import { emailMode } from '#/server/notifications/mailer'
import {
  audienceCount,
  createCampaign,
  deleteCampaign,
  deliver,
  duplicateCampaign,
  getCampaignDetail,
  listCampaigns,
  settleCampaign,
  sendTest,
  startSend,
  toCampaign,
  updateCampaign,
} from '#/server/services/campaigns.service'
import type { AppEnv } from '#/server/env'

// Admin-only (guarded in app.ts). Static paths are registered before `/:id`.
export const campaignRoutes = new Hono<AppEnv>()

campaignRoutes.use('*', async (c, next) => {
  await next()
  c.res.headers.set('cache-control', 'no-store')
})

campaignRoutes.get('/campaigns/email-status', (c) =>
  c.json({ data: { mode: emailMode(c.env) } }),
)

const audienceSchema = z.object({
  audience: z.enum(['all', 'selected']),
  selectedIds: z.array(z.string()).max(5000).default([]),
})

campaignRoutes.post('/campaigns/audience-count', async (c) => {
  const input = parse(audienceSchema, await readJson(c.req.raw))
  return c.json({ data: { count: await audienceCount(c.get('db'), input) } })
})

campaignRoutes.get('/campaigns', async (c) => {
  const rows = await listCampaigns(c.get('db'))
  return c.json({ data: rows.map(toCampaign) })
})

campaignRoutes.post('/campaigns', async (c) => {
  const db = c.get('db')
  const user = currentUser(c)
  const input = parse(campaignDraftSchema, await readJson(c.req.raw))
  const row = await createCampaign(db, input, user.id)
  await audit(db, {
    actorId: user.id,
    action: 'campaign.create',
    entity: 'campaign',
    entityId: row.id,
  })
  return c.json({ data: toCampaign(row) }, 201)
})

campaignRoutes.get('/campaigns/:id', async (c) =>
  c.json({ data: await getCampaignDetail(c.get('db'), c.req.param('id')) }),
)

campaignRoutes.patch('/campaigns/:id', async (c) => {
  const input = parse(campaignDraftSchema, await readJson(c.req.raw))
  const row = await updateCampaign(c.get('db'), c.req.param('id'), input)
  return c.json({ data: toCampaign(row) })
})

campaignRoutes.delete('/campaigns/:id', async (c) => {
  const db = c.get('db')
  await deleteCampaign(db, c.req.param('id'))
  await audit(db, {
    actorId: currentUser(c).id,
    action: 'campaign.delete',
    entity: 'campaign',
    entityId: c.req.param('id'),
  })
  return c.body(null, 204)
})

campaignRoutes.post('/campaigns/:id/duplicate', async (c) => {
  const row = await duplicateCampaign(
    c.get('db'),
    c.req.param('id'),
    currentUser(c).id,
  )
  return c.json({ data: toCampaign(row) }, 201)
})

campaignRoutes.post('/campaigns/:id/test', async (c) => {
  // Body is optional: with no email given, the test goes to the signed-in admin.
  const raw =
    c.req.header('content-length') === '0'
      ? {}
      : await c.req.json().catch(() => ({}))
  const { email } = parse(campaignTestSchema, raw)
  const to = email ?? currentUser(c).email
  return c.json({
    data: await sendTest(c.get('db'), c.env, c.req.param('id'), to),
  })
})

// Responds at once; delivery continues in the background and the page polls progress.
campaignRoutes.post('/campaigns/:id/send', async (c) => {
  const db = c.get('db')
  const user = currentUser(c)
  const { campaign, audience } = await startSend(
    db,
    c.env,
    c.req.param('id'),
    user.id,
  )
  await audit(db, {
    actorId: user.id,
    action: 'campaign.send',
    entity: 'campaign',
    entityId: campaign.id,
    diff: { recipients: audience.length },
  })
  waitUntil(
    deliver(db, c.env, campaign, audience).catch((error: unknown) => {
      console.error('[campaign] delivery crashed', error)
      return settleCampaign(db, campaign.id)
    }),
  )
  return c.json({ data: toCampaign(campaign) }, 202)
})
