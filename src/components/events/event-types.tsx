import { SectionKicker } from '#/components/shared/section-kicker'
import { EventTypeCard } from '#/components/events/event-type-card'
import { useEventTypesQuery } from '#/hooks/queries/events.query'
import type { EventCategory } from '#/types'

// The four official event types, each anchoring toward the enquiry form.
export function EventTypes({
  onEnquire,
}: {
  onEnquire: (category: EventCategory) => void
}) {
  const types = useEventTypesQuery()

  return (
    <section className="page-wrap mt-24">
      <div className="max-w-2xl">
        <SectionKicker>Events &amp; Meetings</SectionKicker>
        <h2 className="display-title mt-2 text-3xl md:text-4xl">
          What we <em>host</em>.
        </h2>
      </div>

      {types.isError ? (
        <p className="mt-8 text-destructive">{types.error.message}</p>
      ) : !types.data ? (
        <p className="mt-8 text-sea-ink-soft">Loading events…</p>
      ) : types.data.length === 0 ? (
        <p className="mt-8 text-sea-ink-soft">
          Event details are on their way — send us an enquiry below.
        </p>
      ) : (
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {types.data.map((type) => (
            <EventTypeCard key={type.slug} type={type} onEnquire={onEnquire} />
          ))}
        </div>
      )}
    </section>
  )
}
