import { Link } from '@tanstack/react-router'
import { Clock, Phone } from 'lucide-react'

import { SectionKicker } from '#/components/shared/section-kicker'
import { HeroSearch } from '#/components/rooms/hero-search'
import { BackgroundVideo } from '#/components/shared/background-video'
import { useGsap } from '#/hooks/use-gsap'
import { gsap } from '#/lib/gsap'
import { CONTACT } from '#/constants/site'

// Full-bleed hero over a looping aerial video, headline, CTAs, search, social proof.
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
      className="relative isolate flex min-h-[92vh] items-center overflow-hidden bg-footer"
    >
      <BackgroundVideo
        src="/videos/hero-aerial-day"
        mobileSrc="/videos/hero-aerial-day-720"
        priority
        className="absolute inset-0 -z-20 size-full"
      />
      <div className="hero-bg absolute inset-0 -z-10" aria-hidden />
      <div className="page-wrap w-full py-28">
        <div className="max-w-2xl">
          <div data-hero>
            <SectionKicker className="!text-white/85">
              Treasure Island Ada · Ada Foah, Ghana
            </SectionKicker>
          </div>
          <h1
            data-hero
            className="display-title mt-4 text-5xl leading-[1.03] text-white [text-shadow:0_2px_24px_rgba(23,58,64,.35)] md:text-7xl"
          >
            The best <em style={{ color: 'var(--gold)' }}>place</em> to be.
          </h1>
          <p data-hero className="mt-5 max-w-xl text-lg text-white/90">
            A private island resort near the estuary of the Atlantic Ocean &
            Volta River. Book early.
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
            className="mt-6 inline-flex flex-wrap items-center gap-x-4 gap-y-1 rounded-md border border-white/25 bg-white/15 px-4 py-2 text-sm text-white backdrop-blur"
          >
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} aria-hidden /> Open {CONTACT.hours}
            </span>
            <a
              href={CONTACT.phoneHref}
              className="inline-flex min-h-11 items-center gap-1.5 text-white no-underline hover:underline"
            >
              <Phone size={14} aria-hidden /> {CONTACT.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
