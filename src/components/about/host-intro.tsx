import { Link } from '@tanstack/react-router'

import { SectionKicker } from '#/components/shared/section-kicker'
import type { AboutHost } from '#/types/about'

// Host section: arched portrait beside first-person bio, pull-quote, signature.
export function HostIntro({ host }: { host: AboutHost }) {
  return (
    <section className="page-wrap mt-28 grid items-center gap-12 md:grid-cols-2">
      <figure data-reveal className="img-frame img-arch aspect-[4/5] max-w-md">
        <img
          src={host.photo}
          alt={host.photoAlt}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </figure>

      <div>
        <div data-reveal>
          <SectionKicker>Your host</SectionKicker>
          <h2 className="display-title mt-3 text-3xl md:text-4xl">
            Hello, I’m <em>{host.name.split(' ')[0]}</em>.
          </h2>
        </div>
        {host.bioBlocks.map((para, i) => (
          <p key={i} data-reveal className="mt-4 text-sea-ink-soft">
            {para}
          </p>
        ))}
        <blockquote
          data-reveal
          className="mt-6 border-l-2 pl-4 text-lg text-sea-ink"
          style={{ borderColor: 'var(--sunset)' }}
        >
          “{host.quote}”
        </blockquote>
        <p data-reveal className="mt-5">
          <span className="display-title text-lg text-sea-ink">
            {host.name}
          </span>
          <span className="block text-sm text-sea-ink-soft">{host.role}</span>
        </p>
        <Link to="/events" className="btn btn-ghost mt-6 no-underline">
          Plan a stay with us
        </Link>
      </div>
    </section>
  )
}
