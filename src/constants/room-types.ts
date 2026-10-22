// The resort's room types, in the order guests see them.
export const ROOM_TYPES = [
  'Penthouses',
  'Apartments',
  'Chalets',
  'Lofts',
  'Suites',
  'Deluxe Rooms with Balcony',
  'Deluxe Rooms',
  'Superior Standard Rooms',
  'Standard Rooms',
] as const

export type RoomType = (typeof ROOM_TYPES)[number]

export const isRoomType = (value: unknown): value is RoomType =>
  ROOM_TYPES.includes(value as RoomType)
