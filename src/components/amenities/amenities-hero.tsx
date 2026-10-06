import { Link } from '@tanstack/react-router'

import { PageHero } from '#/components/shared/page-hero'

// Smooth-scrolls to an in-page anchor (browser honours reduced motion).
function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

// Amenities hero: shared hero with the official "Our Services" copy.
export function AmenitiesHero() {
  return (
    <PageHero
      image="/photos/aerial-resort.webp"
      kicker="Our Services"
      title={
        <>
          The best place to <em style={{ color: 'var(--gold)' }}>be</em>.
        </>
      }
      body="We offer various types of services ranging from but not limited to, home style chalets, penthouses, deluxe rooms with balconies, standard rooms, 12D cinema, game centre, conference centre, night club, full bar and restaurant, boating, jet skiing, horse back riding, petting zoo and a lot more."
      actions={
        <>
          <button
            type="button"
            onClick={() => scrollToId('showcase')}
            className="btn btn-primary"
          >
            Explore amenities
          </button>
          <Link
            to="/rooms"
            className="btn btn-ghost !border-white/70 !text-white no-underline"
          >
            Plan a stay
          </Link>
        </>
      }
    />
  )
}
