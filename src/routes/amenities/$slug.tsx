import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { Sparkles } from 'lucide-react'

import { seo } from '#/lib/seo'
import { SITE } from '#/constants/site'
import {
  amenityQueryOptions,
  relatedAmenitiesQueryOptions,
  useAmenityQuery,
} from '#/hooks/queries/amenities.query'
import { useGsap } from '#/hooks/use-gsap'
import { ScrollTrigger } from '#/lib/gsap'
import { parallaxLayers, revealStagger } from '#/lib/animations'
import { AmenityDetailHero } from '#/components/amenities/amenity-detail-hero'
import { AmenityIntro } from '#/components/amenities/amenity-intro'
import { AmenityGallery } from '#/components/amenities/amenity-gallery'
import { AmenityHighlights } from '#/components/amenities/amenity-highlights'
import { AmenityInfoPanel } from '#/components/amenities/amenity-info-panel'
import { SlotRequestCard } from '#/components/amenities/slot-request-card'
import { RelatedAmenities } from '#/components/amenities/related-amenities'
import type { Amenity } from '#/types'

// TouristAttraction node for the amenity — a light schema.org rich result.
function amenityLd(amenity: Amenity, path: string) {
  const url = `${SITE.url}${path}`
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: amenity.name,
    description: amenity.blurb,
    url,
    ...(amenity.hero ? { image: `${SITE.url}${amenity.hero}` } : {}),
    isAccessibleForFree: amenity.priceFrom === null,
    containedInPlace: { '@type': 'Resort', name: SITE.name, url: SITE.url },
  }
}

export const Route = createFileRoute('/amenities/$slug')({
  loader: async ({ context, params }) => {
    try {
      const amenity = await context.queryClient.ensureQueryData(
        amenityQueryOptions(params.slug),
      )
      void context.queryClient.ensureQueryData(
        relatedAmenitiesQueryOptions(params.slug),
      )
      return { amenity }
    } catch {
      throw notFound()
    }
  },
  head: ({ loaderData }) =>
    loaderData
      ? seo({
          title: loaderData.amenity.name,
          description: loaderData.amenity.blurb,
          image: loaderData.amenity.hero || loaderData.amenity.image,
          path: `/amenities/${loaderData.amenity.slug}`,
          type: 'article',
          breadcrumbs: [
            { name: 'Home', path: '/' },
            { name: 'Amenities', path: '/amenities' },
            {
              name: loaderData.amenity.name,
              path: `/amenities/${loaderData.amenity.slug}`,
            },
          ],
          jsonLd: amenityLd(
            loaderData.amenity,
            `/amenities/${loaderData.amenity.slug}`,
          ),
        })
      : seo({ title: 'Amenity', noindex: true }),
  notFoundComponent: () => (
    <main className="page-wrap pt-32 pb-24 text-center">
      <h1 className="display-title text-4xl">Amenity not found</h1>
      <Link to="/amenities" className="btn btn-primary mt-6 no-underline">
        Back to amenities
      </Link>
    </main>
  ),
  component: AmenityDetailPage,
})

function AmenityDetailPage() {
  const { slug } = Route.useParams()
  const amenity = useAmenityQuery(slug)
  const ref = useGsap<HTMLElement>((self) => {
    revealStagger(self)
    parallaxLayers(self)
    window.addEventListener('load', () => ScrollTrigger.refresh(), {
      once: true,
    })
  })

  if (!amenity.data) {
    return (
      <main className="page-wrap pt-32 pb-24 text-center text-sea-ink-soft">
        Loading…
      </main>
    )
  }

  const a = amenity.data

  return (
    <main ref={ref}>
      <AmenityDetailHero amenity={a} />

      <div className="page-wrap--wide py-16">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-14">
            <AmenityIntro amenity={a} />
            <AmenityGallery images={a.gallery} name={a.name} />
            <AmenityHighlights amenity={a} />
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <AmenityInfoPanel amenity={a} />
            {a.bookable ? (
              <SlotRequestCard amenity={a} />
            ) : (
              <div className="island-shell rounded-md p-6">
                <span className="flex text-lagoon-deep" aria-hidden>
                  <Sparkles size={28} strokeWidth={1.5} />
                </span>
                <h2 className="display-title mt-3 text-xl">
                  Included with your stay
                </h2>
                <p className="mt-1 text-sm text-sea-ink-soft">
                  No booking needed — this is complimentary for all guests. Just
                  drop by during opening hours.
                </p>
                <Link
                  to="/rooms"
                  className="btn btn-primary mt-5 w-full no-underline"
                >
                  Plan your stay
                </Link>
              </div>
            )}
          </aside>
        </div>

        <RelatedAmenities slug={slug} />
      </div>
    </main>
  )
}
