import { Link } from '@tanstack/react-router'

import { SectionKicker } from '#/components/shared/section-kicker'
import { useEventTeasersQuery } from '#/hooks/queries/events.query'

// Celebrations teaser: wedding / birthday / family cards → /events.
export function EventsTeaser() {
  const events = useEventTeasersQuery()

  return (
    <section className="page-wrap mt-28">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionKicker>Celebrate on the island</SectionKicker>
          <h2 className="display-title mt-2 text-3xl md:text-4xl">
            Weddings &amp; celebrations
          </h2>
        </div>
        <Link to="/events" className="btn btn-primary no-underline">
          Enquire about your event
        </Link>
      </div>

      <ul className="mt-8 grid gap-6 md:grid-cols-3">
        {(events.data ?? []).map((event) => (
          <li key={event.slug}>
            <Link
              to="/events"
              data-reveal
              className="group img-frame relative block aspect-[4/5] overflow-hidden rounded-md border border-line no-underline"
            >
              <img
                src={event.image}
                alt={event.name}
                loading="lazy"
                data-speed="1.08"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, rgba(23,58,64,.74), transparent 60%)',
                }}
                aria-hidden
              />
              <div className="relative z-10 flex h-full flex-col justify-end p-6 text-white">
                <h3 className="display-title text-2xl text-white">
                  {event.name}
                </h3>
                <p className="mt-1 text-sm text-white/85">{event.blurb}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
