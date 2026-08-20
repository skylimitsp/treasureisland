import { useEffect, useRef } from 'react'
import { CheckCircle2 } from 'lucide-react'

import type { EventEnquiry } from '#/types'

const TYPE_LABELS: Record<string, string> = {
  weddings: 'Wedding',
  birthdays: 'Birthday',
  family: 'Family party',
  meetings: 'Meeting',
}

// Success panel shown after an enquiry is submitted; takes focus on mount.
export function EnquiryConfirmation({ enquiry }: { enquiry: EventEnquiry }) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <div className="island-shell rounded-md p-6 md:p-8" aria-live="polite">
      <span
        className="flex size-12 items-center justify-center rounded-full text-palm"
        aria-hidden
      >
        <CheckCircle2 size={40} strokeWidth={1.5} />
      </span>
      <h3
        ref={headingRef}
        tabIndex={-1}
        className="display-title mt-4 text-2xl outline-none"
      >
        Enquiry received — thank you.
      </h3>
      <p className="mt-2 text-sea-ink-soft">
        Our events team will reply within 48 hours with a tailored proposal.
        This is an enquiry, not a confirmed booking — nothing has been charged.
      </p>

      <dl className="mt-6 grid gap-3 border-t border-line pt-6 text-sm sm:grid-cols-2">
        <div>
          <dt className="island-kicker">Reference</dt>
          <dd className="mt-1 font-semibold text-sea-ink">{enquiry.id}</dd>
        </div>
        <div>
          <dt className="island-kicker">Celebration</dt>
          <dd className="mt-1 text-sea-ink">
            {TYPE_LABELS[enquiry.eventType] ?? enquiry.eventType}
          </dd>
        </div>
        <div>
          <dt className="island-kicker">Preferred date</dt>
          <dd className="mt-1 text-sea-ink">
            {enquiry.date}
            {enquiry.flexibleDates ? ' (flexible)' : ''}
          </dd>
        </div>
        <div>
          <dt className="island-kicker">Guests</dt>
          <dd className="mt-1 text-sea-ink">{enquiry.guests}</dd>
        </div>
      </dl>

      <p className="mt-6 text-sm text-sea-ink-soft">
        Keep your reference <strong>{enquiry.id}</strong> handy — we will quote
        it when we reply to {enquiry.email}.
      </p>
    </div>
  )
}
