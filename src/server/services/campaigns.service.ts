/**
 * Email campaigns: drafts, audience resolution, test sends and batched delivery.
 * @author Joseph Nartey
 * @github devjoemedia
 */
import { and, desc, eq, inArray, sql } from 'drizzle-orm'

import {
  campaignRecipients,
  campaigns,
  newsletterSubscribers,
  users,
} from '#/server/db/schema'
import { ApiError, notFound } from '#/server/lib/errors'
import { first } from '#/server/lib/rows'
import { campaignEmail } from '#/server/notifications/campaign-email'
import { emailMode, sendBatch } from '#/server/notifications/mailer'
import type { Database } from '#/server/db/client'
import type { Bindings } from '#/server/env'
import type { CampaignDraftBody } from '#/schemas/campaign.schema'

type CampaignRow = typeof campaigns.$inferSelect

const BATCH = 100 // Resend batch limit
const PARAM_CHUNK = 90 // stays under D1's 100 bound-parameter limit

const chunk = <T>(items: Array<T>, size: number) =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, i) =>
    items.slice(i * size, i * size + size),
  )

export function toCampaign(c: CampaignRow) {
  return {
    id: c.id,
    subject: c.subject,
    preheader: c.preheader,
    body: c.body,
    ctaLabel: c.ctaLabel,
    ctaUrl: c.ctaUrl,
    audience: c.audience,
    selectedIds: c.selectedIds,
    status: c.status,
    recipientCount: c.recipientCount,
    sentCount: c.sentCount,
    failedCount: c.failedCount,
    sentAt: c.sentAt,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  }
}

export async function listCampaigns(db: Database) {
  return db.select().from(campaigns).orderBy(desc(campaigns.createdAt))
}

export async function getCampaign(db: Database, id: string) {
  const row = await db.query.campaigns.findFirst({
    where: eq(campaigns.id, id),
  })
  if (!row) throw notFound('Campaign')
  return row
}

export async function getCampaignDetail(db: Database, id: string) {
  const campaign = await getCampaign(db, id)
  const recipients = await db
    .select()
    .from(campaignRecipients)
    .where(eq(campaignRecipients.campaignId, id))
    .orderBy(campaignRecipients.email)
  const sentBy = campaign.sentBy
    ? await db.query.users.findFirst({ where: eq(users.id, campaign.sentBy) })
    : null
  return {
    ...toCampaign(campaign),
    sentByName: sentBy?.name ?? null,
    recipients,
  }
}

export async function createCampaign(
  db: Database,
  input: CampaignDraftBody,
  by: string,
) {
  const [row] = await db
    .insert(campaigns)
    .values({ subject: '', ...input, createdBy: by })
    .returning()
  return row
}

export async function updateCampaign(
  db: Database,
  id: string,
  input: CampaignDraftBody,
) {
  const row = first(
    await db
      .update(campaigns)
      .set(input)
      .where(and(eq(campaigns.id, id), eq(campaigns.status, 'draft')))
      .returning(),
  )
  if (!row) {
    await getCampaign(db, id)
    throw new ApiError(
      'CONFLICT',
      'Only drafts can be edited; duplicate it to make changes',
    )
  }
  return row
}

export async function deleteCampaign(db: Database, id: string) {
  const campaign = await getCampaign(db, id)
  if (campaign.status === 'sending') {
    throw new ApiError('CONFLICT', 'Wait for this campaign to finish sending')
  }
  await db.delete(campaigns).where(eq(campaigns.id, id))
}

export async function duplicateCampaign(db: Database, id: string, by: string) {
  const c = await getCampaign(db, id)
  return createCampaign(
    db,
    {
      subject: `${c.subject} (copy)`.trim(),
      preheader: c.preheader,
      body: c.body,
      ctaLabel: c.ctaLabel,
      ctaUrl: c.ctaUrl,
      audience: c.audience,
      selectedIds: c.selectedIds,
    },
    by,
  )
}

// Only confirmed subscribers ever receive campaigns, whatever was selected.
export async function resolveAudience(db: Database, c: CampaignRow) {
  if (c.audience === 'selected' && c.selectedIds.length === 0) return []
  const subscribed = eq(newsletterSubscribers.status, 'subscribed')
  if (c.audience === 'all') {
    return db.select().from(newsletterSubscribers).where(subscribed)
  }
  const rows = await Promise.all(
    chunk(c.selectedIds, PARAM_CHUNK).map((ids) =>
      db
        .select()
        .from(newsletterSubscribers)
        .where(and(subscribed, inArray(newsletterSubscribers.id, ids))),
    ),
  )
  return rows.flat()
}

function sendableProblem(c: CampaignRow): string | null {
  if (!c.subject.trim()) return 'Add a subject before sending'
  if (!c.body.trim()) return 'Add a message before sending'
  if (Boolean(c.ctaLabel) !== Boolean(c.ctaUrl)) {
    return 'The button needs both a label and a link (or neither)'
  }
  return null
}

function requireEmail(env: Bindings) {
  if (emailMode(env) === 'off') {
    throw new ApiError(
      'CONFLICT',
      "Email sending isn't set up yet. Add the RESEND_API_KEY secret to the Worker first.",
    )
  }
}

const unsubscribeUrl = (env: Bindings, token: string) =>
  `${env.APP_URL}/api/v1/newsletter/unsubscribe?token=${token}`

export async function sendTest(
  db: Database,
  env: Bindings,
  id: string,
  to: string,
) {
  requireEmail(env)
  const c = await getCampaign(db, id)
  const problem = sendableProblem(c)
  if (problem) throw new ApiError('VALIDATION', problem)
  const email = campaignEmail(
    { ...c, subject: `[Test] ${c.subject}` },
    to,
    `${env.APP_URL}/?newsletter=test-unsubscribe`,
    env.APP_URL,
  )
  const result = await sendBatch(env, [email])
  if (!result.ok)
    throw new ApiError('INTERNAL', result.error ?? 'Test email failed')
  return { to }
}

// Claims the draft atomically and snapshots recipients; delivery runs in `deliver`.
export async function startSend(
  db: Database,
  env: Bindings,
  id: string,
  by: string,
) {
  requireEmail(env)
  const c = await getCampaign(db, id)
  if (c.status !== 'draft')
    throw new ApiError('CONFLICT', 'This campaign was already sent')
  const problem = sendableProblem(c)
  if (problem) throw new ApiError('VALIDATION', problem)
  const audience = await resolveAudience(db, c)
  if (audience.length === 0) {
    throw new ApiError(
      'VALIDATION',
      'No confirmed subscribers match this audience',
    )
  }

  const claimed = first(
    await db
      .update(campaigns)
      .set({
        status: 'sending',
        recipientCount: audience.length,
        sentCount: 0,
        failedCount: 0,
        sentBy: by,
        sentAt: new Date().toISOString(),
      })
      .where(and(eq(campaigns.id, id), eq(campaigns.status, 'draft')))
      .returning(),
  )
  if (!claimed)
    throw new ApiError('CONFLICT', 'This campaign is already being sent')

  // 5 columns per row → 18 rows per insert keeps each statement under 100 params.
  const inserts = chunk(audience, 18).map((rows) =>
    db.insert(campaignRecipients).values(
      rows.map((s) => ({
        campaignId: id,
        subscriberId: s.id,
        email: s.email,
        status: 'queued' as const,
      })),
    ),
  )
  for (const group of chunk(inserts, 50)) {
    await db.batch(group as [never, ...Array<never>])
  }
  return { campaign: claimed, audience }
}

export async function deliver(
  db: Database,
  env: Bindings,
  campaign: CampaignRow,
  audience: Array<typeof newsletterSubscribers.$inferSelect>,
) {
  let sent = 0
  let failed = 0
  for (const group of chunk(audience, BATCH)) {
    const result = await sendBatch(
      env,
      group.map((s) =>
        campaignEmail(
          campaign,
          s.email,
          unsubscribeUrl(env, s.unsubscribeToken),
          env.APP_URL,
        ),
      ),
    )
    const now = new Date().toISOString()
    const ids = group.map((s) => s.id)
    if (result.ok) sent += group.length
    else failed += group.length
    await db.batch([
      ...chunk(ids, PARAM_CHUNK).map((part) =>
        db
          .update(campaignRecipients)
          .set(
            result.ok
              ? { status: 'sent', sentAt: now, error: null }
              : { status: 'failed', error: result.error ?? 'Failed' },
          )
          .where(
            and(
              eq(campaignRecipients.campaignId, campaign.id),
              inArray(campaignRecipients.subscriberId, part),
            ),
          ),
      ),
      db
        .update(campaigns)
        .set({ sentCount: sent, failedCount: failed })
        .where(eq(campaigns.id, campaign.id)),
    ] as unknown as [never, ...Array<never>])
  }
  await db
    .update(campaigns)
    .set({ status: sent === 0 ? 'failed' : 'sent' })
    .where(eq(campaigns.id, campaign.id))
}

// If delivery crashes mid-way, close the campaign out so it never stays "sending".
export async function settleCampaign(db: Database, id: string) {
  const current = await getCampaign(db, id)
  if (current.status !== 'sending') return
  await db
    .update(campaigns)
    .set({ status: current.sentCount ? 'sent' : 'failed' })
    .where(eq(campaigns.id, id))
}

export async function audienceCount(
  db: Database,
  input: { audience: 'all' | 'selected'; selectedIds: Array<string> },
) {
  if (input.audience === 'all') {
    const [{ n }] = await db
      .select({ n: sql<number>`count(*)` })
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.status, 'subscribed'))
    return n
  }
  return (await resolveAudience(db, { ...input } as CampaignRow)).length
}
