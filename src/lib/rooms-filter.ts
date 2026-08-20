import type { Room, RoomCategory } from '#/types'

export interface RoomFilters {
  category?: RoomCategory | 'all'
  guests?: number
  ocean?: boolean
  priceMin?: number
  priceMax?: number
  sort?: 'asc' | 'desc' | 'rec'
}

// Pure, testable filter + sort over the loaded room list (client-side).
export function filterRooms(
  rooms: Array<Room>,
  filters: RoomFilters,
): Array<Room> {
  let out = rooms.filter((room) => {
    if (filters.category && filters.category !== 'all') {
      if (room.category !== filters.category) return false
    }
    if (filters.guests && room.maxGuests < filters.guests) return false
    if (filters.ocean && !room.oceanView) return false
    if (filters.priceMin && room.pricePerNight < filters.priceMin) return false
    if (filters.priceMax && room.pricePerNight > filters.priceMax) return false
    return true
  })

  if (filters.sort === 'asc') {
    out = [...out].sort((a, b) => a.pricePerNight - b.pricePerNight)
  } else if (filters.sort === 'desc') {
    out = [...out].sort((a, b) => b.pricePerNight - a.pricePerNight)
  }
  return out
}

export function hasActiveFilters(filters: RoomFilters): boolean {
  return Boolean(
    (filters.category && filters.category !== 'all') ||
    filters.guests ||
    filters.ocean ||
    filters.priceMin ||
    filters.priceMax ||
    (filters.sort && filters.sort !== 'rec'),
  )
}

// Price bands the UI offers, each mapping to a min/max window.
export const PRICE_BANDS: Array<{
  value: string
  label: string
  min?: number
  max?: number
}> = [
  { value: 'any', label: 'Any price' },
  { value: 'under-800', label: 'Under $800', max: 799 },
  { value: '800-1500', label: '$800 – $1,500', min: 800, max: 1500 },
  { value: '1500-2000', label: '$1,500 – $2,000', min: 1500, max: 2000 },
  { value: '2000-up', label: '$2,000+', min: 2000 },
]

// Which band the current min/max corresponds to (for the select value).
export function priceBandValue(filters: RoomFilters): string {
  const match = PRICE_BANDS.find(
    (b) => b.min === filters.priceMin && b.max === filters.priceMax,
  )
  return match ? match.value : 'any'
}
