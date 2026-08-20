import { StatTile } from '#/components/shared/stat-tile'

// Headline celebration stats; the numbers count up on scroll (see countUp).
export function EventsStatStrip() {
  return (
    <section className="page-wrap mt-24">
      <dl
        data-reveal
        className="island-shell grid grid-cols-2 gap-6 rounded-md p-8 text-center md:grid-cols-3"
      >
        <StatTile
          label="Celebrations hosted"
          value="120"
          count={120}
          suffix="+"
        />
        <StatTile
          label="Average rating"
          value="4.9"
          count={4.9}
          decimals={1}
          suffix="★"
        />
        <StatTile label="Sunsets a year" value="60" count={60} />
      </dl>
    </section>
  )
}
