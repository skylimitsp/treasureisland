import type {
  EnquiryStatus,
  EventEnquiry,
  EventEnquiryInput,
  EventTeaser,
  EventType,
} from '#/types'

// Official Events & Meetings copy (treasureislandghana.com), spelling fixes only.
const MEETING_COPY = [
  'Treasure Island Resort offers an environment perfectly designed for successful events. The hotel and resort are located in tranquil and aesthetically pleasing surroundings to refresh the mind and focus attention. At Treasure Island Resort, we believe that perfection is achieved through the harmony of unparalleled location, exemplary service and quiet efficiency. Our service philosophy stems from an understanding of your needs and our attention to the smallest detail. Specially dedicated event consultants will understand your requirements, help you choose the most suitable destination and plan the event to the smallest detail. Our warm and friendly staff will make every effort to ensure your event is memorable and successful.',
]

const WEDDING_COPY = [
  'From the engagement to the joyous day and all the important milestones in between, Treasure Island can handle any wedding function with flawless aplomb. Our wedding planners collaborate with the bride and groom to create an event that will delight the couple, the parents and all friends and family who attend. Whether a couple chooses a traditional ceremony or a themed extravaganza, the Treasure Island team ensures that the day is nothing short of perfection. With everything so adroitly handled, the bridal couple is free to relax and anticipate their beautiful ceremony.',
  'A wedding at Treasure Island Resort ensures unique menus designed for each ceremony, gorgeous choices for indoor and outdoor banquet rooms, beautiful accommodations for your guests, and an expert catering team that thrives on making every detail of the event extravagant, elegant and lively.',
]

const FAMILY_COPY = [
  'When you host a party or family reunion, the special celebrations let you strengthen bonds with those you hold most dear. It’s also the chance to share what we’re looking forward to—along with what we’ve been through—with people we count on to care. At Treasure Island Resort, we’ve experienced more years of hosting family celebrations like birthdays, confirmations, graduations, engagement parties, anniversaries, vow renewals, reunions, and more. It’s among our most cherished traditions as a company, and one of the most-prized accomplishments of the people who work in our hotels. That’s our story. Call it our family story.',
]

// Celebration types teased on the landing page — API swap seam.
const EVENT_TEASERS: Array<EventTeaser> = [
  {
    slug: 'weddings',
    name: 'Weddings',
    blurb:
      'From the engagement to the joyous day and all the important milestones in between, Treasure Island can handle any wedding function with flawless aplomb.',
    image: '/events/wedding-carriage.webp',
    video: '/videos/event-wedding',
    tag: 'Ada Foah',
    kicker: 'Events & Meetings',
    cta: 'Plan your wedding',
  },
  {
    slug: 'birthdays',
    name: 'Birthday Parties',
    blurb:
      'Our warm and friendly staff will make every effort to ensure your event is memorable and successful.',
    image: '/photos/lantern-terrace.webp',
    video: '/videos/event-beach-drummers',
    tag: 'Ada Foah',
    kicker: 'Events & Meetings',
    cta: 'Plan a party',
  },
  {
    slug: 'family-parties',
    name: 'Host a Family Party',
    blurb:
      'When you host a party or family reunion, the special celebrations let you strengthen bonds with those you hold most dear.',
    image: '/photos/pool-loungers.webp',
    tag: 'Ada Foah',
    kicker: 'Events & Meetings',
    cta: 'Plan a reunion',
  },
]

// The four official event types — API swap seam.
const EVENT_TYPES: Array<EventType> = [
  {
    slug: 'weddings',
    category: 'weddings',
    name: 'Weddings',
    title: 'Weddings',
    blurb:
      'From the engagement to the joyous day and all the important milestones in between, Treasure Island can handle any wedding function with flawless aplomb.',
    description: WEDDING_COPY,
    icon: 'Heart',
    gallery: ['/events/wedding-carriage.webp', '/photos/pool-at-night.webp'],
  },
  {
    slug: 'birthdays',
    category: 'birthdays',
    name: 'Birthday Parties',
    title: 'Birthday Parties',
    blurb:
      'Our warm and friendly staff will make every effort to ensure your event is memorable and successful.',
    description: MEETING_COPY,
    icon: 'Cake',
    gallery: ['/photos/lantern-terrace.webp', '/photos/pool-loungers.webp'],
  },
  {
    slug: 'family',
    category: 'family',
    name: 'Family Parties',
    title: 'Host a Family Party',
    blurb:
      'When you host a party or family reunion, the special celebrations let you strengthen bonds with those you hold most dear.',
    description: FAMILY_COPY,
    icon: 'Users',
    gallery: ['/photos/pool-loungers.webp', '/photos/breakfast.webp'],
  },
  {
    slug: 'meetings',
    category: 'meetings',
    name: 'Meetings & Events',
    title: 'Beach Hotel Meeting',
    blurb:
      'Treasure Island Resort offers an environment perfectly designed for successful events.',
    description: MEETING_COPY,
    icon: 'Presentation',
    gallery: [
      '/photos/conference-hall.webp',
      '/photos/ocean-deck-dining.webp',
      '/photos/lantern-terrace.webp',
    ],
  },
]

// In-memory enquiries (starts empty) so the mock write path behaves end-to-end.
const enquiries: Array<EventEnquiry> = []

export function getEventTeasers(): Array<EventTeaser> {
  return EVENT_TEASERS
}

export function getEventTypes(): Array<EventType> {
  return EVENT_TYPES
}

export function getEventTypeBySlug(slug: string): EventType | undefined {
  return EVENT_TYPES.find((type) => type.slug === slug)
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
