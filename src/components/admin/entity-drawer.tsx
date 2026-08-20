import { X } from 'lucide-react'
import type { ReactNode } from 'react'

interface EntityDrawerProps {
  open: boolean
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
}

// Right-side sheet for admin detail and edit surfaces.
export function EntityDrawer({
  open,
  title,
  description,
  onClose,
  children,
}: EntityDrawerProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[55]">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-[color:var(--foam)] shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line p-5">
          <div>
            <h2 className="display-title text-xl text-sea-ink">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm text-sea-ink-soft">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-9 items-center justify-center rounded-full border border-line text-sea-ink"
          >
            <X size={18} aria-hidden />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </aside>
    </div>
  )
}
