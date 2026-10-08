/**
 * Builds the content seed as SQL from the src/data mocks (shared by seed + setup scripts).
 * @author Joseph Nartey
 * @github devjoemedia
 */
import { getRooms, getBookings } from '../src/data/rooms.ts'
import { getAmenities } from '../src/data/amenities.ts'
import { getEventTeasers, getEventTypes } from '../src/data/events.ts'
import { getFaqs, getReviews, getAboutContent } from '../src/data/content.ts'
import { getMenu, getMenuSections } from '../src/data/menu.ts'
import { getSubscribers } from '../src/data/newsletter.ts'

// SQL literal for strings, numbers, booleans, null and JSON values.
function lit(v: unknown): string {
  if (v === null || v === undefined) return 'NULL'
  if (typeof v === 'number') return String(v)
  if (typeof v === 'boolean') return v ? '1' : '0'
  const s = typeof v === 'string' ? v : JSON.stringify(v)
  return `'${s.replace(/'/g, "''")}'`
}

// INSERT OR IGNORE: re-running the seed fills gaps but never overwrites admin edits.
function insert(table: string, rows: Array<Record<string, unknown>>): string {
  return rows
    .map((row) => {
      const cols = Object.keys(row)
        .map((c) => `"${c}"`)
        .join(', ')
      const vals = Object.values(row).map(lit).join(', ')
      return `INSERT OR IGNORE INTO ${table} (${cols}) VALUES (${vals});`
    })
    .join('\n')
}

const cents = (n: number) => Math.round(n * 100)

export function buildSeedSql({ demo = false } = {}): string {
  const now = new Date().toISOString()

  const rooms = getRooms()
  const sql: Array<string> = [
    insert(
      'rooms',
      rooms.map((r, i) => ({
        id: r.id,
        slug: r.slug,
        name: r.name,
        category: r.category,
        description: r.description,
        price_per_night: cents(r.pricePerNight),
        currency: 'USD',
        max_guests: r.maxGuests,
        beds: r.beds,
        view: r.view,
        bathroom: r.bathroom,
        amenities: r.amenities,
        image: r.image,
        inventory: 1,
        open: true,
        blocked_note: '',
        active: true,
        sort: i,
        created_at: now,
        updated_at: now,
      })),
    ),
    insert(
      'amenities',
      getAmenities().map((a, i) => ({
        id: a.id,
        slug: a.slug,
        name: a.name,
        category: a.category,
        blurb: a.blurb,
        description: a.description,
        image: a.image,
        image_alt: a.imageAlt ?? null,
        hero: a.hero,
        gallery: a.gallery,
        highlights: a.highlights ?? null,
        icon: a.icon,
        hours: a.hours ?? null,
        location: a.location ?? null,
        capacity: a.capacity ?? null,
        price: a.price,
        price_note: a.priceNote ?? null,
        bookable: a.bookable,
        active: true,
        sort: i,
        updated_at: now,
      })),
    ),
    insert(
      'event_teasers',
      getEventTeasers().map((t, i) => ({
        ...t,
        video: t.video ?? null,
        sort: i,
      })),
    ),
    insert(
      'event_types',
      getEventTypes().map((t, i) => ({
        slug: t.slug,
        category: t.category,
        name: t.name,
        title: t.title,
        blurb: t.blurb,
        description: t.description,
        icon: t.icon,
        inclusions: t.inclusions ?? null,
        capacity_min: t.capacityMin ?? null,
        capacity_max: t.capacityMax ?? null,
        from_price: t.fromPrice == null ? null : cents(t.fromPrice),
        gallery: t.gallery,
        packages: t.packages ?? null,
        sort: i,
      })),
    ),
    insert(
      'reviews',
      getReviews().map((r, i) => ({
        id: r.id,
        quote: r.quote,
        name: r.name,
        origin: r.origin,
        rating: r.rating ?? null,
        featured: r.featured,
        sort: i,
        created_at: now,
      })),
    ),
    insert(
      'faqs',
      getFaqs().map((f, i) => ({
        id: `faq-${i + 1}`,
        q: f.q,
        a: f.a,
        sort: i,
      })),
    ),
    insert('content_blocks', [
      { key: 'about', value: getAboutContent(), updated_at: now },
    ]),
    insert(
      'menu_sections',
      getMenuSections().map((s) => ({ ...s, tagline: s.tagline ?? null })),
    ),
    insert(
      'menu_items',
      getMenu().map((m, i) => ({ ...m, price: cents(m.price), sort: i })),
    ),
  ]

  if (demo) {
    const bookings = getBookings()
    const roomBySlug = new Map(rooms.map((r) => [r.slug, r]))
    sql.push(
      insert(
        'bookings',
        bookings.map((b) => ({
          id: b.id,
          room_id: roomBySlug.get(b.roomSlug)?.id,
          room_slug: b.roomSlug,
          room_name: b.roomName,
          guest_name: b.guestName,
          email: b.email,
          check_in: b.checkIn,
          check_out: b.checkOut,
          guests: b.guests,
          nights: b.nights,
          subtotal: cents(b.total),
          taxes: 0,
          total: cents(b.total),
          currency: 'USD',
          status: b.status,
          source: 'web',
          notes: '',
          created_at: b.createdAt,
          updated_at: b.createdAt,
        })),
      ),
      insert(
        'newsletter_subscribers',
        getSubscribers().map((s) => ({
          id: s.id,
          email: s.email,
          source: s.source,
          status: s.status,
          unsubscribe_token: crypto.randomUUID().replace(/-/g, ''),
          confirmed_at: s.createdAt,
          created_at: s.createdAt,
        })),
      ),
      // Continue reference numbering after the demo bookings (TI-2026-0006).
      `INSERT OR IGNORE INTO counters (key, value) VALUES ('TI-2026', ${bookings.length});`,
    )
  }
  return sql.filter(Boolean).join('\n') + '\n'
}
