import { createFileRoute } from '@tanstack/react-router'

import { seo } from '#/lib/seo'
import { amenitiesQueryOptions } from '#/hooks/queries/amenities.query'
import { useGsap } from '#/hooks/use-gsap'
import { ScrollTrigger } from '#/lib/gsap'
import {
  countUp,
  enableFixedBands,
  parallaxLayers,
  revealStagger,
} from '#/lib/animations'
import { AmenitiesHero } from '#/components/amenities/amenities-hero'
import { AmenityShowcase } from '#/components/amenities/amenity-showcase'
import { AmenityStats } from '#/components/amenities/amenity-stats'
import { FixedDivider } from '#/components/shared/fixed-divider'

export const Route = createFileRoute('/amenities/')({
  // Server-render the showcase so the rows are crawlable, not client-only.
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(amenitiesQueryOptions())
  },
  head: () =>
    seo({
      title: 'Amenities',
      description:
        'Ocean-view dining, a 12D cinema, horse riding, jacuzzi, and boat ' +
        'cruises with jet-ski at Treasure Island.',
      path: '/amenities',
    }),
  component: AmenitiesPage,
})

function AmenitiesPage() {
  const ref = useGsap<HTMLElement>((self) => {
    revealStagger(self)
    countUp(self)
    parallaxLayers(self)
    enableFixedBands(self)
    window.addEventListener('load', () => ScrollTrigger.refresh(), {
      once: true,
    })
  })

  return (
    <main ref={ref}>
      <AmenitiesHero />
      <AmenityShowcase />
      <AmenityStats />
      <FixedDivider
        image="/heroes/reserve.jpg"
        kicker="Ready when you are"
        title="Your day, already planned."
        subtitle="Reserve your stay and let the island fill the hours."
        ctaLabel="Plan your stay"
        ctaTo="/rooms"
        ctaLabel2="Ask concierge"
        ctaTo2="/events"
        variant="warm"
      />
    </main>
  )
}
