import { Link } from '@tanstack/react-router'
import { ChevronRight, Clock, MapPin, Palmtree } from 'lucide-react'

import { ShareButton } from '#/components/shared/share-button'
import { CONTACT, SITE } from '#/constants/site'

const MAP_URL =
  'https://www.google.com/maps/search/?api=1&query=Treasure+Island+Ada+Foah+Ghana'

// Title block: breadcrumb, resort name, official location/hours, map + share.
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
          <h1 className="display-title text-4xl md:text-5xl">{SITE.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-5 text-sm text-sea-ink-soft">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={16} aria-hidden /> {CONTACT.locality},{' '}
              {CONTACT.region}, {CONTACT.country}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={16} aria-hidden /> Open {CONTACT.hours}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Palmtree size={16} aria-hidden /> Private island resort
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost no-underline"
          >
            <MapPin size={16} aria-hidden /> View map
            <span className="sr-only"> (opens Google Maps)</span>
          </a>
          <ShareButton title={SITE.name} />
        </div>
      </div>
    </div>
  )
}
