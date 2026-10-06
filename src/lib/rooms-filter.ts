import type { Room, RoomCategory, RoomView } from '#/types'

// Display labels for the official room types.
export const ROOM_CATEGORY_LABELS: Record<RoomCategory, string> = {
  double: 'Double Room',
  family: 'Family Room',
  deluxe: 'Deluxe Room',
}

export const ROOM_VIEWS: Array<RoomView> = ['Beach', 'River', 'Jungle']

export interface RoomFilters {
  category?: RoomCategory | 'all'
  guests?: number
  view?: RoomView
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
    if (filters.view && room.view !== filters.view) return false
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
    filters.view ||
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
  { value: 'under-200', label: 'Under $200', max: 199 },
  { value: '200-500', label: '$200 – $500', min: 200, max: 500 },
  { value: '500-up', label: '$500+', min: 501 },
]

// Which band the current min/max corresponds to (for the select value).
export function priceBandValue(filters: RoomFilters): string {
  const match = PRICE_BANDS.find(
    (b) => b.min === filters.priceMin && b.max === filters.priceMax,
  )
  return match ? match.value : 'any'
}
