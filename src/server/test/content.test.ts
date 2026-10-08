import { describe, expect, it } from 'vitest'
import { eq } from 'drizzle-orm'

import { newsletterSubscribers } from '#/server/db/schema'
import {
  call,
  daysAhead,
  db,
  seedAmenity,
  seedRoom,
  signIn,
  uid,
} from '#/server/test/helpers'

describe('settings and feature flags', () => {
  it('hides the menu until the flag is switched on', async () => {
    const admin = await signIn('admin')
    expect((await call('GET', '/menu')).status).toBe(404)
    await call('PUT', '/admin/settings', {
      cookie: admin.cookie,
      body: { features: { menu: true } },
    })
    expect((await call('GET', '/menu')).status).toBe(200)
    await call('PUT', '/admin/settings', {
      cookie: admin.cookie,
      body: { features: { menu: false } },
    })
  })

  it('never exposes internal settings like the calendar token', async () => {
    const admin = await signIn('admin')
    await call('POST', '/admin/calendar/token', { cookie: admin.cookie })
    const settings = await call('GET', '/admin/settings', {
      cookie: admin.cookie,
    })
    expect(settings.text).not.toContain('calendarTokenHash')
    const site = await call('GET', '/site')
    expect(Object.keys(site.json.data).sort()).toEqual([
      'contact',
      'currency',
      'features',
      'socials',
    ])
  })
})

describe('event types', () => {
  it('creates, edits packages and deletes an event type', async () => {
    const admin = await signIn('admin')
    const slug = `retreat-${uid()}`
    const created = await call('POST', '/admin/events/types', {
      cookie: admin.cookie,
      body: {
        slug,
        category: 'meetings',
        name: 'Retreats',
        title: 'Corporate Retreats',
        blurb: 'Off-sites on the island',
        description: ['Plan your team retreat.'],
        fromPrice: 1500,
      },
    })
    expect(created.status).toBe(201)
    expect(created.json.data.fromPrice).toBe(1500)

    const patched = await call('PATCH', `/admin/events/types/${slug}`, {
      cookie: admin.cookie,
      body: {
        packages: [
          {
            slug: 'day',
            name: 'Day pass',
            blurb: 'Meeting room + lunch',
            fromPrice: 40,
          },
        ],
      },
    })
    expect(patched.json.data.packages).toEqual([
      expect.objectContaining({ slug: 'day', fromPrice: 40 }),
    ])

    const publicList = await call('GET', '/events/types')
    expect(publicList.json.data.map((t: { slug: string }) => t.slug)).toContain(
      slug,
    )
    expect(
      (
        await call('DELETE', `/admin/events/types/${slug}`, {
          cookie: admin.cookie,
        })
      ).status,
    ).toBe(204)
    const after = await call('GET', '/events/types')
    expect(after.json.data.map((t: { slug: string }) => t.slug)).not.toContain(
      slug,
    )
  })
})

describe('amenities', () => {
  it('creates an amenity and archives it from the public list', async () => {
    const admin = await signIn('admin')
    const slug = `kayak-${uid()}`
    const created = await call('POST', '/admin/amenities', {
      cookie: admin.cookie,
      body: {
        slug,
        name: 'Kayaking',
        category: 'On the water',
        blurb: 'Paddle the estuary',
        description: 'Guided kayak trips.',
        image: '/k.webp',
        hero: '/k.webp',
        icon: 'sailboat',
        bookable: true,
      },
    })
    expect(created.status).toBe(201)
    expect((await call('GET', `/amenities/${slug}`)).status).toBe(200)
    await call('DELETE', `/admin/amenities/${created.json.data.id}`, {
      cookie: admin.cookie,
    })
    expect((await call('GET', `/amenities/${slug}`)).status).toBe(404)
  })

  it('rejects a duplicate slug', async () => {
    const admin = await signIn('admin')
    const existing = await seedAmenity()
    const res = await call('POST', '/admin/amenities', {
      cookie: admin.cookie,
      body: {
        slug: existing.slug,
        name: 'Dup',
        category: 'x',
        blurb: '',
        description: '',
        image: '/x.webp',
        hero: '/x.webp',
        icon: 'ship',
      },
    })
    expect(res.status).toBe(409)
  })
})

describe('reviews and FAQs', () => {
  it('shows only featured reviews as testimonials', async () => {
    const admin = await signIn('admin')
    const review = await call('POST', '/admin/reviews', {
      cookie: admin.cookie,
      body: { quote: 'Wonderful stay', name: 'Abena', origin: 'Guest' },
    })
    const id = review.json.data.id
    const ids = async () =>
      (await call('GET', '/content/testimonials')).json.data.map(
        (t: { id: string }) => t.id,
      )
    expect(await ids()).not.toContain(id)
    await call('PATCH', `/admin/reviews/${id}`, {
      cookie: admin.cookie,
      body: { featured: true },
    })
    expect(await ids()).toContain(id)
  })

  it('reorders FAQs', async () => {
    const admin = await signIn('admin')
    const a = await call('POST', '/admin/faqs', {
      cookie: admin.cookie,
      body: { q: `A ${uid()}?`, a: 'Answer A' },
    })
    const b = await call('POST', '/admin/faqs', {
      cookie: admin.cookie,
      body: { q: `B ${uid()}?`, a: 'Answer B' },
    })
    const res = await call('POST', '/admin/faqs/reorder', {
      cookie: admin.cookie,
      body: { ids: [b.json.data.id, a.json.data.id] },
    })
    const order = res.json.data.map((f: { id: string }) => f.id)
    expect(order.indexOf(b.json.data.id)).toBeLessThan(
      order.indexOf(a.json.data.id),
    )
  })
})

describe('newsletter', () => {
  it('runs double opt-in and token unsubscribe', async () => {
    const email = `reader-${uid()}@example.com`
    expect(
      (await call('POST', '/newsletter', { body: { email, source: 'footer' } }))
        .status,
    ).toBe(202)
    const row = await db.query.newsletterSubscribers.findFirst({
      where: eq(newsletterSubscribers.email, email),
    })
    expect(row?.status).toBe('pending')

    const confirm = await call(
      'GET',
      `/newsletter/confirm?token=${row?.confirmToken}`,
    )
    expect(confirm.status).toBe(303)
    const again = await call(
      'GET',
      `/newsletter/confirm?token=${row?.confirmToken}`,
    )
    expect(again.status).toBe(404)

    await call('POST', `/newsletter/unsubscribe?token=${row?.unsubscribeToken}`)
    const after = await db.query.newsletterSubscribers.findFirst({
      where: eq(newsletterSubscribers.email, email),
    })
    expect(after?.status).toBe('unsubscribed')
  })

  it('exports CSV with spreadsheet formulas neutralised', async () => {
    const admin = await signIn('admin')
    await db.insert(newsletterSubscribers).values({
      email: `=cmd()-${uid()}@example.com`,
      source: 'footer',
      status: 'subscribed',
      unsubscribeToken: uid(),
    })
    const csv = await call('GET', '/admin/subscribers/export.csv', {
      cookie: admin.cookie,
    })
    expect(csv.headers.get('content-type')).toMatch(/text\/csv/)
    expect(csv.text).toMatch(/"'=cmd\(\)/)
  })
})

describe('calendar feed', () => {
  it('serves bookings to a valid token and rejects rotated ones', async () => {
    const admin = await signIn('admin')
    const room = await seedRoom({ name: 'Calendar, Suite; Test' })
    const booking = await call('POST', '/bookings', {
      body: {
        roomSlug: room.slug,
        guestName: 'Esi Owusu',
        email: `esi-${uid()}@example.com`,
        phone: '+233 20 000 0000',
        checkIn: daysAhead(15),
        checkOut: daysAhead(17),
        guests: 1,
      },
    })
    const first = await call('POST', '/admin/calendar/token', {
      cookie: admin.cookie,
    })
    const firstPath =
      new URL(first.json.data.url).pathname.replace('/api/v1', '') +
      new URL(first.json.data.url).search

    const feed = await call('GET', firstPath)
    expect(feed.status).toBe(200)
    expect(feed.headers.get('content-type')).toMatch(/text\/calendar/)
    expect(feed.text).toContain(`UID:${booking.json.data.id}@`)
    expect(feed.text).toContain('Calendar\\, Suite\\; Test')
    expect(feed.text).toContain(
      `DTSTART;VALUE=DATE:${daysAhead(15).replace(/-/g, '')}`,
    )
    expect(
      feed.text
        .split('\r\n')
        .every((l) => new TextEncoder().encode(l).length <= 75),
    ).toBe(true)

    await call('POST', '/admin/calendar/token', { cookie: admin.cookie })
    expect((await call('GET', firstPath)).status).toBe(404)
    expect(
      (await call('GET', '/calendar.ics?token=wrong-token-value')).status,
    ).toBe(404)
  })
})

describe('audit log', () => {
  it('records admin changes', async () => {
    const admin = await signIn('admin')
    const room = await seedRoom()
    await call('PATCH', `/admin/rooms/${room.id}`, {
      cookie: admin.cookie,
      body: { pricePerNight: 120 },
    })
    const log = await call('GET', '/admin/audit-log?limit=100', {
      cookie: admin.cookie,
    })
    expect(log.json.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ action: 'room.update', entityId: room.id }),
      ]),
    )
  })
})

describe('manually added reviews', () => {
  it('lets admins add a rated review that shows on the site when featured', async () => {
    const admin = await signIn('admin')
    const res = await call('POST', '/admin/reviews', {
      cookie: admin.cookie,
      body: {
        name: 'Kojo Asare',
        origin: 'Google review',
        quote: 'Lovely staff and views.',
        rating: 5,
        featured: true,
      },
    })
    expect(res.status).toBe(201)
    expect(res.json.data).toMatchObject({
      name: 'Kojo Asare',
      rating: 5,
      featured: true,
    })
    const site = await call('GET', '/content/testimonials')
    expect(site.json.data.map((t: { id: string }) => t.id)).toContain(
      res.json.data.id,
    )
  })

  it('rejects a review without a name or text, field by field', async () => {
    const admin = await signIn('admin')
    const res = await call('POST', '/admin/reviews', {
      cookie: admin.cookie,
      body: { name: '', quote: '', rating: 7 },
    })
    expect(res.status).toBe(400)
    const paths = res.json.error.details.map((d: { path: string }) => d.path)
    expect(paths).toEqual(expect.arrayContaining(['name', 'quote', 'rating']))
  })

  it('deletes a review from the dashboard and the site', async () => {
    const admin = await signIn('admin')
    const { json } = await call('POST', '/admin/reviews', {
      cookie: admin.cookie,
      body: { name: 'Delete Me', quote: 'Temporary review', featured: true },
    })
    expect(
      (
        await call('DELETE', `/admin/reviews/${json.data.id}`, {
          cookie: admin.cookie,
        })
      ).status,
    ).toBe(204)
    const site = await call('GET', '/content/testimonials')
    expect(site.json.data.map((t: { id: string }) => t.id)).not.toContain(
      json.data.id,
    )
    expect(
      (
        await call('DELETE', `/admin/reviews/${json.data.id}`, {
          cookie: admin.cookie,
        })
      ).status,
    ).toBe(404)
  })

  it('keeps adding and deleting admin-only', async () => {
    const concierge = await signIn('concierge')
    const add = await call('POST', '/admin/reviews', {
      cookie: concierge.cookie,
      body: { name: 'Not Allowed', quote: 'Nope' },
    })
    expect(add.status).toBe(403)
    expect(
      (await call('GET', '/admin/reviews', { cookie: concierge.cookie }))
        .status,
    ).toBe(200)
  })
})
