import { Link } from '@tanstack/react-router'

import { SectionKicker } from '#/components/shared/section-kicker'
import { PhotoCollage } from '#/components/shared/photo-collage'

// Official resort introduction beside a bento photo layout.
export function EditorialBand() {
  return (
    <section className="page-wrap mt-28 grid items-center gap-12 md:grid-cols-2">
      <PhotoCollage />
      <div data-reveal>
        <SectionKicker>Treasure Island Ada</SectionKicker>
        <h2 className="display-title mt-3 text-3xl leading-tight md:text-4xl">
          Definition of luxury, hospitality and <em>serendipity</em>.
        </h2>
        <p className="mt-5 max-w-prose text-sea-ink-soft">
          A private island resort in its remarkable natural environment situated
          near the estuary of the Atlantic Ocean & Volta River. Constructed with
          contemporary authenticity and style. Built with eco-friendly materials
          that blend seamlessly into our over water bungalows creating a
          sophisticated and intimate ambiance where our guests feel truly at
          home.
        </p>
        <Link to="/about" className="btn btn-ghost mt-7 no-underline">
          Discover the resort
        </Link>
      </div>
    </section>
  )
}
