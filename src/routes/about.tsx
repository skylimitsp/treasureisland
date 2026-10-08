import { createFileRoute } from '@tanstack/react-router'

import { seo } from '#/lib/seo'
import {
  aboutQueryOptions,
  useAboutContent,
} from '#/hooks/queries/content.query'
import { useGsap } from '#/hooks/use-gsap'
import { ScrollTrigger } from '#/lib/gsap'
import { parallaxLayers, revealStagger } from '#/lib/animations'
import { DetailHeader } from '#/components/about/detail-header'
import { DetailGallery } from '#/components/about/detail-gallery'
import { StayCard } from '#/components/about/stay-card'
import { AboutThisResort } from '#/components/about/about-this-resort'
import { AboutServices } from '#/components/about/about-services'
import { AboutGallery } from '#/components/about/about-gallery'
import { FixedDivider } from '#/components/shared/fixed-divider'

export const Route = createFileRoute('/about')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(aboutQueryOptions()),
  head: () =>
    seo({
      title: 'About',
      description:
        'Welcome to Treasure Island Ada — a private island resort near the ' +
        'estuary of the Atlantic Ocean & Volta River in Ada Foah, Ghana, ' +
        'with chalets, penthouses, a 12D cinema, horse riding and more.',
      path: '/about',
    }),
  component: AboutPage,
})

function AboutPage() {
  const about = useAboutContent()

  const ref = useGsap<HTMLElement>((self) => {
    revealStagger(self)
    parallaxLayers(self)
    window.addEventListener('load', () => ScrollTrigger.refresh(), {
      once: true,
    })
  })

  if (about.isError) {
    return (
      <main className="page-wrap pt-32 pb-24 text-center">
        <p className="text-destructive">{about.error.message}</p>
      </main>
    )
  }
  if (!about.data) {
    return (
      <main className="page-wrap pt-32 pb-24 text-center text-sea-ink-soft">
        Loading…
      </main>
    )
  }

  const c = about.data

  return (
    <main ref={ref}>
      <DetailHeader />

      <div className="page-wrap mt-6 grid items-start gap-6 lg:grid-cols-[1.7fr_1fr]">
        <DetailGallery />
        <aside>
          <StayCard />
        </aside>
      </div>

      <AboutThisResort about={c} />

      <AboutServices services={c.services} />

      <AboutGallery images={c.gallery} />

      <FixedDivider
        image="/photos/island-shore.webp"
        kicker="Book early"
        title="The best place to be."
        ctaLabel="Explore rooms"
        ctaTo="/rooms"
        ctaLabel2="Plan an event"
        ctaTo2="/events"
      />
    </main>
  )
}
