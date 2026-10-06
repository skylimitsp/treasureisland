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
import { StaySteps } from '#/components/shared/stay-steps'
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
      title: 'Private Island Resort in Ada Foah, Ghana',
      description:
        'Treasure Island Ada — a private island resort near the estuary of the ' +
        'Atlantic Ocean & Volta River. Chalets, penthouses, 12D cinema, boat ' +
        'cruises, horse riding, weddings and meetings. Open 24 hours.',
      path: '/',
      jsonLd: [
        lodgingBusinessLd({ priceRange: '$105–$850' }),
        faqLd(getFaqs()),
      ],
    })
    return {
      ...base,
      links: [
        ...base.links,
        {
          rel: 'preload',
          as: 'image',
          href: '/videos/hero-aerial-day-poster.webp',
          type: 'image/webp',
          fetchPriority: 'high',
        },
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
        image="/photos/lagoon-sunset.webp"
        kicker="A world away"
        title="Escape to the island."
        ctaLabel="Plan your escape"
        ctaTo="/rooms"
      />
      <ExperiencesMasonry />
      <StaySteps />
      <EventsTeaser />
      <Testimonials />
      <Faq />
      <FixedDivider
        image="/photos/resort-night.webp"
        title="Reserve your stay."
        subtitle="Visit us any day, Monday through Sunday, 24/7. A warm welcome awaits you."
        ctaLabel="Book Now"
        ctaTo="/rooms"
        variant="warm"
      />
    </main>
  )
}
