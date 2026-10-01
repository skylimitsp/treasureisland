import { Link } from '@tanstack/react-router'
import { Anchor, Bath, Film, Ship, Utensils } from 'lucide-react'

import type { Amenity, AmenityIcon } from '#/types'

const ICONS: Record<AmenityIcon, typeof Utensils> = {
  utensils: Utensils,
  film: Film,
  bath: Bath,
  anchor: Anchor,
  ship: Ship,
}

// Image tile for the experiences masonry — photo (or dark fallback), scrim,
// icon chip, and the experience name in the brand typography.
export function ExperienceTile({ amenity }: { amenity: Amenity }) {
  const Icon = ICONS[amenity.icon]
  return (
    <Link
      to="/amenities"
      data-reveal
      aria-label={amenity.name}
      className="img-frame group relative block h-full w-full overflow-hidden rounded-md no-underline"
    >
      {amenity.image ? (
        <img
          src={amenity.image}
          alt={amenity.name}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-sea-ink" aria-hidden />
      )}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(23,58,64,.74), transparent 55%)',
        }}
        aria-hidden
      />
      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
        <span className="mb-1 inline-flex items-center gap-1.5 text-white/80">
          <Icon size={15} strokeWidth={1.75} aria-hidden />
          <span className="island-kicker !text-white/80">
            {amenity.category}
          </span>
        </span>
        <h3 className="display-title text-xl leading-tight text-white">
          {amenity.name}
        </h3>
      </div>
    </Link>
  )
}
