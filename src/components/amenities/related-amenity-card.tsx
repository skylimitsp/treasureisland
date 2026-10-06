import { Link } from '@tanstack/react-router'

import { AmenityGlyph } from '#/components/amenities/amenity-icon'
import type { Amenity } from '#/types'
import { ResponsiveImage } from '#/components/shared/responsive-image'

// Compact cross-link card to another amenity's detail page.
export function RelatedAmenityCard({ amenity }: { amenity: Amenity }) {
  return (
    <Link
      to="/amenities/$slug"
      params={{ slug: amenity.slug }}
      data-reveal
      aria-label={amenity.name}
      className="img-frame group relative block aspect-[4/3] overflow-hidden rounded-md no-underline"
    >
      {amenity.image ? (
        <ResponsiveImage
          src={amenity.image}
          alt={amenity.imageAlt ?? amenity.name}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        // No photo → dark placeholder tile.
        <div
          className="absolute inset-0 flex items-center justify-center bg-sea-ink text-white/60"
          aria-hidden
        >
          <AmenityGlyph icon={amenity.icon} size={32} />
        </div>
      )}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(23,58,64,.76), transparent 58%)',
        }}
        aria-hidden
      />
      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
        <span className="mb-1 inline-flex items-center gap-1.5 text-white/80">
          <AmenityGlyph icon={amenity.icon} size={15} />
          <span className="island-kicker !text-white/80">
            {amenity.category}
          </span>
        </span>
        <h3 className="display-title text-lg leading-tight text-white">
          {amenity.name}
        </h3>
      </div>
    </Link>
  )
}
