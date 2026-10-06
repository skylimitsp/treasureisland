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
import { TailoredPackages } from '#/components/events/tailored-packages'
import { EventGallery } from '#/components/events/event-gallery'
import { EnquirySection } from '#/components/events/enquiry-section'
import { Testimonials } from '#/components/shared/testimonials'
import { EventsFaq } from '#/components/events/events-faq'
import { FixedDivider } from '#/components/shared/fixed-divider'
import { Newsletter } from '#/components/shared/newsletter'
import type { EventCategory } from '#/types'

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
      <EventTypes onEnquire={(eventType) => goToEnquire({ eventType })} />
      <HowItWorks />
      <VenueShowcase />
      <TailoredPackages onEnquire={() => goToEnquire({})} />
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
