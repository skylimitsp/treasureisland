import { SectionKicker } from '#/components/shared/section-kicker'
import { RelatedAmenityCard } from '#/components/amenities/related-amenity-card'
import { useRelatedAmenitiesQuery } from '#/hooks/queries/amenities.query'

// Cross-links to the other amenities; hidden while empty or on error.
export function RelatedAmenities({ slug }: { slug: string }) {
  const related = useRelatedAmenitiesQuery(slug)

  if (related.isPending) {
    return (
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[4/3] animate-pulse rounded-md bg-black/5"
          />
        ))}
      </div>
    )
  }

  if (related.isError || !related.data.length) return null

  return (
    <section className="mt-20">
      <SectionKicker>More to explore</SectionKicker>
      <h2 className="display-title mt-2 text-2xl md:text-3xl">
        Keep discovering the island
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {related.data.map((amenity) => (
          <RelatedAmenityCard key={amenity.slug} amenity={amenity} />
        ))}
      </div>
    </section>
  )
}
