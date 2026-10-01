import { Sparkles } from 'lucide-react'

import { ArchPhoto } from '#/components/shared/arch-photo'
import { BookingPreviewCard } from '#/components/shared/booking-preview-card'
import { ColorBlockPanel } from '#/components/shared/color-block-panel'

// How a stay comes together: four colour-blocked steps, room to extras.
export function StaySteps() {
  return (
    <section className="page-wrap--wide mt-28" aria-labelledby="steps-title">
      <div className="mx-auto max-w-xl text-center">
        <span className="inline-block rounded-md bg-footer px-4 py-1.5 text-sm font-semibold text-white">
          Plan your stay
        </span>
        <h2
          id="steps-title"
          className="display-title mt-5 text-4xl text-sea-ink md:text-5xl"
        >
          Four steps to the shore.
        </h2>
        <p className="mt-4 text-sea-ink-soft">
          From choosing a room to your first swim — here’s how a stay at
          Treasure Island comes together.
        </p>
      </div>

      <ul className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4">
        <ColorBlockPanel
          tone="blush"
          badge="01"
          title="Choose your room"
          body="Browse villas, suites and garden rooms, and find the one that fits your trip."
        >
          <ArchPhoto src="/rooms/suite-bedroom.webp" />
        </ColorBlockPanel>
        <ColorBlockPanel
          tone="deep"
          badge="02"
          title="Book in minutes"
          body="Pick your dates and guests, then confirm online. Your booking is held straight away."
        >
          <BookingPreviewCard />
        </ColorBlockPanel>
        <ColorBlockPanel
          tone="warm"
          badge="03"
          title="Arrive and unwind"
          body="Check in, kick off your shoes and watch the pool light up as the sun goes down."
        >
          <ArchPhoto src="/photos/pool-at-night.webp" />
        </ColorBlockPanel>
        <ColorBlockPanel
          tone="blush"
          badge={<Sparkles size={18} aria-hidden />}
          title="Add the extras"
          body="A boat cruise, a guided horse ride or a table by the water — book them during your stay."
        >
          <ArchPhoto src="/photos/ocean-deck-dining.webp" />
        </ColorBlockPanel>
      </ul>

      <p className="mt-6 text-center text-sm italic text-sea-ink-soft">
        Questions before you book? Our concierge team is one message away.
      </p>
    </section>
  )
}
