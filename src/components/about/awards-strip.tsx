import { SectionKicker } from '#/components/shared/section-kicker'
import type { AboutAward } from '#/types/about'

// Trust strip of awards / press mentions.
export function AwardsStrip({ awards }: { awards: Array<AboutAward> }) {
  return (
    <section className="page-wrap mt-28 text-center">
      <SectionKicker className="justify-center">Recognition</SectionKicker>
      <ul className="mt-6 grid gap-4 sm:grid-cols-3">
        {awards.map((award) => (
          <li
            key={`${award.source}-${award.year}`}
            data-reveal
            className="feature-card rounded-md border border-line p-6"
          >
            <p className="display-title text-lg text-sea-ink">{award.label}</p>
            <p className="mt-1 text-sm text-sea-ink-soft">
              {award.source} · {award.year}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
