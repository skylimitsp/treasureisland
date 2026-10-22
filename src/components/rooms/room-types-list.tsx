import { BedDouble } from 'lucide-react'

import { FacilityChip } from '#/components/shared/facility-chip'
import { ROOM_TYPES } from '#/constants/room-types'

// The resort's room types as chips, shown while the room listing is off.
export function RoomTypesList({ className = '' }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-3 ${className}`}>
      {ROOM_TYPES.map((type) => (
        <li key={type}>
          <FacilityChip icon={BedDouble}>{type}</FacilityChip>
        </li>
      ))}
    </ul>
  )
}
