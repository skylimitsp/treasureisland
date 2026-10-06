import { Clock, MapPin, Tag, Users } from 'lucide-react'

import type { Amenity } from '#/types'

// Key-info card — shows only the facts the resort has published; hidden if none.
export function AmenityInfoPanel({ amenity }: { amenity: Amenity }) {
  const rows = [
    { icon: Clock, label: 'Hours', value: amenity.hours },
    { icon: MapPin, label: 'Location', value: amenity.location },
    { icon: Users, label: 'Capacity', value: amenity.capacity },
    {
      icon: Tag,
      label: 'Price',
      value: amenity.price
        ? [amenity.price, amenity.priceNote].filter(Boolean).join(' · ')
        : undefined,
    },
  ].filter((row) => Boolean(row.value))

  if (rows.length === 0) return null

  return (
    <div className="island-shell rounded-md p-6">
      <h2 className="display-title text-xl">Good to know</h2>
      <dl className="mt-4 space-y-4">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="island-kicker flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-lagoon/10 text-lagoon-deep">
                <row.icon size={16} strokeWidth={1.75} aria-hidden />
              </span>
              {row.label}
            </dt>
            <dd className="mt-1 pl-12 text-sea-ink">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
