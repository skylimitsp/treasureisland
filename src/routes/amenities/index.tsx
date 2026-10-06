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
        'Jacuzzi bath, boat cruise with jet-ski, 12D cinema, taxi boat, ' +
        'swimming and waterfront cabanas, horse riding, gaming and the ' +
        'restaurant at Treasure Island Ada, Ada Foah.',
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
        image="/photos/beach-hero.webp"
        kicker="Treasure Island Ada"
        title="Definition of luxury, hospitality and serendipity."
        ctaLabel="Book Early"
        ctaTo="/rooms"
        ctaLabel2="Events & Meetings"
        ctaTo2="/events"
        variant="warm"
      />
    </main>
  )
}
