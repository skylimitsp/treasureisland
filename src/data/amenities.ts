import type { Amenity, SlotRequest, SlotRequestInput } from '#/types'

// Mock amenity list — the API swap seam (see CLAUDE.md §6). Detail fields are
// populated here; going live swaps each accessor body for an httpClient call.
const AMENITIES: Array<Amenity> = [
  {
    id: 'a1',
    slug: 'restaurant',
    name: 'Ocean-View Restaurant',
    category: 'Dining',
    blurb: 'Sea-to-table plates and sunset cocktails at the water’s edge.',
    description:
      'Our coastal-Mediterranean kitchen runs from sunrise to candlelight — ' +
      'wild-caught seafood, wood-fired plates, and an open terrace set right ' +
      'over the sand. Mornings bring slow breakfasts with the tide; evenings ' +
      'turn to shared plates, natural wines, and the last of the light on the ' +
      'water. Every table looks out to the horizon.',
    image: '/photos/ocean-deck-dining.webp',
    hero: '/photos/ocean-deck-dining.webp',
    gallery: [
      '/photos/ocean-deck-dining.webp',
      '/photos/breakfast.webp',
      '/photos/lantern-terrace.webp',
      '/photos/infinity-lounge.webp',
    ],
    highlights: [
      'Wild-caught seafood',
      'Wood-fired kitchen',
      'Open beach terrace',
      '24/7 in-room dining',
      'Natural wine list',
    ],
    icon: 'utensils',
    hours: 'Daily · 7am–11pm',
    location: 'Beach terrace, west wing',
    capacity: 'Up to 60 covers',
    priceFrom: 45,
    bookable: true,
  },
  {
    id: 'a2',
    slug: '12d-cinema',
    name: '12D Cinema',
    category: 'Entertainment',
    blurb: 'Motion seats, wind, and mist — the reef comes alive around you.',
    description:
      'An immersive motion-seat cinema tucked behind the palms. Seats pitch, ' +
      'roll and rumble in sync with the film while wind, water-mist and scent ' +
      'bursts fold the room into the story. Short-format thrills in vivid 3D — ' +
      'reef dives, jungle chases, deep-space runs — a fifteen-minute escape ' +
      'after dark for all ages.',
    // 12D Cinema has no real photo yet → dark placeholder tile (empty image).
    image: '',
    hero: '',
    gallery: [],
    highlights: [
      'Motion seats',
      'Wind & water-mist',
      'Scent bursts',
      '3D visuals',
      'Family-friendly showings',
    ],
    icon: 'film',
    hours: 'Daily · 4pm–10pm',
    location: 'Palm court, lower level',
    capacity: '24 motion seats',
    priceFrom: 18,
    bookable: true,
  },
  {
    id: 'a3',
    slug: 'horse-riding',
    name: 'Beach Horse Riding',
    category: 'Adventure',
    blurb: 'Guided rides along the shoreline at golden hour.',
    description:
      'Guided beach-trail rides at golden hour, led by our stable team on ' +
      'calm, schooled horses. First-timers start in the arena with a short ' +
      'lesson before heading to the shoreline; confident riders can push on ' +
      'along the firm sand as the sun drops. Boots and helmets provided — you ' +
      'just bring the sense of adventure.',
    image: '/photos/horse-riding.webp',
    hero: '/photos/horse-riding.webp',
    gallery: [
      '/photos/horse-riding.webp',
      '/photos/palm-pool-aerial.webp',
      '/photos/aerial-resort.webp',
    ],
    highlights: [
      'Golden-hour beach trails',
      'Lessons for first-timers',
      'Calm, schooled horses',
      'Arena & shoreline routes',
      'Helmets & boots provided',
    ],
    icon: 'anchor',
    hours: 'Daily · 6am–9am, 4pm–6pm',
    location: 'Stables, north shore',
    capacity: 'Up to 6 riders per ride',
    priceFrom: 60,
    bookable: true,
  },
  {
    id: 'a4',
    slug: 'jacuzzi',
    name: 'Jacuzzi & Spa',
    category: 'Wellness',
    blurb: 'Warm hydrotherapy pools overlooking the lagoon.',
    description:
      'The slow, restorative end of the day. Sink into warm mineral water at ' +
      'the poolside jacuzzi, with cabana service and cool towels on hand. ' +
      'Heated jets ease tired muscles while the lagoon glitters just beyond ' +
      'the deck. Open through the evening, it is the quietest way to close a ' +
      'day in the sun.',
    image: '/photos/pool-at-night.webp',
    hero: '/photos/pool-at-night.webp',
    gallery: [
      '/photos/pool-at-night.webp',
      '/photos/pool-loungers.webp',
      '/photos/palm-pool-aerial.webp',
    ],
    highlights: [
      'Warm mineral soak',
      'Poolside cabana service',
      'Lagoon views',
      'Open into the evening',
    ],
    icon: 'bath',
    hours: 'Daily · 8am–10pm',
    location: 'Spa deck, lagoon side',
    capacity: null,
    priceFrom: null,
    bookable: false,
  },
  {
    id: 'a5',
    slug: 'boat-cruise',
    name: 'Boat Cruise & Jet-Ski',
    category: 'On the water',
    blurb: 'Sunset cruises and jet-ski hire straight off the jetty.',
    description:
      'Glass-clear lagoon runs and self-drive jet-skis, straight off our ' +
      'private jetty. Join a sunset cruise for dolphin-spotting sails and a ' +
      'glass of something cold, or take the wheel of a jet-ski for the ' +
      'adrenaline half-hour. Life jackets and a safety briefing come as ' +
      'standard; the open water is all yours.',
    image: '/photos/jetski-trail.webp',
    hero: '/photos/jetski-trail.webp',
    gallery: [
      '/photos/jetski-trail.webp',
      '/photos/jetski-loop.webp',
      '/photos/aerial-resort.webp',
      '/photos/palm-pool-aerial.webp',
    ],
    highlights: [
      'Sunset dolphin cruises',
      'Self-drive jet-skis',
      'Glass-clear lagoon runs',
      'Life jackets & briefing',
      'Departs the private jetty',
    ],
    icon: 'ship',
    hours: 'Daily · 9am–6pm',
    location: 'Private jetty, east point',
    capacity: 'Up to 12 per cruise',
    priceFrom: 75,
    bookable: true,
  },
  {
    id: 'a6',
    slug: 'swimming-pool',
    name: 'Swimming Pool',
    category: 'Leisure',
    blurb: 'A palm-fringed freshwater pool with shaded loungers.',
    description:
      'A palm-fringed freshwater pool at the heart of the resort, with an ' +
      'infinity edge that melts into the sea. Shaded loungers, a swim-up ' +
      'ledge and towel service make it easy to lose an afternoon here. Open ' +
      'from dawn for lap swimmers and late into the evening for a quiet float ' +
      'under the stars.',
    image: '/photos/infinity-lounge.webp',
    hero: '/photos/infinity-lounge.webp',
    gallery: [
      '/photos/infinity-lounge.webp',
      '/photos/pool-loungers.webp',
      '/photos/palm-pool-aerial.webp',
      '/photos/beach-hero.webp',
    ],
    highlights: [
      'Infinity edge',
      'Shaded loungers',
      'Swim-up ledge',
      'Towel service',
    ],
    icon: 'bath',
    hours: 'Daily · 6am–10pm',
    location: 'Central deck',
    capacity: null,
    priceFrom: null,
    bookable: false,
  },
]

export function getAmenities(): Array<Amenity> {
  return AMENITIES
}

export function getAmenityBySlug(slug: string): Amenity | undefined {
  return AMENITIES.find((a) => a.slug === slug)
}

export function getRelatedAmenities(slug: string): Array<Amenity> {
  return AMENITIES.filter((a) => a.slug !== slug)
}

// In-memory slot requests so the mock write path behaves end-to-end.
const slotRequests: Array<SlotRequest> = []

export function createSlotRequest(input: SlotRequestInput): SlotRequest {
  const amenity = getAmenityBySlug(input.slug)
  if (!amenity) throw new Error('Amenity not found')
  const seq = String(slotRequests.length + 1).padStart(4, '0')
  const request: SlotRequest = {
    ...input,
    id: `SLT-2026-${seq}`,
    amenityName: amenity.name,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  slotRequests.push(request)
  return request
}

export function getSlotRequests(): Array<SlotRequest> {
  return slotRequests
}
