import { ChevronLeft, ChevronRight } from 'lucide-react'

import { TestimonialCard } from '#/components/shared/testimonial-card'
import { useTestimonialsQuery } from '#/hooks/queries/content.query'
import { useCarousel } from '#/hooks/use-carousel'

// Guest reviews as a snap-scrolling carousel with prev/next paging.
export function Testimonials() {
  const testimonials = useTestimonialsQuery()
  const items = testimonials.data ?? []
  const { trackRef, canPrev, canNext, prev, next } =
    useCarousel<HTMLUListElement>(items.length)
  if (!items.length) return null

  return (
    <section className="page-wrap mt-28" aria-labelledby="reviews-title">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2
            id="reviews-title"
            className="display-title text-3xl text-sea-ink md:text-4xl"
          >
            What our guests say
          </h2>
          <p className="mt-3 text-sea-ink-soft">
            Words from guests and partners who have stayed and celebrated with
            us.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={prev}
            disabled={!canPrev}
            aria-label="Previous reviews"
            className="flex size-11 items-center justify-center rounded-full border border-line bg-white text-sea-ink transition-colors hover:border-sea-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={18} aria-hidden />
          </button>
          <button
            type="button"
            onClick={next}
            disabled={!canNext}
            aria-label="Next reviews"
            className="flex size-11 items-center justify-center rounded-full bg-footer text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={18} aria-hidden />
          </button>
        </div>
      </div>

      <ul
        ref={trackRef}
        tabIndex={0}
        className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto rounded-md pb-2 [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lagoon-deep [&::-webkit-scrollbar]:hidden"
        aria-label="Guest reviews (scroll horizontally)"
      >
        {items.map((item) => (
          <li
            key={item.id}
            className="w-[85%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
          >
            <TestimonialCard item={item} />
          </li>
        ))}
      </ul>
    </section>
  )
}
