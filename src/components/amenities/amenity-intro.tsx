import { SectionKicker } from '#/components/shared/section-kicker'
import type { Amenity } from '#/types'

// Editorial lead for the detail page — the long-form story of the amenity.
export function AmenityIntro({ amenity }: { amenity: Amenity }) {
  return (
    <section data-reveal>
      <SectionKicker>The experience</SectionKicker>
      <h2 className="display-title mt-2 text-2xl md:text-3xl">
        What to expect
      </h2>
      <p className="mt-4 max-w-prose text-lg leading-relaxed text-sea-ink-soft">
        {amenity.description}
      </p>
    </section>
  )
}
