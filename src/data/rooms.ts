import type {
  Booking,
  BookingInput,
  BookingStatus,
  ResortStats,
  Room,
  RoomAvailability,
} from '#/types'

// Official room list from treasureislandghana.com (USD per night). Every room
// shares the site's one blurb; the second sentence restates its listed facts.
const BLURB =
  'Make yourself comfortable in any of our serene guest rooms and spacious suites.'

const ENSUITE_AMENITIES = [
  'Free Wifi',
  'Hot/Cold Shower & Bathtub',
  '2 pair of slippers',
  'Bottled Mineral Water',
]

const KITCHENETTE_AMENITIES = [
  ...ENSUITE_AMENITIES,
  'Wine on arrival',
  'Fireworks',
  'Dining Area',
  'Modern Kitchenette',
]

const STANDING_SHOWER_AMENITIES = [
  'Private bathroom',
  'Free Wifi',
  'Intercom',
  'Refrigerator',
]

const ROOMS: Array<Room> = [
  {
    id: 'r1',
    slug: '2-bedroom-penthouse-big-jacuzzi',
    name: '2 Bedroom Penthouse for 4 – Big Jacuzzi',
    category: 'double',
    description: `${BLURB} A two-bedroom penthouse for up to 4 guests, with a big Jacuzzi.`,
    pricePerNight: 750,
    maxGuests: 4,
    beds: null,
    view: null,
    bathroom: 'Big Jacuzzi',
    amenities: [],
    image: '/rooms/suite-bedroom.webp',
  },
  {
    id: 'r2',
    slug: '2-bedroom-penthouse-private-pool',
    name: '2 Bedroom Penthouse for 4 – Private Pool',
    category: 'double',
    description: `${BLURB} A two-bedroom penthouse for up to 4 adults, with a Jacuzzi, a private pool and large balconies.`,
    pricePerNight: 850,
    maxGuests: 4,
    beds: 'Queen size',
    view: null,
    bathroom: 'Jacuzzi',
    amenities: [
      'Fitted with upgraded bedding',
      'Private Pool',
      'Large Balconies',
    ],
    image: '/rooms/garden-view.webp',
  },
  {
    id: 'r3',
    slug: '3-bedroom-supreme',
    name: '3 Bedroom Supreme for 6',
    category: 'family',
    description: `${BLURB} Three Queen size beds for up to 6 adults, with a beach view, an ensuite shower bath, a dining area and a modern kitchenette.`,
    pricePerNight: 720,
    maxGuests: 6,
    beds: '3 Queen size',
    view: 'Beach',
    bathroom: 'Shower bath ensuite',
    amenities: KITCHENETTE_AMENITIES,
    image: '/rooms/living-area.webp',
  },
  {
    id: 'r4',
    slug: '3-bedroom-chalet',
    name: '3 Bedroom Chalet for 6',
    category: 'family',
    description: `${BLURB} Three Queen size beds for up to 6 adults, with a beach view and an ensuite shower bath.`,
    pricePerNight: 570,
    maxGuests: 6,
    beds: '3 Queen size',
    view: 'Beach',
    bathroom: 'Shower bath ensuite',
    amenities: ENSUITE_AMENITIES,
    image: '/rooms/room-5.webp',
  },
  {
    id: 'r5',
    slug: '2-bedroom-chalet',
    name: '2 Bedroom Chalet for 4',
    category: 'family',
    description: `${BLURB} Two Queen size beds for up to 4 adults, with a beach view, an ensuite shower bath, a dining area and a modern kitchenette.`,
    pricePerNight: 420,
    maxGuests: 4,
    beds: '2 Queen size',
    view: 'Beach',
    bathroom: 'Shower bath ensuite',
    amenities: KITCHENETTE_AMENITIES,
    image: '/rooms/kitchenette.webp',
  },
  {
    id: 'r6',
    slug: 'suite-with-balcony',
    name: 'Suite with Balcony',
    category: 'double',
    description: `${BLURB} One Queen size bed for up to 2 adults, with a beach view and an ensuite shower bath.`,
    pricePerNight: 285,
    maxGuests: 2,
    beds: '1 Queen size',
    view: 'Beach',
    bathroom: 'Shower bath ensuite',
    amenities: ENSUITE_AMENITIES,
    image: '/rooms/room-2.webp',
  },
  {
    // Bed/occupancy as published; they mirror the chalet listing — confirm.
    id: 'r7',
    slug: 'deluxe-room-with-balcony',
    name: 'Deluxe Room with Balcony',
    category: 'double',
    description: `${BLURB} Three Queen size beds for up to 6 adults, with a beach view and an ensuite shower bath.`,
    pricePerNight: 225,
    maxGuests: 6,
    beds: '3 Queen size',
    view: 'Beach',
    bathroom: 'Shower bath ensuite',
    amenities: ENSUITE_AMENITIES,
    image: '/rooms/room-1.webp',
  },
  {
    // The official listing names both River View and Jungle View.
    id: 'r8',
    slug: 'deluxe-room',
    name: 'Deluxe Room',
    category: 'deluxe',
    description: `${BLURB} One Queen bed for up to 2 adults, with a river view and a private bathroom with a standing shower.`,
    pricePerNight: 195,
    maxGuests: 2,
    beds: '1 Queen bed',
    view: 'River',
    bathroom: 'Standing shower',
    amenities: STANDING_SHOWER_AMENITIES,
    image: '/rooms/room-6.webp',
  },
  {
    id: 'r9',
    slug: 'waterfront-room',
    name: 'Waterfront Room',
    category: 'double',
    description: `${BLURB} One double bed for up to 2 adults, with a river view and a private bathroom with a standing shower.`,
    pricePerNight: 155,
    maxGuests: 2,
    beds: '1 double bed',
    view: 'River',
    bathroom: 'Standing shower',
    amenities: STANDING_SHOWER_AMENITIES,
    image: '/rooms/room-3.webp',
  },
  {
    id: 'r10',
    slug: 'standard-room',
    name: 'Standard Room',
    category: 'double',
    description: `${BLURB} One double bed for up to 2 adults, with a jungle view and a private bathroom with a standing shower.`,
    pricePerNight: 105,
    maxGuests: 2,
    beds: '1 double bed',
    view: 'Jungle',
    bathroom: 'Standing shower',
    amenities: STANDING_SHOWER_AMENITIES,
    image: '/rooms/room-3.webp',
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
    '2-bedroom-penthouse-big-jacuzzi',
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
    '3-bedroom-supreme',
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
    '2-bedroom-penthouse-private-pool',
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
    '2-bedroom-chalet',
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
