import { describe, expect, it } from 'vitest'
import { eq } from 'drizzle-orm'

import { bookings } from '#/server/db/schema'
import {
  call,
  daysAhead,
  db,
  seedRoom,
  signIn,
  uid,
} from '#/server/test/helpers'

const guest = (roomSlug: string, from: number, to: number, extra = {}) => ({
  roomSlug,
  guestName: 'Ama Mensah',
  email: `ama-${uid()}@example.com`,
  checkIn: daysAhead(from),
  checkOut: daysAhead(to),
  guests: 2,
  ...extra,
})

describe('quotes', () => {
  it('prices the stay on the server in major units', async () => {
    const room = await seedRoom({ pricePerNight: 19_500 })
    const res = await call(
      'GET',
      `/rooms/${room.slug}/quote?checkIn=${daysAhead(10)}&checkOut=${daysAhead(13)}&guests=2`,
    )
    expect(res.status).toBe(200)
    expect(res.json.data).toMatchObject({
      nights: 3,
      pricePerNight: 195,
      subtotal: 585,
      taxes: 0,
      total: 585,
      available: true,
      remaining: 1,
    })
  })

  it('applies the tax rate from settings', async () => {
    const room = await seedRoom({ pricePerNight: 10_000 })
    const admin = await signIn('admin')
    await call('PUT', '/admin/settings', {
      cookie: admin.cookie,
      body: { taxRatePercent: 15 },
    })
    const res = await call(
      'GET',
      `/rooms/${room.slug}/quote?checkIn=${daysAhead(5)}&checkOut=${daysAhead(7)}&guests=1`,
    )
    expect(res.json.data).toMatchObject({
      subtotal: 200,
      taxes: 30,
      total: 230,
    })
    await call('PUT', '/admin/settings', {
      cookie: admin.cookie,
      body: { taxRatePercent: 0 },
    })
  })
})

describe('creating bookings', () => {
  it('creates a pending booking with a TI reference', async () => {
    const room = await seedRoom()
    const res = await call('POST', '/bookings', {
      body: guest(room.slug, 20, 22),
    })
    expect(res.status).toBe(201)
    expect(res.json.data.id).toMatch(/^TI-\d{4}-\d{4}$/)
    expect(res.json.data).toMatchObject({
      status: 'pending',
      nights: 2,
      total: 200,
    })
  })

  it('refuses an overlapping stay when the room is full', async () => {
    const room = await seedRoom()
    expect(
      (await call('POST', '/bookings', { body: guest(room.slug, 30, 33) }))
        .status,
    ).toBe(201)
    const clash = await call('POST', '/bookings', {
      body: guest(room.slug, 32, 34),
    })
    expect(clash.status).toBe(409)
    expect(clash.json.error.message).toBe('Fully booked for these dates')
  })

  it('allows back-to-back stays (check-out day is free)', async () => {
    const room = await seedRoom()
    expect(
      (await call('POST', '/bookings', { body: guest(room.slug, 40, 42) }))
        .status,
    ).toBe(201)
    expect(
      (await call('POST', '/bookings', { body: guest(room.slug, 42, 44) }))
        .status,
    ).toBe(201)
  })

  it('respects inventory above one', async () => {
    const room = await seedRoom({ inventory: 2 })
    expect(
      (await call('POST', '/bookings', { body: guest(room.slug, 50, 52) }))
        .status,
    ).toBe(201)
    expect(
      (await call('POST', '/bookings', { body: guest(room.slug, 50, 52) }))
        .status,
    ).toBe(201)
    expect(
      (await call('POST', '/bookings', { body: guest(room.slug, 50, 52) }))
        .status,
    ).toBe(409)
  })

  it('never double-books when two requests race for the last unit', async () => {
    const room = await seedRoom()
    const results = await Promise.all(
      Array.from({ length: 5 }, () =>
        call('POST', '/bookings', { body: guest(room.slug, 60, 62) }),
      ),
    )
    expect(results.filter((r) => r.status === 201)).toHaveLength(1)
    expect(results.filter((r) => r.status === 409)).toHaveLength(4)
  })

  it('replays the first response for a repeated Idempotency-Key', async () => {
    const room = await seedRoom()
    const body = guest(room.slug, 70, 71)
    const headers = { 'idempotency-key': `key-${uid()}` }
    const first = await call('POST', '/bookings', { body, headers })
    const again = await call('POST', '/bookings', { body, headers })
    expect(again.status).toBe(201)
    expect(again.headers.get('idempotent-replay')).toBe('true')
    expect(again.json.data.id).toBe(first.json.data.id)
  })

  it('returns field-level validation errors', async () => {
    const res = await call('POST', '/bookings', {
      body: {
        roomSlug: 'x',
        guestName: 'A',
        email: 'nope',
        checkIn: daysAhead(5),
        checkOut: daysAhead(4),
        guests: 1,
      },
    })
    expect(res.status).toBe(400)
    const paths = res.json.error.details.map((d: { path: string }) => d.path)
    expect(paths).toEqual(
      expect.arrayContaining(['guestName', 'email', 'checkOut']),
    )
  })

  it('enforces max guests, past dates and stay length', async () => {
    const room = await seedRoom({ maxGuests: 2 })
    const tooMany = await call('POST', '/bookings', {
      body: guest(room.slug, 5, 6, { guests: 3 }),
    })
    expect(tooMany.json.error.message).toMatch(/sleeps up to 2/)
    const past = await call('POST', '/bookings', {
      body: guest(room.slug, -2, 1),
    })
    expect(past.json.error.message).toMatch(/past/)
    const long = await call('POST', '/bookings', {
      body: guest(room.slug, 5, 40),
    })
    expect(long.json.error.message).toMatch(/1 to 30 nights/)
  })

  it('treats a stale pending hold as released', async () => {
    const room = await seedRoom()
    const res = await call('POST', '/bookings', {
      body: guest(room.slug, 80, 82),
    })
    // Age the pending booking past the 48h hold window.
    await db
      .update(bookings)
      .set({ createdAt: new Date(Date.now() - 49 * 3_600_000).toISOString() })
      .where(eq(bookings.id, res.json.data.id))
    expect(
      (await call('POST', '/bookings', { body: guest(room.slug, 80, 82) }))
        .status,
    ).toBe(201)
  })
})

describe('closures', () => {
  it('blocks closed rooms without leaking the staff note', async () => {
    const room = await seedRoom()
    const staff = await signIn('concierge')
    await call('PATCH', `/admin/availability/${room.id}`, {
      cookie: staff.cookie,
      body: { open: false, blockedNote: 'Repainting' },
    })
    const res = await call('POST', '/bookings', {
      body: guest(room.slug, 5, 6),
    })
    expect(res.status).toBe(409)
    expect(res.json.error.message).toBe('Not available for these dates')
    expect(res.text).not.toContain('Repainting')
  })

  it('blocks a date range and frees it when the block is removed', async () => {
    const room = await seedRoom()
    const staff = await signIn('concierge')
    const block = await call('POST', '/admin/room-blocks', {
      cookie: staff.cookie,
      body: {
        roomId: room.id,
        from: daysAhead(90),
        to: daysAhead(93),
        note: 'Private hire',
      },
    })
    expect(block.status).toBe(201)
    expect(
      (await call('POST', '/bookings', { body: guest(room.slug, 91, 92) }))
        .status,
    ).toBe(409)
    await call('DELETE', `/admin/room-blocks/${block.json.data.id}`, {
      cookie: staff.cookie,
    })
    expect(
      (await call('POST', '/bookings', { body: guest(room.slug, 91, 92) }))
        .status,
    ).toBe(201)
  })
})

describe('booking workflow (staff)', () => {
  it('moves through confirmed → checked in → checked out with history', async () => {
    const room = await seedRoom()
    const staff = await signIn('concierge')
    const { json } = await call('POST', '/bookings', {
      body: guest(room.slug, 3, 5),
    })
    const id = json.data.id
    for (const status of ['confirmed', 'checked_in', 'checked_out']) {
      const res = await call('POST', `/admin/bookings/${id}/status`, {
        cookie: staff.cookie,
        body: { status },
      })
      expect(res.status).toBe(200)
      expect(res.json.data.status).toBe(status)
    }
    const detail = await call('GET', `/admin/bookings/${id}`, {
      cookie: staff.cookie,
    })
    expect(
      detail.json.data.history.map((h: { toStatus: string }) => h.toStatus),
    ).toEqual(['pending', 'confirmed', 'checked_in', 'checked_out'])
  })

  it('rejects transitions that skip or reverse steps', async () => {
    const room = await seedRoom()
    const staff = await signIn('concierge')
    const { json } = await call('POST', '/bookings', {
      body: guest(room.slug, 6, 7),
    })
    const skip = await call('POST', `/admin/bookings/${json.data.id}/status`, {
      cookie: staff.cookie,
      body: { status: 'checked_out' },
    })
    expect(skip.status).toBe(409)
  })

  it('frees inventory when a booking is cancelled', async () => {
    const room = await seedRoom()
    const staff = await signIn('concierge')
    const { json } = await call('POST', '/bookings', {
      body: guest(room.slug, 100, 102),
    })
    await call('POST', `/admin/bookings/${json.data.id}/status`, {
      cookie: staff.cookie,
      body: { status: 'cancelled' },
    })
    expect(
      (await call('POST', '/bookings', { body: guest(room.slug, 100, 102) }))
        .status,
    ).toBe(201)
  })

  it('re-prices date changes and refuses ones that clash', async () => {
    const room = await seedRoom({ inventory: 1 })
    const staff = await signIn('concierge')
    const a = await call('POST', '/bookings', {
      body: guest(room.slug, 110, 112),
    })
    await call('POST', '/bookings', { body: guest(room.slug, 120, 122) })
    const moved = await call('PATCH', `/admin/bookings/${a.json.data.id}`, {
      cookie: staff.cookie,
      body: { checkOut: daysAhead(114) },
    })
    expect(moved.json.data).toMatchObject({ nights: 4, total: 400 })
    const clash = await call('PATCH', `/admin/bookings/${a.json.data.id}`, {
      cookie: staff.cookie,
      body: { checkIn: daysAhead(119), checkOut: daysAhead(121) },
    })
    expect(clash.status).toBe(409)
  })

  it('lets staff take phone bookings, confirmed by default', async () => {
    const room = await seedRoom()
    const staff = await signIn('concierge')
    const res = await call('POST', '/admin/bookings', {
      cookie: staff.cookie,
      body: { ...guest(room.slug, 130, 131), source: 'phone' },
    })
    expect(res.status).toBe(201)
    expect(res.json.data).toMatchObject({
      status: 'confirmed',
      source: 'phone',
    })
  })
})
