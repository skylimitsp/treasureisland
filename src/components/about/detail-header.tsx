import { Link } from '@tanstack/react-router'
import { ChevronRight, MapPin, Share2, Star, Palmtree } from 'lucide-react'

// Title block mirroring the StayBox detail header: breadcrumb, title, meta row,
// and View Map / Share pills.
export function DetailHeader() {
  return (
    <div className="page-wrap pt-28">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-sm text-sea-ink-soft"
      >
        <Link to="/" className="no-underline hover:text-sea-ink">
          Home
        </Link>
        <ChevronRight size={14} aria-hidden />
        <span aria-current="page" className="text-lagoon-deep">
          About
        </span>
      </nav>

      <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="display-title text-4xl md:text-5xl">
            Treasure Island Beach Resort
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-5 text-sm text-sea-ink-soft">
            <span className="inline-flex items-center gap-1.5">
              <Star
                size={16}
                className="text-gold"
                fill="currentColor"
                strokeWidth={0}
                aria-hidden
              />
              4.9 · 1,284 reviews
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={16} aria-hidden /> Treasure Island, Indian Ocean
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Palmtree size={16} aria-hidden /> Private-island resort
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a href="#location" className="btn btn-ghost no-underline">
            <MapPin size={16} aria-hidden /> View Map
          </a>
          <button type="button" className="btn btn-ghost">
            <Share2 size={16} aria-hidden /> Share
          </button>
        </div>
      </div>
    </div>
  )
}
