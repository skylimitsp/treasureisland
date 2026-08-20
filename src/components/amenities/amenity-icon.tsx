import { Anchor, Bath, Film, Ship, Utensils } from 'lucide-react'

import type { LucideIcon } from 'lucide-react'
import type { AmenityIcon } from '#/types'

// Maps an amenity's icon token to its lucide glyph (coastal set, design §6).
export const amenityIcons: Record<AmenityIcon, LucideIcon> = {
  utensils: Utensils,
  film: Film,
  bath: Bath,
  anchor: Anchor,
  ship: Ship,
}

// Renders the lucide glyph for an amenity icon token.
export function AmenityGlyph({
  icon,
  size = 20,
  className,
}: {
  icon: AmenityIcon
  size?: number
  className?: string
}) {
  const Icon = amenityIcons[icon]
  return (
    <Icon size={size} strokeWidth={1.5} className={className} aria-hidden />
  )
}
