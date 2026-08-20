import { Star } from 'lucide-react'

import type { Testimonial } from '#/types'

// A guest quote with gold stars and an initials avatar.
export function TestimonialCard({ item }: { item: Testimonial }) {
  const initials = item.name
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')

  return (
    <figure
      data-reveal
      className="feature-card flex h-full flex-col rounded-md border border-line p-6"
    >
      <div
        className="flex gap-1 text-gold"
        aria-label={`${item.rating} out of 5`}
      >
        {Array.from({ length: item.rating }).map((_, i) => (
          <Star
            key={i}
            size={16}
            fill="currentColor"
            strokeWidth={0}
            aria-hidden
          />
        ))}
      </div>
      <blockquote className="mt-4 flex-1 text-sea-ink">
        “{item.quote}”
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span
          className="flex size-10 items-center justify-center rounded-full bg-lagoon-deep text-sm font-semibold text-white"
          aria-hidden
        >
          {initials}
        </span>
        <span>
          <span className="block font-semibold text-sea-ink">{item.name}</span>
          <span className="block text-sm text-sea-ink-soft">{item.origin}</span>
        </span>
      </figcaption>
    </figure>
  )
}
