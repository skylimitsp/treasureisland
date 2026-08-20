import { SectionKicker } from '#/components/shared/section-kicker'
import { AmenityRow } from '#/components/amenities/amenity-row'
import { useAmenitiesQuery } from '#/hooks/queries/amenities.query'

// The alternating editorial showcase — one row per amenity, with loading,
// empty, and error states handled inline.
export function AmenityShowcase() {
  const amenities = useAmenitiesQuery()

  return (
    <section id="showcase" className="page-wrap scroll-mt-24 pt-24">
      <div className="max-w-2xl">
        <SectionKicker>Signature experiences</SectionKicker>
        <h2 className="display-title mt-2 text-3xl md:text-4xl">
          A day here is never <em>empty</em>.
        </h2>
        <p className="mt-3 text-sea-ink-soft">
          From the first coffee on the terrace to a jet-ski at golden hour —
          here is everything the island holds.
        </p>
      </div>

      {amenities.isPending ? (
        <div className="mt-16 space-y-16">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="grid gap-8 md:grid-cols-2 md:gap-12">
              <div className="aspect-[4/3] animate-pulse rounded-md bg-black/5" />
              <div className="space-y-3">
                <div className="h-6 w-1/2 animate-pulse rounded-md bg-black/5" />
                <div className="h-4 w-full animate-pulse rounded-md bg-black/5" />
                <div className="h-4 w-2/3 animate-pulse rounded-md bg-black/5" />
              </div>
            </div>
          ))}
        </div>
      ) : amenities.isError ? (
        <div className="island-shell mt-12 rounded-md p-6 text-center">
          <p className="text-sea-ink-soft">{amenities.error.message}</p>
          <button
            className="btn btn-ghost mt-4"
            onClick={() => amenities.refetch()}
          >
            Try again
          </button>
        </div>
      ) : amenities.data.length === 0 ? (
        <div className="island-shell mt-12 rounded-md p-8 text-center text-sea-ink-soft">
          Our experiences are being refreshed — please check back soon.
        </div>
      ) : (
        <div className="mt-16 space-y-20 md:space-y-28">
          {amenities.data.map((amenity, i) => (
            <AmenityRow key={amenity.slug} amenity={amenity} index={i} />
          ))}
        </div>
      )}
    </section>
  )
}
