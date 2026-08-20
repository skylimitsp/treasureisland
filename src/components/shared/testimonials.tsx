import { SectionKicker } from '#/components/shared/section-kicker'
import { TestimonialCard } from '#/components/shared/testimonial-card'
import { useTestimonialsQuery } from '#/hooks/queries/content.query'

// Social-proof grid of guest testimonials.
export function Testimonials() {
  const testimonials = useTestimonialsQuery()
  if (!testimonials.data?.length) return null

  return (
    <section className="page-wrap mt-28">
      <div className="text-center">
        <SectionKicker className="justify-center">Kind words</SectionKicker>
        <h2 className="display-title mt-2 text-3xl md:text-4xl">
          Lovely words from our guests
        </h2>
      </div>
      <ul className="mt-10 grid gap-6 md:grid-cols-2">
        {testimonials.data.map((item) => (
          <li key={item.id}>
            <TestimonialCard item={item} />
          </li>
        ))}
      </ul>
    </section>
  )
}
