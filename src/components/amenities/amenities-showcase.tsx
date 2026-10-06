import { Link } from '@tanstack/react-router'

import { SectionKicker } from '#/components/shared/section-kicker'
import { useAmenitiesQuery } from '#/hooks/queries/amenities.query'
import { AmenityGlyph } from '#/components/amenities/amenity-icon'
import { ResponsiveImage } from '#/components/shared/responsive-image'

// Showcase: a sticky intro column beside a revealing list of amenity tiles.
export function AmenitiesShowcase() {
  const amenities = useAmenitiesQuery()

  return (
    <section className="page-wrap mt-8 grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
      <div className="md:sticky md:top-28 md:self-start">
        <SectionKicker>Experiences</SectionKicker>
        <h2 className="display-title mt-3 text-3xl leading-tight md:text-4xl">
          Everything the island has to <em>offer</em>.
        </h2>
        <p className="mt-5 text-sea-ink-soft">
          Visit Us any day. Monday through Sunday 24 / 7 to experience our
          various types of services and amenities.
        </p>
        <Link to="/amenities" className="btn btn-ghost mt-7 no-underline">
          Explore all amenities
        </Link>
      </div>

      <ul className="flex flex-col gap-6">
        {(amenities.data ?? []).map((a) => {
          return (
            <li key={a.slug}>
              <Link
                to="/amenities"
                data-reveal
                className="group img-frame relative flex aspect-[16/10] items-end overflow-hidden rounded-md border border-line no-underline"
              >
                {a.image ? (
                  <ResponsiveImage
                    src={a.image}
                    alt={a.imageAlt ?? a.name}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-sea-ink" aria-hidden />
                )}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(23,58,64,.72), transparent 62%)',
                  }}
                  aria-hidden
                />
                <div className="relative z-10 p-6 text-white">
                  <span className="chip mb-3 !border-white/30 !bg-white/15 !text-white">
                    <AmenityGlyph icon={a.icon} size={15} />
                    {a.category}
                  </span>
                  <h3 className="display-title text-2xl text-white">
                    {a.name}
                  </h3>
                  <p className="mt-1 max-w-sm text-sm text-white/85">
                    {a.blurb}
                  </p>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
