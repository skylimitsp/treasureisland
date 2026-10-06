import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { EventTeaserCard } from '#/components/events/event-teaser-card'
import { SectionKicker } from '#/components/shared/section-kicker'
import { useEventTeasersQuery } from '#/hooks/queries/events.query'

// Events teaser: tall overlay cards for weddings, birthdays, family parties → /events.
export function EventsTeaser() {
  const events = useEventTeasersQuery()

  return (
    <section className="page-wrap mt-28">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionKicker>Events &amp; Meetings</SectionKicker>
          <h2 className="display-title mt-2 text-3xl md:text-4xl">
            Weddings &amp; parties
          </h2>
        </div>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 font-semibold text-panel-warm no-underline hover:text-sunset-deep"
        >
          Enquire about your event
          <ArrowRight size={16} aria-hidden />
        </Link>
      </div>

      <ul className="mt-10 grid gap-6 md:grid-cols-3">
        {(events.data ?? []).map((event) => (
          <li key={event.slug}>
            <EventTeaserCard event={event} />
          </li>
        ))}
      </ul>
    </section>
  )
}
