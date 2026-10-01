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
import { SectionKicker } from '#/components/shared/section-kicker'
import { HostIntro } from '#/components/about/host-intro'
import { ValueCard } from '#/components/about/value-card'
import { AboutGallery } from '#/components/about/about-gallery'
import { AwardsStrip } from '#/components/about/awards-strip'
import { Newsletter } from '#/components/shared/newsletter'
import { FixedDivider } from '#/components/shared/fixed-divider'

export const Route = createFileRoute('/about')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(aboutQueryOptions()),
  head: () =>
    seo({
      title: 'About',
      description:
        'The story of Treasure Island — a beachfront resort built around the ' +
        'light, its founder, values, and 340 metres of private shore.',
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

      <AboutThisResort lead={c.lead} story={c.story} />

      <HostIntro host={c.host} />

      <section className="page-wrap mt-28">
        <div className="text-center">
          <SectionKicker className="justify-center">
            What we value
          </SectionKicker>
          <h2 className="display-title mt-2 text-3xl md:text-4xl">
            How we run the island
          </h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {c.values.map((value) => (
            <ValueCard key={value.title} value={value} />
          ))}
        </div>
      </section>

      <AboutGallery images={c.gallery} />
      <AwardsStrip awards={c.awards} />

      <section className="page-wrap mt-28">
        <Newsletter source="about" />
      </section>

      <FixedDivider
        image="/photos/jetski-loop.webp"
        title="Your island is waiting."
        ctaLabel="Explore rooms"
        ctaTo="/rooms"
        ctaLabel2="Plan an event"
        ctaTo2="/events"
      />
    </main>
  )
}
