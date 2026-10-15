import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { seo } from '#/lib/seo'
import { eventTypesQueryOptions } from '#/hooks/queries/events.query'
import { testimonialsQueryOptions } from '#/hooks/queries/content.query'
import { useGsap } from '#/hooks/use-gsap'
import { ScrollTrigger } from '#/lib/gsap'
import {
  enableFixedBands,
  parallaxLayers,
  revealStagger,
} from '#/lib/animations'
import { EventsHero } from '#/components/events/events-hero'
import { EventTypes } from '#/components/events/event-types'
import { HowItWorks } from '#/components/events/how-it-works'
import { VenueShowcase } from '#/components/events/venue-showcase'
import { CateringShowcase } from '#/components/events/catering-showcase'
import { EventFilm } from '#/components/events/event-film'
import { TailoredPackages } from '#/components/events/tailored-packages'
import { EventGallery } from '#/components/events/event-gallery'
import { EnquirySection } from '#/components/events/enquiry-section'
import { Testimonials } from '#/components/shared/testimonials'
import { ActivitiesReel } from '#/components/shared/activities-reel'
import { EventsFaq } from '#/components/events/events-faq'
import { FixedDivider } from '#/components/shared/fixed-divider'
import { Newsletter } from '#/components/shared/newsletter'
import type { EventCategory } from '#/types'
import { GalleryMarquee } from '#/components/events/gallery-marquee'

export const Route = createFileRoute('/events')({
  // Server-render event types and testimonials so the content is crawlable.
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(eventTypesQueryOptions()),
      context.queryClient.ensureQueryData(testimonialsQueryOptions()),
    ])
  },
  head: () =>
    seo({
      title: 'Events & Meetings',
      description:
        'Weddings, birthday parties, family parties and meetings at Treasure ' +
        'Island Resort, Ada Foah — an environment perfectly designed for ' +
        'successful events.',
      path: '/events',
    }),
  component: EventsPage,
})

function EventsPage() {
  const [defaults, setDefaults] = useState<{ eventType?: EventCategory }>({})

  // One scoped context wires every page-level scroll pattern.
  const ref = useGsap<HTMLElement>((self) => {
    revealStagger(self)
    parallaxLayers(self)
    enableFixedBands(self)
    window.addEventListener('load', () => ScrollTrigger.refresh(), {
      once: true,
    })
  })

  function goToEnquire(next: { eventType?: EventCategory }) {
    setDefaults(next)
    document.getElementById('enquire')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main ref={ref}>
      <EventsHero />
      {/* <GalleryMarquee className="mt-4" /> */}
      <EventTypes onEnquire={(eventType) => goToEnquire({ eventType })} />
      <ActivitiesReel className="mt-24" />
      <HowItWorks />
      <VenueShowcase />
      <CateringShowcase />
      <TailoredPackages onEnquire={() => goToEnquire({})} />
      <EventFilm />
      <EventGallery />
      <EnquirySection defaults={defaults} />
      <Testimonials />
      <EventsFaq />
      <FixedDivider
        image="/photos/pool-at-night.webp"
        kicker="Events & Meetings"
        title="Let’s plan your day."
        ctaLabel="Explore rooms"
        ctaTo="/rooms"
        variant="warm"
      />
      <section className="page-wrap mt-24 mb-24">
        <Newsletter source="events" />
      </section>
    </main>
  )
}
