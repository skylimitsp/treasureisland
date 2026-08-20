import { createFileRoute } from '@tanstack/react-router'

import { seo } from '#/lib/seo'
import { faqLd, lodgingBusinessLd } from '#/lib/structured-data'
import { getFaqs } from '#/data/content'
import {
  resortStatsQueryOptions,
  roomsQueryOptions,
} from '#/hooks/queries/rooms.query'
import { amenitiesQueryOptions } from '#/hooks/queries/amenities.query'
import { eventTeasersQueryOptions } from '#/hooks/queries/events.query'
import {
  faqsQueryOptions,
  testimonialsQueryOptions,
} from '#/hooks/queries/content.query'
import { useGsap } from '#/hooks/use-gsap'
import { ScrollTrigger } from '#/lib/gsap'
import {
  countUp,
  enableFixedBands,
  parallaxLayers,
  revealStagger,
} from '#/lib/animations'
import { Hero } from '#/components/shared/hero'
import { FeaturedRooms } from '#/components/rooms/featured-rooms'
import { EditorialBand } from '#/components/shared/editorial-band'
import { FixedDivider } from '#/components/shared/fixed-divider'
import { ExperiencesMasonry } from '#/components/amenities/experiences-masonry'
import { EventsTeaser } from '#/components/events/events-teaser'
import { Testimonials } from '#/components/shared/testimonials'
import { Faq } from '#/components/shared/faq'

export const Route = createFileRoute('/')({
  // Server-render rooms + stats so above-the-fold content is crawlable.
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(roomsQueryOptions()),
      context.queryClient.ensureQueryData(resortStatsQueryOptions()),
      context.queryClient.ensureQueryData(amenitiesQueryOptions()),
      context.queryClient.ensureQueryData(eventTeasersQueryOptions()),
      context.queryClient.ensureQueryData(testimonialsQueryOptions()),
      context.queryClient.ensureQueryData(faqsQueryOptions()),
    ])
  },
  head: () => {
    const base = seo({
      title: 'Luxury Beach Resort',
      description:
        'Beachfront villas and suites on a private stretch of white sand. ' +
        'Ocean-view dining, an overwater spa, and barefoot luxury at Treasure Island.',
      path: '/',
      jsonLd: [
        lodgingBusinessLd({
          rating: 4.9,
          reviewCount: 1284,
          priceRange: '$$$',
        }),
        faqLd(getFaqs()),
      ],
    })
    return {
      ...base,
      links: [
        ...base.links,
        { rel: 'preload', as: 'image', href: '/heroes/hero.avif' },
      ],
    }
  },
  component: Home,
})

function Home() {
  // One scoped context wires every scroll pattern for the page.
  const ref = useGsap<HTMLElement>((self) => {
    revealStagger(self)
    countUp(self)
    parallaxLayers(self)
    enableFixedBands(self)
    // Recalculate positions once late images have loaded.
    window.addEventListener('load', () => ScrollTrigger.refresh(), {
      once: true,
    })
  })

  return (
    <main ref={ref}>
      <Hero />
      <FeaturedRooms />
      <EditorialBand />
      <FixedDivider
        image="/heroes/escape.jpg"
        kicker="A world away"
        title="Escape to the island."
        ctaLabel="Plan your escape"
        ctaTo="/rooms"
      />
      <ExperiencesMasonry />
      <EventsTeaser />
      <Testimonials />
      <Faq />
      <FixedDivider
        image="/heroes/reserve.jpg"
        title="Reserve your stay."
        subtitle="Your private stretch of paradise is waiting."
        ctaLabel="Book Now"
        ctaTo="/rooms"
        variant="warm"
      />
    </main>
  )
}
