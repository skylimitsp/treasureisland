import { Link } from '@tanstack/react-router'
import { BedDouble, Maximize, Users, Waves } from 'lucide-react'

import { FacilityChip } from '#/components/shared/facility-chip'
import { formatNightlyRate } from '#/lib/format'
import type { Room } from '#/types'

// Room preview card: arched photo, price badge, name, blurb, spec chips.
// `reveal` gates the scroll entrance — off for filterable grids so filtered-in
// cards never get stuck hidden. Cards are equal-height (flex column); any extra
// space falls between the image and the content, not below it.
export function RoomCard({
  room,
  reveal = true,
}: {
  room: Room
  reveal?: boolean
}) {
  return (
    <Link
      to="/rooms/$roomSlug"
      params={{ roomSlug: room.slug }}
      data-reveal={reveal ? '' : undefined}
      className="group feature-card flex h-full flex-col rounded-md border border-line p-4 no-underline"
    >
      <div className="img-frame relative aspect-[4/3]">
        <img
          src={room.image}
          alt={room.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
        <span className="price-badge absolute left-3 top-3">
          {formatNightlyRate(room.pricePerNight)}
        </span>
      </div>

      <div className="mt-auto pt-4">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="display-title text-xl text-sea-ink">{room.name}</h3>
          <span className="island-kicker">{room.category}</span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-sea-ink-soft">
          {room.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <FacilityChip icon={BedDouble}>{room.beds}</FacilityChip>
          <FacilityChip icon={Users}>{room.maxGuests} guests</FacilityChip>
          <FacilityChip icon={Maximize}>{room.sizeSqm} m²</FacilityChip>
          {room.oceanView ? (
            <FacilityChip icon={Waves}>Ocean view</FacilityChip>
          ) : null}
        </div>
      </div>
    </Link>
  )
}
