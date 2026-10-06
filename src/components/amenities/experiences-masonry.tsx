import { Link } from '@tanstack/react-router'

import { SectionKicker } from '#/components/shared/section-kicker'
import { ExperienceTile } from '#/components/amenities/experience-tile'
import { useAmenitiesQuery } from '#/hooks/queries/amenities.query'

// Masonry: 8 tiles → 2 1 1 / 1 2 1 / 2 2; 6 → 2 1 1 / 1 2 1; other counts go
// first/last-wide. Wide spans are md+ only, so mobile is a uniform 2-col grid.
const WIDE: Partial<Record<number, Array<number>>> = {
  6: [0, 4],
  8: [0, 4, 6, 7],
}

function tileClass(i: number, n: number): string {
  const wide = WIDE[n]
  if (wide) return wide.includes(i) ? 'md:col-span-2' : ''
  const need = (4 - (n % 4)) % 4
  return i === 0 || (need >= 2 && i === n - 1) ? 'md:col-span-2' : ''
}

export function ExperiencesMasonry() {
  const amenities = useAmenitiesQuery()
  const gridCls =
    'mt-8 grid grid-cols-2 gap-5 [grid-auto-rows:13rem] md:grid-cols-4 md:[grid-auto-rows:15rem]'

  return (
    <section className="page-wrap mt-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionKicker>Experiences</SectionKicker>
          <h2 className="display-title mt-2 text-3xl md:text-4xl">
            Everything the island has to offer
          </h2>
        </div>
        <Link to="/amenities" className="btn btn-ghost no-underline">
          Explore all amenities
        </Link>
      </div>

      {amenities.isPending ? (
        <div className={gridCls}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`animate-pulse rounded-md bg-black/5 ${tileClass(i, 8)}`}
            />
          ))}
        </div>
      ) : amenities.isError ? (
        <div className="island-shell mt-8 rounded-md p-6 text-center">
          <p className="text-sea-ink-soft">{amenities.error.message}</p>
          <button
            className="btn btn-ghost mt-4"
            onClick={() => amenities.refetch()}
          >
            Try again
          </button>
        </div>
      ) : amenities.data.length === 0 ? null : (
        <ul className={gridCls}>
          {amenities.data.map((amenity, i) => (
            <li
              key={amenity.slug}
              className={tileClass(i, amenities.data.length)}
            >
              <ExperienceTile amenity={amenity} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
