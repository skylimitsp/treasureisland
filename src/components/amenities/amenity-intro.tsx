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
      {/* A blank line in the copy starts a new paragraph. */}
      {amenity.description.split('\n\n').map((para) => (
        <p
          key={para.slice(0, 24)}
          className="mt-4 max-w-prose text-lg leading-relaxed text-sea-ink-soft"
        >
          {para}
        </p>
      ))}
    </section>
  )
}
