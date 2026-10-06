import { useEffect, useRef } from 'react'
import { CheckCircle2 } from 'lucide-react'

import type { SlotRequest } from '#/types'

// Success panel shown after a slot request is sent; takes focus on mount.
export function SlotRequestConfirmation({
  request,
  onReset,
}: {
  request: SlotRequest
  onReset: () => void
}) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <div className="island-shell rounded-md p-6" aria-live="polite">
      <span className="flex text-palm" aria-hidden>
        <CheckCircle2 size={36} strokeWidth={1.5} />
      </span>
      <h3
        ref={headingRef}
        tabIndex={-1}
        className="display-title mt-3 text-xl outline-none"
      >
        Request received
      </h3>
      <p className="mt-1 text-sm text-sea-ink-soft">
        Reference <strong>{request.id}</strong>, sent with {request.email}.
        Nothing is charged and no slot is held yet.
      </p>

      <dl className="mt-4 space-y-1 border-t border-line pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-sea-ink-soft">Experience</dt>
          <dd>{request.amenityName}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-sea-ink-soft">Date</dt>
          <dd>{request.date}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-sea-ink-soft">Slot</dt>
          <dd>{request.slot}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-sea-ink-soft">Party</dt>
          <dd>
            {request.partySize} {request.partySize === 1 ? 'guest' : 'guests'}
          </dd>
        </div>
      </dl>

      <button className="btn btn-ghost mt-5 w-full" onClick={onReset}>
        Make another request
      </button>
    </div>
  )
}
