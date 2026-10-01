import { Link } from '@tanstack/react-router'
import { Star } from 'lucide-react'

import { SectionKicker } from '#/components/shared/section-kicker'
import { HeroSearch } from '#/components/rooms/hero-search'
import { useGsap } from '#/hooks/use-gsap'
import { gsap } from '#/lib/gsap'

// Full-bleed hero with a fixed background, headline, CTAs, search, social proof.
export function Hero() {
  const ref = useGsap<HTMLElement>((self) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const items = self.querySelectorAll('[data-hero]')
    gsap.from(items, {
      y: 24,
      opacity: 0,
      duration: 1,
      ease: 'expo.out',
      stagger: 0.12,
    })
  })

  return (
    <section
      ref={ref}
      className="hero-bg relative flex min-h-[92vh] items-center overflow-hidden"
    >
      <div className="page-wrap w-full py-28">
        <div className="max-w-2xl">
          <div data-hero>
            <SectionKicker className="!text-white/85">
              Beachfront · Est. 2020
            </SectionKicker>
          </div>
          <h1
            data-hero
            className="display-title mt-4 text-5xl leading-[1.03] text-white [text-shadow:0_2px_24px_rgba(23,58,64,.35)] md:text-7xl"
          >
            Wake up where the ocean{' '}
            <em style={{ color: 'var(--gold)' }}>begins</em>.
          </h1>
          <p data-hero className="mt-5 max-w-xl text-lg text-white/90">
            An intimate luxury retreat — overwater villas, sunset suites, and a
            private shore of white sand.
          </p>
          <div data-hero className="mt-8 flex flex-wrap gap-3">
            <a href="#stays" className="btn btn-primary no-underline">
              Book Now
            </a>
            <Link
              to="/rooms"
              className="btn btn-ghost !border-white/70 !text-white no-underline"
            >
              Explore Rooms
            </Link>
          </div>

          <div data-hero id="stays">
            <HeroSearch />
          </div>

          <div
            data-hero
            className="mt-6 inline-flex items-center gap-3 rounded-md border border-white/25 bg-white/15 px-4 py-2 text-white backdrop-blur"
          >
            <span className="flex text-gold" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
              ))}
            </span>
            <span className="text-sm">
              <strong>+500</strong> five-star Google reviews
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
