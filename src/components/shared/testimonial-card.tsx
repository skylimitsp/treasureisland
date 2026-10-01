import { Star } from 'lucide-react'

import type { Testimonial } from '#/types'

// A guest quote: warm stars, the quote, then an initials avatar and origin.
export function TestimonialCard({ item }: { item: Testimonial }) {
  const initials = item.name
    .split(/[\s&]+/)
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('')

  return (
    <figure className="flex h-full flex-col rounded-md border border-line bg-white p-7 dark:bg-transparent">
      <div
        className="flex gap-1 text-panel-warm"
        role="img"
        aria-label={`${item.rating} out of 5 stars`}
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
      <blockquote className="mt-5 flex-1 leading-relaxed text-sea-ink">
        “{item.quote}”
      </blockquote>
      <figcaption className="mt-8 flex items-center gap-3">
        <span
          className="flex size-11 items-center justify-center rounded-full bg-sand text-sm font-bold text-sea-ink"
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
