import { useState } from 'react'
import {
  ArrowRight,
  Cake,
  Check,
  Heart,
  Presentation,
  Users,
} from 'lucide-react'

import { EventTypeDialog } from '#/components/events/event-type-dialog'
import { FacilityChip } from '#/components/shared/facility-chip'
import type { LucideIcon } from 'lucide-react'
import type { EventCategory, EventType } from '#/types'

// Maps the mock icon name to a concrete lucide component.
const ICONS: Record<string, LucideIcon> = {
  Heart,
  Cake,
  Users,
  Presentation,
}

// One official event type: icon, excerpt, and a modal with the full official copy.
export function EventTypeCard({
  type,
  onEnquire,
}: {
  type: EventType
  onEnquire: (category: EventCategory) => void
}) {
  const [open, setOpen] = useState(false)
  const Icon = ICONS[type.icon] ?? Heart
  const inclusions = type.inclusions ?? []

  return (
    <article
      data-reveal
      className="feature-card flex h-full flex-col rounded-md border border-line p-6"
    >
      <div className="flex items-center gap-3">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-lagoon-deep"
          style={{
            background: 'color-mix(in oklab, var(--lagoon) 18%, white)',
          }}
          aria-hidden
        >
          <Icon size={20} strokeWidth={1.75} />
        </span>
        <p className="island-kicker">{type.name}</p>
      </div>
      <h3 className="display-title mt-4 text-2xl">{type.title}</h3>
      <p className="mt-2 text-sea-ink-soft">{type.blurb}</p>

      {inclusions.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {inclusions.map((item) => (
            <li key={item}>
              <FacilityChip icon={Check}>{item}</FacilityChip>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-6 flex flex-1 items-end">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          className="inline-flex min-h-11 items-center gap-1 font-semibold text-lagoon-deep"
        >
          Read more
          <ArrowRight size={16} strokeWidth={2} aria-hidden />
        </button>
      </div>

      <EventTypeDialog
        type={type}
        open={open}
        onClose={() => setOpen(false)}
        onEnquire={onEnquire}
      />
    </article>
  )
}
