import { Clock, MapPin, Tag, Users } from 'lucide-react'

import { formatPrice } from '#/lib/format'
import type { Amenity } from '#/types'

// Key-info card — hours, location, capacity, and the from-price / complimentary.
export function AmenityInfoPanel({ amenity }: { amenity: Amenity }) {
  const price =
    amenity.priceFrom !== null
      ? `from ${formatPrice(amenity.priceFrom)}`
      : 'Complimentary'

  const rows = [
    { icon: Clock, label: 'Hours', value: amenity.hours },
    { icon: MapPin, label: 'Location', value: amenity.location },
    ...(amenity.capacity
      ? [{ icon: Users, label: 'Capacity', value: amenity.capacity }]
      : []),
    { icon: Tag, label: 'Price', value: price },
  ]

  return (
    <div className="island-shell rounded-md p-6">
      <h2 className="display-title text-xl">Good to know</h2>
      <dl className="mt-4 space-y-4">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start gap-3">
            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-lagoon/10 text-lagoon-deep">
              <row.icon size={16} strokeWidth={1.75} aria-hidden />
            </span>
            <div>
              <dt className="island-kicker">{row.label}</dt>
              <dd className="mt-0.5 text-sea-ink">{row.value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  )
}
