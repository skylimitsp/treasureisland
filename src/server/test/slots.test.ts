import { describe, expect, it } from 'vitest'

import {
  call,
  daysAhead,
  seedAmenity,
  signIn,
  uid,
} from '#/server/test/helpers'

const request = (slug: string, date: string, slot: string, partySize = 2) => ({
  slug,
  date,
  slot,
  partySize,
  name: 'Kwame Asante',
  email: `kwame-${uid()}@example.com`,
})

async function withSlots(
  capacity = 6,
  daysOfWeek: Array<number> | null = null,
) {
  const amenity = await seedAmenity()
  const admin = await signIn('admin')
  const res = await call('POST', `/admin/amenities/${amenity.id}/slots`, {
    cookie: admin.cookie,
    body: { label: '10:00', capacity, daysOfWeek },
  })
  expect(res.status).toBe(201)
  return { amenity, admin }
}

describe('slot requests', () => {
  it('accepts free-text slots when no times are defined', async () => {
    const amenity = await seedAmenity()
    const res = await call('POST', '/slot-requests', {
      body: request(amenity.slug, daysAhead(3), 'Afternoon'),
    })
    expect(res.status).toBe(201)
    expect(res.json.data.id).toMatch(/^SLT-\d{4}-\d{4}$/)
  })

  it('refuses amenities that are not bookable online', async () => {
    const amenity = await seedAmenity({ bookable: false })
    const res = await call('POST', '/slot-requests', {
      body: request(amenity.slug, daysAhead(3), '10:00'),
    })
    expect(res.status).toBe(400)
  })

  it('lists defined times with remaining capacity', async () => {
    const { amenity } = await withSlots(6)
    const date = daysAhead(5)
    await call('POST', '/slot-requests', {
      body: request(amenity.slug, date, '10:00', 4),
    })
    const res = await call(
      'GET',
      `/amenities/${amenity.slug}/slots?date=${date}`,
    )
    expect(res.json.data.slots).toEqual([
      expect.objectContaining({
        label: '10:00',
        capacity: 6,
        remaining: 2,
        available: true,
      }),
    ])
  })

  it('rejects times that are not offered', async () => {
    const { amenity } = await withSlots()
    const res = await call('POST', '/slot-requests', {
      body: request(amenity.slug, daysAhead(5), '15:00'),
    })
    expect(res.status).toBe(400)
  })

  it('refuses a party bigger than the places left', async () => {
    const { amenity } = await withSlots(6)
    const date = daysAhead(6)
    expect(
      (
        await call('POST', '/slot-requests', {
          body: request(amenity.slug, date, '10:00', 5),
        })
      ).status,
    ).toBe(201)
    const over = await call('POST', '/slot-requests', {
      body: request(amenity.slug, date, '10:00', 2),
    })
    expect(over.status).toBe(409)
    expect(over.json.error.message).toBe('Only 1 places left at 10:00')
  })

  it('never overfills a slot under concurrent requests', async () => {
    const { amenity } = await withSlots(4)
    const date = daysAhead(7)
    const results = await Promise.all(
      Array.from({ length: 4 }, () =>
        call('POST', '/slot-requests', {
          body: request(amenity.slug, date, '10:00', 2),
        }),
      ),
    )
    expect(results.filter((r) => r.status === 201)).toHaveLength(2)
  })

  it('only offers times on their configured weekdays', async () => {
    const date = daysAhead(8)
    const weekday = new Date(`${date}T00:00:00Z`).getUTCDay()
    const { amenity } = await withSlots(6, [(weekday + 1) % 7])
    const res = await call(
      'GET',
      `/amenities/${amenity.slug}/slots?date=${date}`,
    )
    expect(res.json.data.slots).toEqual([])
  })

  it('frees capacity when staff decline a request', async () => {
    const { amenity, admin } = await withSlots(2)
    const date = daysAhead(9)
    const first = await call('POST', '/slot-requests', {
      body: request(amenity.slug, date, '10:00', 2),
    })
    await call('POST', `/admin/slot-requests/${first.json.data.id}/status`, {
      cookie: admin.cookie,
      body: { status: 'declined' },
    })
    expect(
      (
        await call('POST', '/slot-requests', {
          body: request(amenity.slug, date, '10:00', 2),
        })
      ).status,
    ).toBe(201)
  })
})
