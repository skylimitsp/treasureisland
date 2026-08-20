import { Link } from '@tanstack/react-router'

import { SectionKicker } from '#/components/shared/section-kicker'
import { PhotoCollage } from '#/components/shared/photo-collage'

// "Upgrade your experience" — editorial copy beside a photo collage.
export function EditorialBand() {
  return (
    <section className="page-wrap mt-28 grid items-center gap-12 md:grid-cols-2">
      <PhotoCollage />
      <div data-reveal>
        <SectionKicker>The island life</SectionKicker>
        <h2 className="display-title mt-3 text-3xl leading-tight md:text-4xl">
          Upgrade your escape into something <em>unforgettable</em>.
        </h2>
        <p className="mt-5 max-w-prose text-sea-ink-soft">
          Treasure Island is a private stretch of white sand where the lagoon
          meets the sky. Wake to the water, dine at its edge, and let the days
          slow to the rhythm of the tide — every detail crafted, nothing rushed.
        </p>
        <Link to="/about" className="btn btn-ghost mt-7 no-underline">
          Discover the resort
        </Link>
      </div>
    </section>
  )
}
