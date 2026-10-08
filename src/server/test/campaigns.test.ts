import { describe, expect, it } from 'vitest'

import { newsletterSubscribers } from '#/server/db/schema'
import { campaignBodyHtml } from '#/lib/campaign-format'
import { campaignEmail } from '#/server/notifications/campaign-email'
import { emailMode } from '#/server/notifications/mailer'
import { call, db, signIn, uid } from '#/server/test/helpers'
import type { Bindings } from '#/server/env'

async function subscriber(status: 'pending' | 'subscribed' | 'unsubscribed') {
  const [row] = await db
    .insert(newsletterSubscribers)
    .values({
      email: `${status}-${uid()}@example.com`,
      source: 'footer',
      status,
      unsubscribeToken: uid() + uid(),
    })
    .returning()
  return row
}

const ready = {
  subject: 'Easter at the island',
  body: 'Book **now** and save.\n\nSee https://example.com/easter',
  preheader: 'Our Easter offer',
}

async function waitForSend(cookie: string, id: string) {
  for (let i = 0; i < 50; i++) {
    const res = await call('GET', `/admin/campaigns/${id}`, { cookie })
    if (res.json.data.status !== 'sending') return res.json.data
    await new Promise((r) => setTimeout(r, 20))
  }
  throw new Error('campaign still sending')
}

describe('campaign drafts', () => {
  it('creates, edits and lists drafts', async () => {
    const admin = await signIn('admin')
    const created = await call('POST', '/admin/campaigns', {
      cookie: admin.cookie,
      body: { subject: 'Draft one' },
    })
    expect(created.status).toBe(201)
    expect(created.json.data.status).toBe('draft')
    const id = created.json.data.id
    const edited = await call('PATCH', `/admin/campaigns/${id}`, {
      cookie: admin.cookie,
      body: { body: 'Hello', ctaLabel: 'Book', ctaUrl: 'https://example.com' },
    })
    expect(edited.json.data).toMatchObject({ body: 'Hello', ctaLabel: 'Book' })
    const list = await call('GET', '/admin/campaigns', { cookie: admin.cookie })
    expect(list.json.data.map((c: { id: string }) => c.id)).toContain(id)
  })

  it('rejects unsafe button links', async () => {
    const admin = await signIn('admin')
    const res = await call('POST', '/admin/campaigns', {
      cookie: admin.cookie,
      body: { ctaUrl: 'javascript:alert(1)' },
    })
    expect(res.status).toBe(400)
  })

  it('will not send an incomplete campaign', async () => {
    const admin = await signIn('admin')
    await subscriber('subscribed')
    const { json } = await call('POST', '/admin/campaigns', {
      cookie: admin.cookie,
      body: { subject: 'No body yet' },
    })
    const res = await call('POST', `/admin/campaigns/${json.data.id}/send`, {
      cookie: admin.cookie,
    })
    expect(res.status).toBe(400)
    expect(res.json.error.message).toBe('Add a message before sending')
  })
})

describe('sending', () => {
  it('sends only to confirmed subscribers among those selected', async () => {
    const admin = await signIn('admin')
    const [yes1, yes2, pending, gone] = await Promise.all([
      subscriber('subscribed'),
      subscriber('subscribed'),
      subscriber('pending'),
      subscriber('unsubscribed'),
    ])
    const { json } = await call('POST', '/admin/campaigns', {
      cookie: admin.cookie,
      body: {
        ...ready,
        audience: 'selected',
        selectedIds: [yes1.id, yes2.id, pending.id, gone.id],
      },
    })
    const count = await call('POST', '/admin/campaigns/audience-count', {
      cookie: admin.cookie,
      body: {
        audience: 'selected',
        selectedIds: [yes1.id, yes2.id, pending.id, gone.id],
      },
    })
    expect(count.json.data.count).toBe(2)

    const sent = await call('POST', `/admin/campaigns/${json.data.id}/send`, {
      cookie: admin.cookie,
    })
    expect(sent.status).toBe(202)
    const done = await waitForSend(admin.cookie, json.data.id)
    expect(done).toMatchObject({
      status: 'sent',
      recipientCount: 2,
      sentCount: 2,
      failedCount: 0,
    })
    expect(
      done.recipients.map((r: { email: string }) => r.email).sort(),
    ).toEqual([yes1.email, yes2.email].sort())
    expect(
      done.recipients.every((r: { status: string }) => r.status === 'sent'),
    ).toBe(true)
  })

  it('sends to every confirmed subscriber with audience "all"', async () => {
    const admin = await signIn('admin')
    const confirmed = await subscriber('subscribed')
    const pending = await subscriber('pending')
    const { json } = await call('POST', '/admin/campaigns', {
      cookie: admin.cookie,
      body: { ...ready, audience: 'all' },
    })
    await call('POST', `/admin/campaigns/${json.data.id}/send`, {
      cookie: admin.cookie,
    })
    const done = await waitForSend(admin.cookie, json.data.id)
    const emails = done.recipients.map((r: { email: string }) => r.email)
    expect(emails).toContain(confirmed.email)
    expect(emails).not.toContain(pending.email)
  })

  it('locks a campaign once sent: no edits, no second send, but it can be duplicated', async () => {
    const admin = await signIn('admin')
    const s = await subscriber('subscribed')
    const { json } = await call('POST', '/admin/campaigns', {
      cookie: admin.cookie,
      body: { ...ready, audience: 'selected', selectedIds: [s.id] },
    })
    const id = json.data.id
    await call('POST', `/admin/campaigns/${id}/send`, { cookie: admin.cookie })
    await waitForSend(admin.cookie, id)
    expect(
      (
        await call('PATCH', `/admin/campaigns/${id}`, {
          cookie: admin.cookie,
          body: { subject: 'x' },
        })
      ).status,
    ).toBe(409)
    expect(
      (
        await call('POST', `/admin/campaigns/${id}/send`, {
          cookie: admin.cookie,
        })
      ).status,
    ).toBe(409)
    const copy = await call('POST', `/admin/campaigns/${id}/duplicate`, {
      cookie: admin.cookie,
    })
    expect(copy.json.data).toMatchObject({
      status: 'draft',
      subject: `${ready.subject} (copy)`,
      selectedIds: [s.id],
    })
    expect(
      (await call('DELETE', `/admin/campaigns/${id}`, { cookie: admin.cookie }))
        .status,
    ).toBe(204)
  })

  it('sends a test to the signed-in admin without touching the draft', async () => {
    const admin = await signIn('admin')
    const { json } = await call('POST', '/admin/campaigns', {
      cookie: admin.cookie,
      body: ready,
    })
    const res = await call('POST', `/admin/campaigns/${json.data.id}/test`, {
      cookie: admin.cookie,
    })
    expect(res.json.data.to).toBe(admin.email)
    const after = await call('GET', `/admin/campaigns/${json.data.id}`, {
      cookie: admin.cookie,
    })
    expect(after.json.data.status).toBe('draft')
  })

  it('keeps campaigns admin-only', async () => {
    const concierge = await signIn('concierge')
    expect(
      (await call('GET', '/admin/campaigns', { cookie: concierge.cookie }))
        .status,
    ).toBe(403)
  })
})

describe('campaign email content', () => {
  it('escapes typed HTML and only links http(s) addresses', () => {
    const html = campaignBodyHtml(
      '<script>x</script> [click](javascript:alert(1)) **hi**',
    )
    expect(html).not.toContain('<script>')
    expect(html).not.toContain('href="javascript')
    expect(html).toContain('<strong>hi</strong>')
  })

  it('includes a personal unsubscribe link and one-click headers', () => {
    const email = campaignEmail(
      { subject: 'S', preheader: '', body: 'B', ctaLabel: null, ctaUrl: null },
      'a@example.com',
      'https://site.test/api/v1/newsletter/unsubscribe?token=abc',
      'https://site.test',
    )
    expect(email.html).toContain('unsubscribe?token=abc')
    expect(email.headers).toMatchObject({
      'List-Unsubscribe':
        '<https://site.test/api/v1/newsletter/unsubscribe?token=abc>',
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    })
  })

  it('refuses to pretend-send in production without an email key', () => {
    expect(
      emailMode({ APP_URL: 'https://treasureislandghana.com' } as Bindings),
    ).toBe('off')
    expect(emailMode({ APP_URL: 'http://localhost:3000' } as Bindings)).toBe(
      'simulated',
    )
    expect(
      emailMode({ APP_URL: 'https://x', RESEND_API_KEY: 're_1' } as Bindings),
    ).toBe('live')
  })
})
