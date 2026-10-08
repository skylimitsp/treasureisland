// Domain models for the Treasure Island resort — single source of truth.

export type Role = 'guest' | 'concierge' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatar?: string
}

// Official room types: Double Room, Family Room, Deluxe Room.
export type RoomCategory = 'double' | 'family' | 'deluxe'

export type RoomView = 'Beach' | 'River' | 'Jungle'

export interface Room {
  id: string
  slug: string
  name: string
  category: RoomCategory
  description: string
  pricePerNight: number // USD
  maxGuests: number
  beds: string | null // null = not published
  view: RoomView | null
  bathroom: string
  amenities: Array<string>
  image: string
}

export interface BookingInput {
  roomSlug: string
  guestName: string
  email: string
  checkIn: string
  checkOut: string
  guests: number
}

export type BookingStatus =
  'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'

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
}

export type AmenityIcon =
  | 'utensils'
  | 'film'
  | 'bath'
  | 'ship'
  | 'sailboat'
  | 'waves'
  | 'compass'
  | 'gamepad'

export interface Amenity {
  id: string
  slug: string
  name: string
  category: string
  blurb: string
  description: string
  image: string
  imageAlt?: string // set when the photo is a stand-in, not the amenity itself
  hero: string
  gallery: Array<string>
  highlights?: Array<string>
  icon: AmenityIcon
  hours?: string
  location?: string
  capacity?: string
  price: string | null // official GH₵ price-list label; null = not published
  priceNote?: string
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
  video?: string // base path in /videos, no extension
  tag: string
  kicker: string
  cta: string
}

export type EventCategory = 'weddings' | 'birthdays' | 'family' | 'meetings'

export interface EventInclusion {
  label: string
  detail?: string
}

// Pricing/capacity fields stay optional until the resort publishes real figures.
export interface EventPackage {
  slug: string
  name: string
  tierLevel?: number
  blurb: string
  inclusions?: Array<string>
  capacityMin?: number
  capacityMax?: number
  fromPrice?: number | null // null = "on request"
  featured?: boolean
}

export interface EventType {
  slug: string
  category: EventCategory
  name: string // short label, e.g. "Meetings"
  title: string // official page title, e.g. "Beach Hotel Meeting"
  blurb: string // official excerpt
  description: Array<string> // official paragraphs
  icon: string // lucide icon name
  inclusions?: Array<string> // "what's included" chips
  capacityMin?: number
  capacityMax?: number
  fromPrice?: number | null
  gallery: Array<string>
  packages?: Array<EventPackage>
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
  origin: string // role or context line, e.g. "Businessman"
  rating?: number
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
  rating?: number
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
  pendingBookings: number
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

export type SubscriberStatus = 'pending' | 'subscribed' | 'unsubscribed'

export interface NewsletterSignup {
  id: string
  email: string
  source: NewsletterSource
  status: SubscriberStatus
  createdAt: string
}

// ---- Restaurant menu ----

export type MenuGroup = 'food' | 'drinks'

export type MenuCategory =
  | 'breakfast'
  | 'small-plates'
  | 'from-the-sea'
  | 'grill'
  | 'ghanaian-kitchen'
  | 'sides'
  | 'desserts'
  | 'juices'
  | 'mocktails'
  | 'cocktails'
  | 'wine'
  | 'beer'
  | 'soft-drinks'

export interface MenuSection {
  id: MenuCategory
  title: string
  group: MenuGroup
  order: number
  tagline?: string
}

export interface MenuItem {
  id: string
  name: string
  description: string
  category: MenuCategory
  price: number
  available: boolean
}

// ---- Admin console ----

export type StaffRole = 'admin' | 'concierge'

export interface StaffMember extends User {
  role: StaffRole
  active: boolean
  lastLoginAt: string | null
}

export interface AdminSettings {
  currency: 'USD' | 'GHS'
  taxRatePercent: number
  pendingHoldHours: number
  features: Record<string, boolean>
  contact: Record<string, string>
  socials: Record<string, string>
}
