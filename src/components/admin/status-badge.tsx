import { cn } from '#/lib/utils'

export type BadgeTone = 'positive' | 'warning' | 'danger' | 'info' | 'neutral'

const TONE_CLASS: Record<BadgeTone, string> = {
  positive: 'text-palm border-palm/30 bg-palm/10',
  warning: 'text-sunset-deep border-sunset/40 bg-sunset/10',
  danger: 'text-red-600 border-red-500/30 bg-red-500/10',
  info: 'text-lagoon-deep border-lagoon/40 bg-lagoon/10',
  neutral: 'text-sea-ink-soft border-line bg-black/5',
}

// Derives a sensible tone from common domain status strings.
const STATUS_TONE: Partial<Record<string, BadgeTone>> = {
  confirmed: 'positive',
  subscribed: 'positive',
  checked_in: 'info',
  contacted: 'info',
  pending: 'warning',
  new: 'warning',
  cancelled: 'danger',
  closed: 'neutral',
}

const LABELS: Partial<Record<string, string>> = {
  checked_in: 'checked in',
}

interface StatusBadgeProps {
  status: string
  tone?: BadgeTone
}

// Compact status pill used across every admin table.
export function StatusBadge({ status, tone }: StatusBadgeProps) {
  const resolved = tone ?? STATUS_TONE[status] ?? 'neutral'
  const label = LABELS[status] ?? status
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize',
        TONE_CLASS[resolved],
      )}
    >
      {label}
    </span>
  )
}
