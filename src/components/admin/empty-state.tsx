import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  message?: string
  action?: ReactNode
}

// Shared empty-state panel for admin tables and lists.
export function EmptyState({
  icon: Icon,
  title,
  message,
  action,
}: EmptyStateProps) {
  return (
    <div className="island-shell flex flex-col items-center rounded-md px-6 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-black/5 text-sea-ink-soft">
        <Icon size={22} aria-hidden />
      </span>
      <h3 className="display-title mt-4 text-lg text-sea-ink">{title}</h3>
      {message ? (
        <p className="mt-1 max-w-sm text-sm text-sea-ink-soft">{message}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}
