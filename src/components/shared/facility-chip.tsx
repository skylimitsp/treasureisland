import type { LucideIcon } from 'lucide-react'

// Rounded outline chip with an icon + label (room specs, facilities).
export function FacilityChip({
  icon: Icon,
  children,
}: {
  icon: LucideIcon
  children: React.ReactNode
}) {
  return (
    <span className="chip">
      <Icon size={15} strokeWidth={1.75} aria-hidden />
      {children}
    </span>
  )
}
