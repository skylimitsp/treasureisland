import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'

import { AmenityGlyph } from '#/components/amenities/amenity-icon'
import type { Amenity } from '#/types'

// Full-bleed detail hero — image (or dark placeholder), scrim, breadcrumb,
// kicker, Playfair title, and one-line blurb.
export function AmenityDetailHero({ amenity }: { amenity: Amenity }) {
  return (
    <section className="relative flex min-h-[62vh] items-end overflow-hidden">
      {amenity.hero ? (
        <img
          src={amenity.hero}
          alt={amenity.name}
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        // 12D Cinema has no photo yet → dark placeholder background.
        <div
          className="absolute inset-0 flex items-center justify-center bg-sea-ink text-white/40"
          aria-hidden
        >
          <AmenityGlyph icon={amenity.icon} size={72} />
        </div>
      )}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(23,58,64,.82), rgba(23,58,64,.15) 62%)',
        }}
        aria-hidden
      />

      <div className="page-wrap--wide relative w-full pb-12">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-sm text-white/80"
        >
          <Link to="/" className="no-underline hover:text-white">
            Home
          </Link>
          <ChevronRight size={14} aria-hidden />
          <Link to="/amenities" className="no-underline hover:text-white">
            Amenities
          </Link>
          <ChevronRight size={14} aria-hidden />
          <span aria-current="page" className="text-white">
            {amenity.name}
          </span>
        </nav>

        <p className="island-kicker mt-6 !text-white/85">{amenity.category}</p>
        <h1 className="display-title mt-2 max-w-3xl text-5xl text-white [text-shadow:0_2px_24px_rgba(23,58,64,.35)] md:text-6xl">
          {amenity.name}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-white/90">{amenity.blurb}</p>
      </div>
    </section>
  )
}
