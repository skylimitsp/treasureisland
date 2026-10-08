import { env } from 'cloudflare:workers'

import { app } from '#/server/app'
import { createDb } from '#/server/db/client'
import { amenities, rooms, users } from '#/server/db/schema'
import { hashPassword } from '#/server/lib/crypto'

export const db = createDb(env.DB)

interface CallOptions {
  body?: unknown
  cookie?: string
  headers?: Record<string, string>
}

// Calls the Hono app in-process, exactly as the Worker route does.
export async function call(
  method: string,
  path: string,
  opts: CallOptions = {},
) {
  const headers: Record<string, string> = { ...opts.headers }
  if (opts.cookie) headers.cookie = opts.cookie
  if (opts.body !== undefined) headers['content-type'] = 'application/json'
  const res = await app.request(
    `http://localhost/api/v1${path}`,
    {
      method,
      headers,
      body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
    },
    env,
  )
  const text = await res.text()
  let json: any = null
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    json = null
  }
  return { status: res.status, headers: res.headers, json, text }
}

export const uid = () => crypto.randomUUID().slice(0, 8)

// Date-only string N days from today (UTC), for stay and slot dates.
export const daysAhead = (n: number) =>
  new Date(Date.now() + n * 86_400_000).toISOString().slice(0, 10)

export async function seedRoom(
  overrides: Partial<typeof rooms.$inferInsert> = {},
) {
  const slug = overrides.slug ?? `room-${uid()}`
  const [row] = await db
    .insert(rooms)
    .values({
      slug,
      name: `Room ${slug}`,
      category: 'double',
      description: 'Test room',
      pricePerNight: 10_000,
      currency: 'USD',
      maxGuests: 2,
      bathroom: 'En-suite',
      amenities: [],
      image: '/test.webp',
      inventory: 1,
      ...overrides,
    })
    .returning()
  return row
}

export async function seedAmenity(
  overrides: Partial<typeof amenities.$inferInsert> = {},
) {
  const slug = overrides.slug ?? `amenity-${uid()}`
  const [row] = await db
    .insert(amenities)
    .values({
      slug,
      name: `Amenity ${slug}`,
      category: 'Test',
      blurb: 'Blurb',
      description: 'Description',
      image: '/a.webp',
      hero: '/a.webp',
      gallery: [],
      icon: 'ship',
      bookable: true,
      ...overrides,
    })
    .returning()
  return row
}

// Creates a staff member and returns a logged-in session cookie.
export async function signIn(role: 'admin' | 'concierge' = 'admin') {
  const email = `${role}-${uid()}@localhost.test`
  const password = `pw-${uid()}-${uid()}`
  await db.insert(users).values({
    name: `Test ${role}`,
    email,
    role,
    passwordHash: await hashPassword(password),
  })
  const res = await call('POST', '/auth/login', { body: { email, password } })
  const cookie = res.headers.get('set-cookie')?.split(';')[0]
  if (res.status !== 200 || !cookie)
    throw new Error(`login failed: ${res.text}`)
  return { cookie, email, password }
}
