import { StatTile } from '#/components/shared/stat-tile'
import { useResortStatsQuery } from '#/hooks/queries/rooms.query'

// Trust band: headline resort numbers that count up on scroll.
export function StatStrip() {
  const stats = useResortStatsQuery()
  if (!stats.data) return null
  const s = stats.data

  return (
    <section className="page-wrap mt-16">
      <dl className="island-shell grid grid-cols-2 gap-6 rounded-md px-6 py-8 md:grid-cols-4 md:px-10">
        <StatTile
          label="Villas & suites"
          value={`${s.rooms}`}
          count={s.rooms}
        />
        <StatTile
          label="Guest rating"
          value={`${s.averageRating}`}
          count={s.averageRating}
          decimals={1}
        />
        <StatTile label="Reviews" value={`${s.reviews}`} count={s.reviews} />
        <StatTile
          label="Private beachfront"
          value={`${s.beachfrontMetres}m`}
          count={s.beachfrontMetres}
          suffix="m"
        />
      </dl>
    </section>
  )
}
