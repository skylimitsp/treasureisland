import { Link } from '@tanstack/react-router'
import { ArrowRight, Check } from 'lucide-react'

import { AmenityGlyph } from '#/components/amenities/amenity-icon'
import { FacilityChip } from '#/components/shared/facility-chip'
import { formatPrice } from '#/lib/format'
import type { Amenity } from '#/types'

// Editorial showcase row — icon, kicker, linked title, blurb, highlight chips,
// and an arched photo that alternates side by row index.
export function AmenityRow({
  amenity,
  index,
}: {
  amenity: Amenity
  index: number
}) {
  const imageRight = index % 2 === 1
  const to = '/amenities/$slug'

  return (
    <article
      data-reveal
      className="grid items-center gap-8 md:grid-cols-2 md:gap-12"
    >
      <figure
        className={`overflow-hidden ${imageRight ? 'md:order-last' : ''}`}
      >
        <Link
          to={to}
          params={{ slug: amenity.slug }}
          aria-label={amenity.name}
          className="img-frame group relative block aspect-[4/3] overflow-hidden rounded-md no-underline"
        >
          {amenity.image ? (
            <img
              data-speed="0.9"
              src={amenity.image}
              alt={amenity.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full scale-105 object-cover"
            />
          ) : (
            // 12D Cinema has no photo yet → dark placeholder tile.
            <div
              className="absolute inset-0 flex items-center justify-center bg-sea-ink text-white/70"
              aria-hidden
            >
              <AmenityGlyph icon={amenity.icon} size={40} />
            </div>
          )}
        </Link>
      </figure>

      <div>
        <span className="flex size-11 items-center justify-center rounded-full border border-line bg-lagoon/10 text-lagoon-deep">
          <AmenityGlyph icon={amenity.icon} />
        </span>
        <p className="island-kicker mt-4">{amenity.category}</p>
        <h3 className="display-title mt-1.5 text-3xl md:text-4xl">
          <Link
            to={to}
            params={{ slug: amenity.slug }}
            className="text-sea-ink no-underline hover:text-lagoon-deep"
          >
            {amenity.name}
          </Link>
        </h3>
        <p className="mt-3 max-w-prose text-sea-ink-soft">{amenity.blurb}</p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {amenity.highlights.slice(0, 3).map((h) => (
            <li key={h}>
              <FacilityChip icon={Check}>{h}</FacilityChip>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link
            to={to}
            params={{ slug: amenity.slug }}
            className="btn btn-ghost no-underline"
          >
            Learn more <ArrowRight size={16} aria-hidden />
          </Link>
          {amenity.priceFrom !== null ? (
            <span className="price-badge">
              from {formatPrice(amenity.priceFrom)}
            </span>
          ) : (
            <span className="text-sm font-semibold text-sunset">
              Complimentary
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
