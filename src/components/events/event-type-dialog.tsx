import { useEffect, useRef } from 'react'
import { ArrowRight, Check, X } from 'lucide-react'

import { FacilityChip } from '#/components/shared/facility-chip'
import type { EventCategory, EventType } from '#/types'

// Full official copy for one event type; native <dialog> gives focus trap + Escape.
export function EventTypeDialog({
  type,
  open,
  onClose,
  onEnquire,
}: {
  type: EventType
  open: boolean
  onClose: () => void
  onEnquire: (category: EventCategory) => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const inclusions = type.inclusions ?? []
  const titleId = `event-type-${type.slug}-title`

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="m-auto max-h-[85vh] w-[calc(100%-2rem)] max-w-xl overflow-hidden rounded-md border border-line bg-[color:var(--foam)] p-0 text-sea-ink shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <div className="flex max-h-[85vh] flex-col">
        <header className="flex items-start justify-between gap-4 border-b border-line p-6">
          <div>
            <p className="island-kicker">{type.name}</p>
            <h2
              id={titleId}
              className="display-title mt-2 text-2xl md:text-3xl"
            >
              {type.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-11 shrink-0 items-center justify-center rounded-full text-sea-ink hover:bg-black/5"
          >
            <X size={18} aria-hidden />
          </button>
        </header>

        <div className="space-y-4 overflow-y-auto p-6 text-sea-ink-soft">
          {type.description.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
          {inclusions.length > 0 ? (
            <ul className="flex flex-wrap gap-2 pt-2">
              {inclusions.map((item) => (
                <li key={item}>
                  <FacilityChip icon={Check}>{item}</FacilityChip>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <footer className="flex justify-end gap-3 border-t border-line p-4">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              // Release the modal and scroll lock first so the page can scroll to the form.
              ref.current?.close()
              document.body.style.overflow = ''
              onEnquire(type.category)
            }}
          >
            Enquire
            <ArrowRight size={16} strokeWidth={2} aria-hidden />
          </button>
        </footer>
      </div>
    </dialog>
  )
}
