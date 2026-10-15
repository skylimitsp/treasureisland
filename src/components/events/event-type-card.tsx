import { useState } from 'react'

import { EventTypeDialog } from '#/components/events/event-type-dialog'
import { OverlayCard } from '#/components/shared/overlay-card'
import type { EventCategory, EventType } from '#/types'

// One official event type as a tall video/photo overlay card; opens a modal
// with the full official copy.
export function EventTypeCard({
  type,
  onEnquire,
}: {
  type: EventType
  onEnquire: (category: EventCategory) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        data-reveal
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="group block w-full text-left"
      >
        <OverlayCard
          image={type.image ?? type.gallery[0]}
          video={type.video}
          tag="Ada Foah"
          kicker={type.name}
          title={type.title}
          body={type.blurb}
          cta="Read more"
        />
      </button>

      <EventTypeDialog
        type={type}
        open={open}
        onClose={() => setOpen(false)}
        onEnquire={onEnquire}
      />
    </>
  )
}
