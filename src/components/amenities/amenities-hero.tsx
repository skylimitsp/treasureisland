import { Link } from '@tanstack/react-router'

import { SectionKicker } from '#/components/shared/section-kicker'

// Smooth-scrolls to an in-page anchor (browser honours reduced motion).
function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

// Full-bleed ocean hero with a frosted headline panel and dual CTAs.
export function AmenitiesHero() {
  return (
    <section
      data-fixed-band
      className="relative flex min-h-[86vh] items-center overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(23,58,64,.6) 0%, rgba(23,58,64,.26) 60%), url('/amenities/aerial-lagoon.webp')",
      }}
    >
      <div className="page-wrap w-full py-28">
        <div
          data-hero
          className="island-shell max-w-2xl rounded-md p-8 md:p-10"
        >
          <SectionKicker>The island, beyond your room</SectionKicker>
          <h1 className="display-title mt-4 text-5xl leading-[1.04] md:text-6xl">
            Everything the day could <em>hold</em>.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-sea-ink-soft">
            Dawn-to-dusk experiences across the resort — ocean-view dining,
            water play, wellness, and quiet corners to slow right down.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => scrollToId('showcase')}
              className="btn btn-primary"
            >
              Explore amenities
            </button>
            <Link to="/rooms" className="btn btn-ghost no-underline">
              Plan a stay
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
