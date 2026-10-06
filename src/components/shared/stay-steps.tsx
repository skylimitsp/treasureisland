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
          Treasure Island Ada comes together.
        </p>
      </div>

      <ul className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4">
        <ColorBlockPanel
          tone="blush"
          badge="01"
          title="Choose your room"
          body="From home-style chalets and standard rooms to waterfront rooms, suites with balconies and penthouses."
        >
          <ArchPhoto src="/rooms/suite-bedroom.webp" />
        </ColorBlockPanel>
        <ColorBlockPanel
          tone="deep"
          badge="02"
          title="Book early"
          body="Pick your dates and guests, then call, WhatsApp or email our reservations team to confirm."
        >
          <BookingPreviewCard />
        </ColorBlockPanel>
        <ColorBlockPanel
          tone="warm"
          badge="03"
          title="Arrive and unwind"
          body="Cross the river to the island and settle in — we’re open 24 hours, and a warm welcome awaits you."
        >
          <ArchPhoto src="/photos/pool-at-night.webp" />
        </ColorBlockPanel>
        <ColorBlockPanel
          tone="blush"
          badge={<Sparkles size={18} aria-hidden />}
          title="Add the extras"
          body="A boat cruise or jet ski, horse riding, the 12D cinema or a jacuzzi bath — add them during your stay."
        >
          <ArchPhoto src="/photos/ocean-deck-dining.webp" />
        </ColorBlockPanel>
      </ul>

      <p className="mt-6 text-center text-sm italic text-sea-ink-soft">
        Questions before you book? Call (+233)-055-270-1946 — we’re open 24
        hours.
      </p>
    </section>
  )
}
