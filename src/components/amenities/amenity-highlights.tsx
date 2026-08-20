import { Check } from 'lucide-react'

import { SectionKicker } from '#/components/shared/section-kicker'
import type { Amenity } from '#/types'

// Highlights as a checked list — the headline features of the amenity.
export function AmenityHighlights({ amenity }: { amenity: Amenity }) {
  return (
    <section data-reveal>
      <SectionKicker>Highlights</SectionKicker>
      <h2 className="display-title mt-2 text-2xl md:text-3xl">
        Why guests love it
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {amenity.highlights.map((h) => (
          <li key={h} className="flex items-center gap-3 text-sea-ink">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-lagoon/15 text-lagoon-deep">
              <Check size={14} strokeWidth={2} aria-hidden />
            </span>
            {h}
          </li>
        ))}
      </ul>
    </section>
  )
}
