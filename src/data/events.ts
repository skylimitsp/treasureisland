import type {
  EnquiryStatus,
  EventEnquiry,
  EventEnquiryInput,
  EventPackage,
  EventTeaser,
  EventType,
} from '#/types'

// Mock celebration types teased on the landing page — API swap seam.
const EVENT_TEASERS: Array<EventTeaser> = [
  {
    slug: 'weddings',
    name: 'Weddings',
    blurb: 'Barefoot ceremonies on the sand and receptions under the stars.',
    image: '/wedding.webp',
  },
  {
    slug: 'birthdays',
    name: 'Birthdays',
    blurb: 'Private terraces, custom menus, and a cake by the pool.',
    image: '/events/birthdays.jpg',
  },
  {
    slug: 'family-parties',
    name: 'Family parties',
    blurb: 'Reunions and gatherings with the whole island to play in.',
    image: '/events/family.jpg',
  },
]

// Three comparison tiers shared across every celebration type.
const EVENT_PACKAGES: Array<EventPackage> = [
  {
    slug: 'intimate',
    name: 'Intimate',
    tierLevel: 1,
    blurb: 'Small, heartfelt gatherings by the water.',
    inclusions: [
      'Ceremony / space hire',
      'Set menu',
      'Coordinator (day-of)',
      'Sound system',
    ],
    capacityMin: 2,
    capacityMax: 40,
    fromPrice: 2500,
  },
  {
    slug: 'signature',
    name: 'Signature',
    tierLevel: 2,
    blurb: 'Our most-loved celebration, terrace to lawn.',
    inclusions: [
      'Everything in Intimate',
      'Terrace + lawn',
      '3-course + canapés',
      'Planner (full)',
      'Décor styling',
      '5 room-block rate',
    ],
    capacityMin: 40,
    capacityMax: 100,
    fromPrice: 6500,
    featured: true,
  },
  {
    slug: 'grand',
    name: 'Grand',
    tierLevel: 3,
    blurb: 'A whole-resort event, styled end to end.',
    inclusions: [
      'Everything in Signature',
      'Full-resort options',
      'Bespoke menu & bar',
      'Live entertainment',
      'Accommodation block',
      'Dedicated event manager',
    ],
    capacityMin: 100,
    capacityMax: 180,
    fromPrice: null, // on request
  },
]

// The four celebration types introduced on the page — API swap seam.
const EVENT_TYPES: Array<EventType> = [
  {
    slug: 'weddings',
    category: 'weddings',
    name: 'Weddings',
    blurb: 'Ceremonies on the lawn, receptions under the stars.',
    icon: 'Heart',
    inclusions: ['Ceremony setup', 'Coordinator', 'Menu tasting'],
    capacityMin: 2,
    capacityMax: 180,
    fromPrice: 2500,
    gallery: ['/wedding.webp', '/events/lawn.jpg'],
    packages: EVENT_PACKAGES,
  },
  {
    slug: 'birthdays',
    category: 'birthdays',
    name: 'Birthday parties',
    blurb: 'Milestone parties from intimate to grand.',
    icon: 'Cake',
    inclusions: ['Décor', 'Cake', 'DJ-ready deck'],
    capacityMin: 2,
    capacityMax: 120,
    fromPrice: 2500,
    gallery: ['/events/birthdays.jpg', '/events/poolside.jpg'],
    packages: EVENT_PACKAGES,
  },
  {
    slug: 'family',
    category: 'family',
    name: 'Family parties',
    blurb: 'Reunions, anniversaries, naming days.',
    icon: 'Users',
    inclusions: ['Buffet', "Kids' corner", 'Group rates'],
    capacityMin: 10,
    capacityMax: 120,
    fromPrice: 2500,
    gallery: ['/events/family.jpg', '/events/table-setting.jpg'],
    packages: EVENT_PACKAGES,
  },
  {
    slug: 'meetings',
    category: 'meetings',
    name: 'Meetings & retreats',
    blurb: 'Off-sites, board days, wellness retreats.',
    icon: 'Presentation',
    inclusions: ['AV', 'Breakout space', 'Catering breaks'],
    capacityMin: 4,
    capacityMax: 120,
    fromPrice: 2500,
    gallery: ['/events/reception.jpg', '/events/terrace.jpg'],
    packages: EVENT_PACKAGES,
  },
]

// In-memory enquiries so the mock write path behaves end-to-end.
const enquiries: Array<EventEnquiry> = [
  {
    id: 'ENQ-2026-0001',
    eventType: 'weddings',
    date: '2026-11-14',
    flexibleDates: true,
    guests: 80,
    name: 'Isabella Moreau',
    email: 'isabella.moreau@example.com',
    phone: '+33 6 12 34 56 78',
    budget: '$10k–$20k',
    message: 'Beach ceremony at sunset, reception on the lawn for 80 guests.',
    consent: true,
    status: 'new',
    createdAt: '2026-08-17T10:24:00.000Z',
  },
  {
    id: 'ENQ-2026-0002',
    eventType: 'birthdays',
    date: '2026-09-20',
    flexibleDates: false,
    guests: 30,
    name: 'Tomiwa Adeyemi',
    email: 'tomiwa.adeyemi@example.com',
    phone: '+234 803 000 1122',
    budget: '$5k–$10k',
    message: 'Milestone 40th birthday, poolside with a DJ.',
    consent: true,
    status: 'contacted',
    createdAt: '2026-08-12T15:48:00.000Z',
  },
  {
    id: 'ENQ-2026-0003',
    eventType: 'family',
    date: '2026-12-27',
    flexibleDates: true,
    guests: 45,
    name: 'The Okafor Reunion',
    email: 'okafor.reunion@example.com',
    phone: '+1 202 555 0147',
    budget: null,
    message: 'Family reunion over the holidays, need group room rates.',
    consent: false,
    status: 'new',
    createdAt: '2026-08-18T08:05:00.000Z',
  },
  {
    id: 'ENQ-2026-0004',
    eventType: 'meetings',
    date: '2026-10-05',
    flexibleDates: false,
    guests: 18,
    name: 'Northwind Ventures',
    email: 'offsite@northwind.example',
    phone: '+44 20 7946 0958',
    budget: '$20k+',
    message: 'Three-day leadership off-site with breakout space and AV.',
    consent: true,
    status: 'closed',
    createdAt: '2026-07-30T12:00:00.000Z',
  },
]

export function getEventTeasers(): Array<EventTeaser> {
  return EVENT_TEASERS
}

export function getEventTypes(): Array<EventType> {
  return EVENT_TYPES
}

export function getEventTypeBySlug(slug: string): EventType | undefined {
  return EVENT_TYPES.find((type) => type.slug === slug)
}

export function getEventPackages(): Array<EventPackage> {
  return EVENT_PACKAGES
}

export function getEventEnquiries(): Array<EventEnquiry> {
  return enquiries
}

export function updateEnquiryStatus(
  id: string,
  status: EnquiryStatus,
): EventEnquiry {
  const enquiry = enquiries.find((e) => e.id === id)
  if (!enquiry) throw new Error('Enquiry not found')
  enquiry.status = status
  return enquiry
}

// Notification stub — the future transactional-email/CRM call lands here.
function sendEnquiryEmail(enquiry: EventEnquiry): { queued: boolean } {
  console.info('[events] enquiry queued', enquiry)
  return { queued: true }
}

// Builds a human reference like ENQ-2026-0007 from the running count.
function nextReference(): string {
  const year = new Date().getFullYear()
  const seq = String(enquiries.length + 1).padStart(4, '0')
  return `ENQ-${year}-${seq}`
}

export function createEventEnquiry(input: EventEnquiryInput): EventEnquiry {
  const enquiry: EventEnquiry = {
    ...input,
    id: nextReference(),
    status: 'new',
    createdAt: new Date().toISOString(),
  }
  enquiries.push(enquiry)
  sendEnquiryEmail(enquiry)
  return enquiry
}
