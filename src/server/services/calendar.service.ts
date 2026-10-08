/**
 * Read-only iCal feed of stays and confirmed experiences for staff calendars.
 * @author Joseph Nartey
 * @github devjoemedia
 */
import { and, eq, gte, inArray } from 'drizzle-orm'

import { bookings, siteSettings, slotRequests } from '#/server/db/schema'
import { randomToken, sha256 } from '#/server/lib/crypto'
import { addDays } from '#/server/lib/dates'
import type { Database } from '#/server/db/client'

// Calendar apps can't send cookies, so the feed URL carries a secret token (stored hashed).
const TOKEN_KEY = 'calendarTokenHash'

export async function rotateCalendarToken(db: Database): Promise<string> {
  const token = randomToken(24)
  const value = await sha256(token)
  await db
    .insert(siteSettings)
    .values({ key: TOKEN_KEY, value })
    .onConflictDoUpdate({ target: siteSettings.key, set: { value } })
  return token
}

export async function isValidCalendarToken(db: Database, token: string) {
  const row = await db.query.siteSettings.findFirst({
    where: eq(siteSettings.key, TOKEN_KEY),
  })
  return Boolean(row) && row?.value === (await sha256(token))
}

// RFC 5545: escape text, fold lines at 75 octets, CRLF endings.
const esc = (v: string) =>
  v
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')

function fold(line: string): string {
  const bytes = new TextEncoder().encode(line)
  if (bytes.length <= 75) return line
  const parts: Array<string> = []
  let current = ''
  for (const ch of line) {
    if (
      new TextEncoder().encode(current + ch).length > (parts.length ? 74 : 75)
    ) {
      parts.push(current)
      current = ch
    } else current += ch
  }
  parts.push(current)
  return parts.join('\r\n ')
}

const icsDate = (d: string) => d.replace(/-/g, '')
const icsStamp = (iso: string) =>
  iso.replace(/[-:]/g, '').replace(/\.\d{3}/, '')

export async function buildCalendar(
  db: Database,
  host: string,
): Promise<string> {
  const since = addDays(-30).slice(0, 10)
  const [stays, slots] = await Promise.all([
    db
      .select()
      .from(bookings)
      .where(
        and(
          inArray(bookings.status, ['pending', 'confirmed', 'checked_in']),
          gte(bookings.checkOut, since),
        ),
      ),
    db
      .select()
      .from(slotRequests)
      .where(
        and(
          eq(slotRequests.status, 'confirmed'),
          gte(slotRequests.date, since),
        ),
      ),
  ])
  const stamp = icsStamp(new Date().toISOString())
  const events = [
    ...stays.map((b) => [
      'BEGIN:VEVENT',
      `UID:${b.id}@${host}`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${icsDate(b.checkIn)}`,
      `DTEND;VALUE=DATE:${icsDate(b.checkOut)}`,
      `SUMMARY:${esc(`${b.status === 'pending' ? '[Pending] ' : ''}${b.roomName} · ${b.guestName}`)}`,
      `DESCRIPTION:${esc(`${b.id} · ${b.guests} guests · ${b.email}`)}`,
      `STATUS:${b.status === 'pending' ? 'TENTATIVE' : 'CONFIRMED'}`,
      'END:VEVENT',
    ]),
    ...slots.map((s) => [
      'BEGIN:VEVENT',
      `UID:${s.id}@${host}`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${icsDate(s.date)}`,
      `SUMMARY:${esc(`${s.amenityName} ${s.slot} · ${s.name} (${s.partySize})`)}`,
      `DESCRIPTION:${esc(`${s.id} · ${s.email}`)}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
    ]),
  ]
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Treasure Island Ada//Bookings//EN',
    'CALSCALE:GREGORIAN',
    'X-WR-CALNAME:Treasure Island bookings',
    ...events.flat(),
    'END:VCALENDAR',
  ]
    .map(fold)
    .join('\r\n')
    .concat('\r\n')
}
