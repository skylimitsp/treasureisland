import {
  ArrowRight,
  Cake,
  Check,
  Heart,
  Presentation,
  Users,
} from 'lucide-react'

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

// A single celebration type: icon, blurb, "what's included" chips, CTAs.
export function EventTypeCard({
  type,
  onEnquire,
}: {
  type: EventType
  onEnquire: (category: EventCategory) => void
}) {
  const Icon = ICONS[type.icon] ?? Heart

  return (
    <article
      data-reveal
      className="feature-card flex h-full flex-col rounded-md border border-line p-6 md:p-8"
    >
      <span
        className="flex size-12 items-center justify-center rounded-full text-lagoon-deep"
        style={{ background: 'color-mix(in oklab, var(--lagoon) 18%, white)' }}
        aria-hidden
      >
        <Icon size={22} strokeWidth={1.75} />
      </span>
      <h3 className="display-title mt-4 text-2xl">{type.name}</h3>
      <p className="mt-2 text-sea-ink-soft">{type.blurb}</p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {type.inclusions.map((item) => (
          <li key={item}>
            <FacilityChip icon={Check}>{item}</FacilityChip>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-1 items-end">
        <button
          type="button"
          onClick={() => onEnquire(type.category)}
          className="inline-flex items-center gap-1 font-semibold text-lagoon-deep"
        >
          Explore
          <ArrowRight size={16} strokeWidth={2} aria-hidden />
        </button>
      </div>
    </article>
  )
}
