import { SectionKicker } from '#/components/shared/section-kicker'
import type { AboutContent } from '#/types/about'
import { ResponsiveImage } from '#/components/shared/responsive-image'

// The official "Message from Manager" — copy rendered verbatim from content.
export function AboutThisResort({ about }: { about: AboutContent }) {
  const [first, ...rest] = about.paragraphs

  return (
    <section
      className="page-wrap mt-20"
      aria-labelledby="manager-message-title"
    >
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div data-reveal>
          <SectionKicker>{about.kicker}</SectionKicker>
          <h2
            id="manager-message-title"
            className="display-title mt-3 text-3xl leading-tight md:text-4xl"
          >
            {about.title}
          </h2>
          <p className="display-title mt-3 text-xl text-lagoon-deep">
            {about.subtitle}
          </p>
          <p className="island-kicker mt-5 !normal-case leading-relaxed tracking-[0.08em]">
            {about.tagline}
          </p>
          <p className="mt-5 text-sea-ink-soft">{first}</p>
        </div>
        <figure className="img-frame aspect-[5/4]">
          <ResponsiveImage
            sizes="(min-width: 768px) 50vw, 100vw"
            src="/photos/beach-hero.webp"
            alt="Treasure Island Ada, its pool and the beach from above"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </figure>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {rest.map((para) => (
          <p key={para.slice(0, 24)} data-reveal className="text-sea-ink-soft">
            {para}
          </p>
        ))}
      </div>
    </section>
  )
}
