import type { ReactNode } from 'react'

interface AdminPageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
}

// Consistent page title + primary action row for admin modules.
export function AdminPageHeader({
  title,
  description,
  action,
}: AdminPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="display-title text-3xl text-sea-ink">{title}</h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm text-sea-ink-soft">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="flex items-center gap-2">{action}</div> : null}
    </div>
  )
}
