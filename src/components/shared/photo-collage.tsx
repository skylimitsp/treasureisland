import { Star } from 'lucide-react'

import { useResortStatsQuery } from '#/hooks/queries/rooms.query'

// Bento layout: tall arched lead photo, two stacked frames, a rating badge.
export function PhotoCollage() {
  const stats = useResortStatsQuery()

  return (
    <div className="relative grid h-[30rem] grid-cols-[1.15fr_1fr] grid-rows-2 gap-4 md:h-[36rem]">
      <figure
        data-reveal
        className="img-frame img-arch row-span-2 overflow-hidden"
      >
        <img
          src="/photos/infinity-lounge.webp"
          alt="Loungers on the infinity deck above the sea"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </figure>
      <figure data-reveal className="img-frame overflow-hidden">
        <img
          src="/photos/palm-pool-aerial.webp"
          alt="Palm-lined pool from above"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </figure>
      <figure data-reveal className="img-frame overflow-hidden">
        <img
          src="/photos/ocean-deck-dining.webp"
          alt="Dining on the ocean deck at sunset"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </figure>

      {stats.data ? (
        <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-md border border-line bg-white px-4 py-3 shadow-lg dark:bg-footer">
          <span className="display-title text-3xl text-sea-ink">
            {stats.data.averageRating}
          </span>
          <span>
            <span className="flex text-panel-warm" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
              ))}
            </span>
            <span className="block text-xs text-sea-ink-soft">
              from {stats.data.reviews.toLocaleString('en-US')} guest reviews
            </span>
          </span>
        </div>
      ) : null}
    </div>
  )
}
