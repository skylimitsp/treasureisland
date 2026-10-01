import { Link } from '@tanstack/react-router'

import { OverlayCard } from '#/components/shared/overlay-card'
import type { EventTeaser } from '#/types'

// Celebration teaser → /events, rendered as a tall overlay card.
export function EventTeaserCard({ event }: { event: EventTeaser }) {
  return (
    <Link to="/events" data-reveal className="group block no-underline">
      <OverlayCard
        image={event.image}
        tag={event.tag}
        kicker={event.kicker}
        title={event.name}
        body={event.blurb}
        cta={event.cta}
      />
    </Link>
  )
}
