import { SectionKicker } from '#/components/shared/section-kicker'

// "About this hotel" block: editorial copy beside a single rounded image.
export function AboutThisResort({
  lead,
  story,
}: {
  lead: string
  story: Array<string>
}) {
  return (
    <section className="page-wrap mt-20 grid items-center gap-12 md:grid-cols-2">
      <div data-reveal>
        <SectionKicker>About the resort</SectionKicker>
        <h2 className="display-title mt-3 text-3xl leading-tight md:text-4xl">
          Barefoot luxury, built around the <em>light</em>.
        </h2>
        <p className="mt-5 text-sea-ink-soft">{lead}</p>
        <p className="mt-3 text-sea-ink-soft">{story[0]}</p>
      </div>
      <figure className="img-frame aspect-[5/4]">
        <img
          src="/heroes/escape.jpg"
          alt="Aerial view of Treasure Island resort"
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </figure>
    </section>
  )
}
