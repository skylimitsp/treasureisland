/**
 * Site settings with code defaults; admins override keys from the dashboard.
 * @author Joseph Nartey
 * @github devjoemedia
 */
import { siteSettings } from '#/server/db/schema'
import { CONTACT } from '#/constants/site'
import { FEATURES } from '#/constants/features'
import type { Database } from '#/server/db/client'

export interface Settings {
  currency: 'USD' | 'GHS'
  taxRatePercent: number
  pendingHoldHours: number
  features: { menu: boolean }
  contact: Record<string, string>
  socials: Record<string, string>
}

// Currency and tax are placeholders until the client confirms (api-plan §12, Q1/Q3).
const DEFAULTS: Settings = {
  currency: 'USD',
  taxRatePercent: 0,
  pendingHoldHours: 48,
  features: { ...FEATURES },
  contact: { ...CONTACT },
  socials: {},
}

export async function getSettings(db: Database): Promise<Settings> {
  const rows = await db.select().from(siteSettings)
  // Only known keys: other rows (e.g. the calendar token hash) must never leak out.
  const stored: Partial<Settings> = Object.fromEntries(
    rows.filter((r) => r.key in DEFAULTS).map((r) => [r.key, r.value]),
  )
  return {
    ...DEFAULTS,
    ...stored,
    features: { ...DEFAULTS.features, ...stored.features },
    contact: { ...DEFAULTS.contact, ...stored.contact },
  }
}

export async function updateSettings(
  db: Database,
  patch: Partial<Settings>,
): Promise<Settings> {
  const current = await getSettings(db)
  const merged: Partial<Settings> = {
    ...patch,
    ...(patch.features && {
      features: { ...current.features, ...patch.features },
    }),
    ...(patch.contact && { contact: { ...current.contact, ...patch.contact } }),
  }
  const entries = Object.entries(merged)
  if (entries.length) {
    await db.batch(
      entries.map(([key, value]) =>
        db
          .insert(siteSettings)
          .values({ key, value })
          .onConflictDoUpdate({ target: siteSettings.key, set: { value } }),
      ) as [never, ...Array<never>],
    )
  }
  return getSettings(db)
}

// What the public site may see: no internal knobs like hold hours.
export function publicSettings(s: Settings) {
  return {
    currency: s.currency,
    features: s.features,
    contact: s.contact,
    socials: s.socials,
  }
}
