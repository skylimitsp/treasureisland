import { SectionKicker } from '#/components/shared/section-kicker'
import { StatTile } from '#/components/shared/stat-tile'

// "What's included" band — count-up figures on a tinted glass strip.
const STATS = [
  { label: 'Signature experiences', value: '6', count: 6 },
  { label: 'On the water', value: '2', count: 2 },
  { label: 'In-room dining', value: '24/7' },
  { label: 'Private beach', value: '800m', count: 800, suffix: 'm' },
]

export function AmenityStats() {
  return (
    <section className="page-wrap mt-24">
      <div className="island-shell rounded-md p-8 md:p-10" data-reveal>
        <SectionKicker>What’s included</SectionKicker>
        <h2 className="display-title mt-2 text-2xl md:text-3xl">
          Barefoot luxury, all the way through.
        </h2>
        <dl className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map((s) => (
            <StatTile
              key={s.label}
              label={s.label}
              value={s.value}
              count={s.count}
              suffix={s.suffix}
            />
          ))}
        </dl>
      </div>
    </section>
  )
}
