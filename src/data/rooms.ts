import type {
  Booking,
  BookingInput,
  BookingStatus,
  ResortStats,
  Room,
  RoomAvailability,
} from '#/types'

// Mock room inventory — titles/pricing from the resort's own site. Rooms using
// the official Treasure Island photography are ordered first. The API swap seam:
// replace these accessors with `httpClient` calls; hooks stay unchanged.
const ROOMS: Array<Room> = [
  {
    id: 'r1',
    slug: 'two-bedroom-penthouse',
    name: '2 Bedroom Penthouse',
    category: 'double',
    description:
      'A top-floor penthouse with two bedrooms, floor-to-ceiling glass, and an ' +
      'open living space that looks straight out over the lagoon.',
    pricePerNight: 750,
    maxGuests: 4,
    sizeSqm: 120,
    beds: '2 king',
    amenities: [
      'Ocean view',
      'Living area',
      'Coffee & tea',
      'Air conditioning',
    ],
    image: '/rooms/garden-view.webp',
    oceanView: true,
  },
  {
    id: 'r2',
    slug: 'two-bedroom-penthouse-suite',
    name: '2 Bedroom Penthouse Suite',
    category: 'double',
    description:
      'Our grandest penthouse — two bedrooms, a separate lounge, and a wrap of ' +
      'windows framing the water on two sides.',
    pricePerNight: 850,
    maxGuests: 4,
    sizeSqm: 130,
    beds: '2 king',
    amenities: ['Ocean view', 'Private lounge', 'Minibar', 'Rain shower'],
    image: '/rooms/living-area.webp',
    oceanView: true,
  },
  {
    id: 'r6',
    slug: 'suite-with-balcony',
    name: 'Suite With Balcony',
    category: 'double',
    description:
      'A bright suite opening onto a private balcony — the easiest place on the ' +
      'island to watch the sun go down.',
    pricePerNight: 480,
    maxGuests: 2,
    sizeSqm: 75,
    beds: '1 king',
    amenities: ['Private balcony', 'Ocean view', 'Minibar', 'Rain shower'],
    image: '/rooms/suite-bedroom.webp',
    oceanView: true,
  },
  {
    id: 'r7',
    slug: 'deluxe-room-superior',
    name: 'Deluxe Room Superior',
    category: 'double',
    description:
      'A refined deluxe room with a king bed and a calm, contemporary finish — ' +
      'comfort for a couple, steps from the sand.',
    pricePerNight: 225,
    maxGuests: 2,
    sizeSqm: 55,
    beds: '1 king',
    amenities: ['Ocean view', 'Coffee & tea', 'Air conditioning', 'Wi-Fi'],
    image: '/rooms/kitchenette.webp',
    oceanView: true,
  },
  {
    id: 'r3',
    slug: 'three-bedroom-suite',
    name: '3 Bedroom Suite',
    category: 'family',
    description:
      'A spacious family suite with three bedrooms and a shared living room — ' +
      'room to gather, and quiet corners for everyone.',
    pricePerNight: 720,
    maxGuests: 6,
    sizeSqm: 160,
    beds: '3 queen',
    amenities: ['Family sized', 'Living room', 'Breakfast', 'Wi-Fi'],
    image: '/rooms/room-1.webp',
    oceanView: true,
  },
  {
    id: 'r4',
    slug: 'three-bedroom-chalet',
    name: '3 Bedroom Chalet',
    category: 'family',
    description:
      'A garden chalet for larger parties — three bedrooms, natural textures, ' +
      'and a shaded veranda a short walk from the shore.',
    pricePerNight: 570,
    maxGuests: 6,
    sizeSqm: 150,
    beds: '3 queen',
    amenities: ['Private veranda', 'Garden setting', 'Breakfast', 'Wi-Fi'],
    image: '/rooms/room-2.webp',
    oceanView: false,
  },
  {
    id: 'r5',
    slug: 'two-bedroom-chalet',
    name: '2 Bedroom Chalet',
    category: 'family',
    description:
      'A cosy two-bedroom chalet tucked into the palms, ideal for a small ' +
      'family or friends travelling together.',
    pricePerNight: 650,
    maxGuests: 4,
    sizeSqm: 110,
    beds: '2 queen',
    amenities: ['Garden setting', 'Coffee & tea', 'Air conditioning', 'Wi-Fi'],
    image: '/rooms/room-3.webp',
    oceanView: false,
  },
  {
    id: 'r8',
    slug: 'deluxe-room',
    name: 'Deluxe Room',
    category: 'deluxe',
    description:
      'A serene deluxe room — everything you need for a restful stay, warmly ' +
      'finished and quietly private.',
    pricePerNight: 195,
    maxGuests: 2,
    sizeSqm: 45,
    beds: '1 queen',
    amenities: ['Coffee & tea', 'Air conditioning', 'Rain shower', 'Wi-Fi'],
    image: '/rooms/room-5.webp',
    oceanView: false,
  },
  {
    id: 'r9',
    slug: 'standard-twin-room',
    name: 'Standard Twin Room',
    category: 'deluxe',
    description:
      'A comfortable twin room for friends or colleagues — simple, spotless, ' +
      'and close to everything the island has to offer.',
    pricePerNight: 165,
    maxGuests: 2,
    sizeSqm: 40,
    beds: '2 twin',
    amenities: ['Coffee & tea', 'Air conditioning', 'Wi-Fi', 'Daily service'],
    image: '/rooms/room-6.webp',
    oceanView: false,
  },
]

export function getRooms(): Array<Room> {
  return ROOMS
}

export function getRoomBySlug(slug: string): Room | undefined {
  return ROOMS.find((room) => room.slug === slug)
}

export function getRoomById(id: string): Room | undefined {
  return ROOMS.find((room) => room.id === id)
}

// Mock price edit from the admin Rooms module; hooks stay unchanged on API swap.
export function updateRoom(
  id: string,
  patch: Partial<Pick<Room, 'pricePerNight' | 'maxGuests'>>,
): Room {
  const room = ROOMS.find((r) => r.id === id)
  if (!room) throw new Error('Room not found')
  Object.assign(room, patch)
  return room
}

export function getResortStats(): ResortStats {
  return {
    rooms: ROOMS.length,
    averageRating: 4.9,
    reviews: 1284,
    beachfrontMetres: 800,
  }
}

// Whole nights between two ISO dates (min 1).
function nightsBetween(checkIn: string, checkOut: string): number {
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime()
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)))
}

// Builds a seeded booking from a room slug so totals stay consistent.
function seedBooking(
  ref: string,
  roomSlug: string,
  guestName: string,
  email: string,
  checkIn: string,
  checkOut: string,
  guests: number,
  status: BookingStatus,
  createdAt: string,
): Booking {
  const room = getRoomBySlug(roomSlug)
  const nights = nightsBetween(checkIn, checkOut)
  const rate = room?.pricePerNight ?? 0
  return {
    id: ref,
    roomSlug,
    roomName: room?.name ?? roomSlug,
    guestName,
    email,
    checkIn,
    checkOut,
    guests,
    nights,
    total: nights * rate,
    status,
    createdAt,
  }
}

// In-memory bookings so the mock write path behaves end-to-end.
const bookings: Array<Booking> = [
  seedBooking(
    'TI-2026-0001',
    'two-bedroom-penthouse',
    'Sarah & James Whitmore',
    'sarah.whitmore@example.com',
    '2026-08-20',
    '2026-08-24',
    2,
    'checked_in',
    '2026-08-02T09:15:00.000Z',
  ),
  seedBooking(
    'TI-2026-0002',
    'three-bedroom-suite',
    'The Andersson Family',
    'andersson@example.com',
    '2026-08-22',
    '2026-08-27',
    5,
    'confirmed',
    '2026-08-05T14:40:00.000Z',
  ),
  seedBooking(
    'TI-2026-0003',
    'two-bedroom-penthouse-suite',
    'Priya & Arjun Kapoor',
    'priya.kapoor@example.com',
    '2026-08-25',
    '2026-08-30',
    4,
    'confirmed',
    '2026-08-08T11:02:00.000Z',
  ),
  seedBooking(
    'TI-2026-0004',
    'deluxe-room',
    'Daniel Osei',
    'daniel.osei@example.com',
    '2026-08-28',
    '2026-08-31',
    2,
    'pending',
    '2026-08-14T18:20:00.000Z',
  ),
  seedBooking(
    'TI-2026-0005',
    'suite-with-balcony',
    'Mei Lin Zhang',
    'meilin.zhang@example.com',
    '2026-09-02',
    '2026-09-06',
    2,
    'pending',
    '2026-08-16T07:55:00.000Z',
  ),
  seedBooking(
    'TI-2026-0006',
    'two-bedroom-chalet',
    'Carlos & Elena Reyes',
    'reyes.family@example.com',
    '2026-08-10',
    '2026-08-14',
    4,
    'cancelled',
    '2026-07-28T13:10:00.000Z',
  ),
]

// Human reference like TI-2026-0007 from the running count.
function nextBookingRef(): string {
  const year = new Date().getFullYear()
  const seq = String(bookings.length + 1).padStart(4, '0')
  return `TI-${year}-${seq}`
}

export function createBooking(input: BookingInput): Booking {
  const room = getRoomBySlug(input.roomSlug)
  if (!room) throw new Error('Room not found')
  const nights = nightsBetween(input.checkIn, input.checkOut)
  const booking: Booking = {
    ...input,
    id: nextBookingRef(),
    roomName: room.name,
    nights,
    total: nights * room.pricePerNight,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  }
  bookings.push(booking)
  return booking
}

export function getBookings(): Array<Booking> {
  return bookings
}

export function getBookingById(id: string): Booking | undefined {
  return bookings.find((b) => b.id === id)
}

export function updateBookingStatus(
  id: string,
  status: BookingStatus,
): Booking {
  const booking = bookings.find((b) => b.id === id)
  if (!booking) throw new Error('Booking not found')
  booking.status = status
  return booking
}

// Per-room availability overrides authored in the admin Availability module.
const availability = new Map<string, { open: boolean; blockedNote: string }>()

export function getRoomAvailability(): Array<RoomAvailability> {
  return ROOMS.map((room) => {
    const override = availability.get(room.id)
    return {
      roomId: room.id,
      roomName: room.name,
      slug: room.slug,
      pricePerNight: room.pricePerNight,
      open: override?.open ?? true,
      blockedNote: override?.blockedNote ?? '',
    }
  })
}

export function setRoomAvailability(
  roomId: string,
  patch: Partial<{ open: boolean; blockedNote: string }>,
): RoomAvailability {
  const room = getRoomById(roomId)
  if (!room) throw new Error('Room not found')
  const current = availability.get(roomId) ?? { open: true, blockedNote: '' }
  const next = { ...current, ...patch }
  availability.set(roomId, next)
  return {
    roomId,
    roomName: room.name,
    slug: room.slug,
    pricePerNight: room.pricePerNight,
    ...next,
  }
}
