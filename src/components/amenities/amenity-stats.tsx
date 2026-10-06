import { SectionKicker } from '#/components/shared/section-kicker'
import { StatTile } from '#/components/shared/stat-tile'
import { useAmenitiesQuery } from '#/hooks/queries/amenities.query'

// Official price list band; renders nothing until priced amenities load.
export function AmenityStats() {
  const amenities = useAmenitiesQuery()
  const priced = (amenities.data ?? []).filter((a) => a.price)

  if (priced.length === 0) return null

  return (
    <section className="page-wrap mt-24">
      <div className="island-shell rounded-md p-8 md:p-10" data-reveal>
        <SectionKicker>Price list</SectionKicker>
        <h2 className="display-title mt-2 text-2xl md:text-3xl">
          Experiences, priced in Ghana cedis.
        </h2>
        <dl className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-4">
          {priced.map((a) => (
            <StatTile
              key={a.slug}
              label={a.priceNote ? `${a.name} · ${a.priceNote}` : a.name}
              value={a.price ?? ''}
            />
          ))}
        </dl>
      </div>
    </section>
  )
}
