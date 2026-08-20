import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string
  icon: LucideIcon
  hint?: string
}

// KPI tile for the admin dashboard.
export function StatCard({ label, value, icon: Icon, hint }: StatCardProps) {
  return (
    <div className="island-shell rounded-md p-5">
      <div className="flex items-center justify-between">
        <span className="island-kicker">{label}</span>
        <span className="flex size-9 items-center justify-center rounded-full bg-lagoon/12 text-lagoon-deep">
          <Icon size={18} aria-hidden />
        </span>
      </div>
      <p className="display-title mt-3 text-3xl text-sea-ink">{value}</p>
      {hint ? <p className="mt-1 text-xs text-sea-ink-soft">{hint}</p> : null}
    </div>
  )
}
