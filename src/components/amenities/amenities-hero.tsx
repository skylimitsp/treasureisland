import { Link } from '@tanstack/react-router'

import { PageHero } from '#/components/shared/page-hero'

// Smooth-scrolls to an in-page anchor (browser honours reduced motion).
function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

// Amenities hero: same shared hero as Events, copy straight on the photo.
export function AmenitiesHero() {
  return (
    <PageHero
      image="/photos/aerial-resort.webp"
      kicker="The island, beyond your room"
      title={
        <>
          Everything the day could{' '}
          <em style={{ color: 'var(--gold)' }}>hold</em>.
        </>
      }
      body="Dawn-to-dusk experiences across the resort — ocean-view dining, water play, wellness, and quiet corners to slow right down."
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
