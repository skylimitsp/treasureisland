import { SectionKicker } from '#/components/shared/section-kicker'
import { EventTypeCard } from '#/components/events/event-type-card'
import { useEventTypesQuery } from '#/hooks/queries/events.query'
import type { EventCategory } from '#/types'

// Four celebration types we host, each anchoring toward the enquiry form.
export function EventTypes({
  onEnquire,
}: {
  onEnquire: (category: EventCategory) => void
}) {
  const types = useEventTypesQuery()

  return (
    <section className="page-wrap mt-24">
      <div className="max-w-2xl">
        <SectionKicker>What we host</SectionKicker>
        <h2 className="display-title mt-2 text-3xl md:text-4xl">
          A day for every <em>kind</em> of celebration.
        </h2>
      </div>

      {types.isError ? (
        <p className="mt-8 text-destructive">{types.error.message}</p>
      ) : !types.data ? (
        <p className="mt-8 text-sea-ink-soft">Loading celebrations…</p>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {types.data.map((type) => (
            <EventTypeCard key={type.slug} type={type} onEnquire={onEnquire} />
          ))}
        </div>
      )}
    </section>
  )
}
