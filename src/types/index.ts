// Domain models for the Treasure Island resort — single source of truth.

export type Role = 'guest' | 'concierge' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatar?: string
}

export type RoomCategory = 'double' | 'family' | 'deluxe'

export interface Room {
  id: string
  slug: string
  name: string
  category: RoomCategory
  description: string
  pricePerNight: number
  maxGuests: number
  sizeSqm: number
  beds: string
  amenities: Array<string>
  image: string
  oceanView: boolean
}

export interface BookingInput {
  roomSlug: string
  guestName: string
  email: string
  checkIn: string
  checkOut: string
  guests: number
}

export type BookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'cancelled'

export interface Booking extends BookingInput {
  id: string
  roomName: string
  nights: number
  total: number
  status: BookingStatus
  createdAt: string
}

export interface ResortStats {
  rooms: number
  averageRating: number
  reviews: number
  beachfrontMetres: number
}

export type AmenityIcon = 'utensils' | 'film' | 'bath' | 'anchor' | 'ship'

export interface Amenity {
  id: string
  slug: string
  name: string
  category: string
  blurb: string
  description: string
  image: string
  hero: string
  gallery: Array<string>
  highlights: Array<string>
  icon: AmenityIcon
  hours: string
  location: string
  capacity: string | null
  priceFrom: number | null // null = complimentary / included
  bookable: boolean
}

export interface SlotRequestInput {
  slug: string
  date: string
  slot: string
  partySize: number
  name: string
  email: string
  note?: string
}

export type SlotRequestStatus = 'pending' | 'confirmed'

export interface SlotRequest extends SlotRequestInput {
  id: string // reference code, e.g. SLT-2026-0007
  amenityName: string
  status: SlotRequestStatus
  createdAt: string
}

export interface EventTeaser {
  slug: string
  name: string
  blurb: string
  image: string
  tag: string
  kicker: string
  cta: string
}

export type EventCategory = 'weddings' | 'birthdays' | 'family' | 'meetings'

export interface EventInclusion {
  label: string
  detail?: string
}

export interface EventPackage {
  slug: string
  name: string
  tierLevel: number
  blurb: string
  inclusions: Array<string>
  capacityMin: number
  capacityMax: number
  fromPrice: number | null // null = "on request"
  featured?: boolean
}

export interface EventType {
  slug: string
  category: EventCategory
  name: string
  blurb: string
  icon: string // lucide icon name
  inclusions: Array<string> // "what's included" chips
  capacityMin: number
  capacityMax: number
  fromPrice: number | null
  gallery: Array<string>
  packages: Array<EventPackage>
}

export type EnquiryStatus = 'new' | 'contacted' | 'closed'

export interface EventEnquiryInput {
  eventType: EventCategory
  date: string // ISO; preferred date
  flexibleDates: boolean
  guests: number
  name: string
  email: string
  phone: string
  budget: string | null // range label, optional
  message: string
  consent: boolean // marketing opt-in
}

export interface EventEnquiry extends EventEnquiryInput {
  id: string // reference code, e.g. ENQ-2026-0007
  status: EnquiryStatus
  createdAt: string
}

export interface Testimonial {
  id: string
  quote: string
  name: string
  origin: string
  rating: number
}

export interface Faq {
  q: string
  a: string
}

export interface Review {
  id: string
  quote: string
  name: string
  origin: string
  rating: number
  featured: boolean
}

export interface RoomAvailability {
  roomId: string
  roomName: string
  slug: string
  pricePerNight: number
  open: boolean
  blockedNote: string
}

export interface DashboardMetrics {
  bookingsToday: number
  upcomingBookings: number
  revenue: number
  occupancy: number
  pendingEnquiries: number
  subscribers: number
}

export type ActivityKind = 'booking' | 'enquiry' | 'subscriber'

export interface ActivityItem {
  id: string
  kind: ActivityKind
  title: string
  detail: string
  createdAt: string
}

export type NewsletterSource = 'footer' | 'home' | 'about' | 'events'

export interface NewsletterSignup {
  id: string
  email: string
  source: NewsletterSource
  status: 'subscribed'
  createdAt: string
}
