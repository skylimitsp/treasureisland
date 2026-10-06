import { Link } from '@tanstack/react-router'
import { ArrowRight, BedDouble, Eye, Users } from 'lucide-react'

import { FacilityChip } from '#/components/shared/facility-chip'
import { formatNightlyRate, formatPrice } from '#/lib/format'
import { ROOM_CATEGORY_LABELS } from '#/lib/rooms-filter'
import type { Room } from '#/types'
import { ResponsiveImage } from '#/components/shared/responsive-image'

// Room preview card. Phones: the photo fills the card under a dark gradient
// with the details on top. From `sm`: inset photo, blurb and spec chips.
// `reveal` gates the scroll entrance — off for filterable grids.
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
      className="group feature-card relative flex aspect-[3/4] h-full flex-col justify-end overflow-hidden md:rounded-md border border-line no-underline max-sm:!border-0 max-sm:!bg-footer max-sm:!shadow-none sm:aspect-auto sm:justify-start sm:p-4"
    >
      <div className="img-frame absolute inset-0 max-sm:!rounded-none sm:relative sm:aspect-[4/3]">
        <ResponsiveImage
          src={room.image}
          alt={room.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
        <span className="price-badge absolute left-3 top-3 max-sm:!hidden">
          {formatNightlyRate(room.pricePerNight)}
        </span>
      </div>

      {/* Phones: scrim + details over the photo. */}
      <div
        className="absolute inset-0 sm:hidden"
        style={{
          background:
            'linear-gradient(to bottom, rgba(13,34,39,0) 30%, rgba(13,34,39,.55) 55%, rgba(13,34,39,.94) 100%)',
        }}
        aria-hidden
      />
      <div className="relative p-3 text-white sm:hidden">
        <p className="island-kicker !text-[0.6rem] !text-white/70">
          {ROOM_CATEGORY_LABELS[room.category]}
        </p>
        <h3 className="display-title mt-0.5 line-clamp-2 text-[0.95rem] leading-snug text-white">
          {room.name}
        </h3>
        <p className="mt-1.5 text-sm font-bold text-white">
          {formatPrice(room.pricePerNight)}
          <span className="text-xs font-normal text-white/70"> / night</span>
        </p>
        <p className="text-xs text-white/70">
          {room.beds ? `${room.beds} · ` : ''}
          {room.maxGuests} guests
        </p>
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-white">
          View room
          <ArrowRight
            size={13}
            className="transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </span>
      </div>

      {/* From sm: the standard card body. */}
      <div className="mt-auto hidden pt-4 sm:block">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="display-title text-xl text-sea-ink">{room.name}</h3>
          <span className="island-kicker shrink-0">
            {ROOM_CATEGORY_LABELS[room.category]}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-sea-ink-soft">
          {room.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {room.beds ? (
            <FacilityChip icon={BedDouble}>{room.beds}</FacilityChip>
          ) : null}
          <FacilityChip icon={Users}>{room.maxGuests} guests</FacilityChip>
          {room.view ? (
            <FacilityChip icon={Eye}>{room.view} view</FacilityChip>
          ) : null}
        </div>
      </div>
    </Link>
  )
}
