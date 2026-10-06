import type { Amenity, SlotRequest, SlotRequestInput } from '#/types'

// Official amenities from treasureislandghana.com (docs/official-content.md).
// Optional fields stay unset until the resort confirms them — never invent.
const AMENITIES: Array<Amenity> = [
  {
    id: 'a1',
    slug: 'jacuzzi',
    name: 'Jacuzzi Bath',
    category: 'Let’s relax',
    blurb:
      'There is nothing more romantic to round off your city break in Ada than choosing a decadent hotel with a hot tub.',
    description:
      'There is nothing more romantic to round off your city break in Ada ' +
      'than choosing a decadent hotel with a hot tub. Whilst the rest of Ada ' +
      'freezes under a cold snap, you can simply sink into the depths of the ' +
      'hot water and allow the jets and bubbles to soothe your troubles away.',
    image: '/photos/pool-at-night.webp',
    hero: '/photos/pool-at-night.webp',
    gallery: ['/photos/pool-at-night.webp'],
    icon: 'bath',
    price: 'GH₵ 290 per hour',
    bookable: true,
  },
  {
    id: 'a2',
    slug: 'boat-cruise',
    name: 'Boat Cruise (Including Jet-Ski)',
    category: 'On the water',
    blurb:
      'You may be floating at a leisurely pace through the hidden countryside.',
    description:
      'Because it’s a perfect antidote to busy jobs, frenetic tourism, ' +
      'crowded airports, and also a wonderful way to enjoy the countryside! ' +
      'A hotel boat holiday is great for couples, singles, stressed ' +
      'executives & minions, seniors, groups, overseas visitors; just about ' +
      'anyone who enjoys being pampered in pleasant surroundings! You may be ' +
      'floating at a leisurely pace through the hidden countryside. You could ' +
      'just treat yourself to a little well earned relaxation with a piece of ' +
      'home made cake and that favourite book!',
    image: '/photos/jetski-trail.webp',
    hero: '/photos/jetski-trail.webp',
    gallery: ['/photos/jetski-trail.webp', '/photos/jetski-loop.webp'],
    icon: 'ship',
    price: 'From GH₵ 50',
    bookable: true,
  },
  {
    id: 'a3',
    slug: '12d-cinema',
    name: '12D Cinema',
    category: 'Family fun',
    blurb:
      '12D Cinema is a unique venue to shed worries and get an adrenaline rush.',
    description:
      '12D Cinema is a unique venue to shed worries and get an adrenaline ' +
      'rush. Offering the ultimate exclusive experience and HD sound and ' +
      'visual features, the 12D cinema makes you feel the warmth of the dying ' +
      'sun in the horizon and the power of roof-destroying storm. Experience ' +
      'state-of-the-art technology at the 12D Cinema like you’ve never seen ' +
      'it before. A curated library, 9 comfy seats and latest technologies ' +
      'are our offer to lovers of extreme experience.',
    // No cinema photo yet — a neutral resort view stands in.
    image: '/photos/aerial-resort.webp',
    imageAlt: 'Aerial view of Treasure Island Ada',
    hero: '/photos/aerial-resort.webp',
    gallery: [],
    icon: 'film',
    price: 'GH₵ 30 per movie',
    bookable: true,
  },
  {
    id: 'a4',
    slug: 'taxi-boat',
    name: 'Taxi Boat',
    category: 'On the water',
    blurb:
      'Board a River Passage Water Taxi at the Hotel Docks located along the riverwalk.',
    // The official page now 404s; only this opening sentence survives.
    description:
      'Board a River Passage Water Taxi at the Hotel Docks located along the ' +
      'riverwalk.',
    image: '/photos/jetski-loop.webp',
    hero: '/photos/jetski-loop.webp',
    gallery: ['/photos/jetski-loop.webp'],
    icon: 'sailboat',
    price: 'GH₵ 50 per person',
    priceNote: 'In or Out of Island',
    bookable: true,
  },
  {
    id: 'a5',
    slug: 'swimming-cabanas',
    name: 'Swimming & Waterfront Cabanas',
    category: 'Let’s relax',
    blurb:
      'Watch the sun rise or set from the beach front cabanas while sipping on your favorite drinks or just relaxing.',
    description:
      'Relax by the pool in a private cabana! Treasure Island Hotel & ' +
      'Resorts in Ada, Ghana Poolside & Waterfront Cabanas. Reservations are ' +
      'available for an hour, half a day or the full day at a minimal fee. ' +
      'Book a private cabana for your waterfront relaxation. Watch the sun ' +
      'rise or set from the beach front cabanas while sipping on your ' +
      'favorite drinks or just relaxing. Relax in the poolside Cabanas ' +
      'overlooking the beautiful waterslide and pool while taking breaks in ' +
      'between swims.',
    image: '/photos/palm-pool-aerial.webp',
    hero: '/photos/palm-pool-aerial.webp',
    gallery: [
      '/photos/palm-pool-aerial.webp',
      '/photos/pool-loungers.webp',
      '/photos/beach-hero.webp',
    ],
    icon: 'waves',
    // Price-list figure is for the swimming pool; the cabana fee is unpublished.
    price: 'GH₵ 80 per adult',
    priceNote: 'In or Out of Island',
    bookable: true,
  },
  {
    id: 'a6',
    slug: 'horse-riding',
    name: 'Horse Riding',
    category: 'Family fun',
    blurb: 'Explore Treasure Island from an unforgettable vantage point.',
    description:
      'Explore Treasure Island from an unforgettable vantage point. Ride ' +
      'horses through canyons, shaded hillsides, past grazing cattle and ' +
      'babbling brooks. Treasure Island horseback riding vacations start with ' +
      'our string horses. Wranglers will pair you with a horse suited to your ' +
      'skill level—everyone from first-time riders to advanced equestrians is ' +
      'welcome to ride.',
    image: '/photos/horse-riding.webp',
    hero: '/photos/horse-riding.webp',
    gallery: ['/photos/horse-riding.webp'],
    icon: 'compass',
    price: 'GH₵ 50 per person',
    bookable: true,
  },
  {
    id: 'a7',
    slug: 'gaming',
    name: 'Gaming (Little Blast Arcade)',
    category: 'Family fun',
    blurb:
      'A Game Room aka Little Blast Arcade, which boasts more than 20 Coin-Op Arcade machines.',
    description:
      'Retro and modern consoles in our gaming rooms. A Game Room aka Little ' +
      'Blast Arcade, which boasts more than 20 Coin-Op Arcade machines. Well, ' +
      'and a fully stocked bar and the nicest people.',
    // No arcade photo yet — a neutral resort view stands in.
    image: '/photos/lantern-terrace.webp',
    imageAlt: 'Lantern-lit terrace at Treasure Island Ada',
    hero: '/photos/lantern-terrace.webp',
    gallery: [],
    icon: 'gamepad',
    price: 'GH₵ 10 per game',
    bookable: false,
  },
  {
    id: 'a8',
    slug: 'restaurant',
    name: 'Restaurant & Bar',
    category: 'Experience',
    blurb:
      'The hotel restaurant offers you high quality services and facilities.',
    description:
      'The hotel restaurant offers you high quality services and facilities. ' +
      'For a memorable meal the quality of the service is something that ' +
      'guests often remember as much as the food and drink served. That makes ' +
      'our restaurant servers demonstrate extensive knowledge of all types of ' +
      'cuisine and dishes—especially the ingredients and cooking style of ' +
      'items on an à la carte menu.',
    image: '/photos/ocean-deck-dining.webp',
    hero: '/photos/ocean-deck-dining.webp',
    gallery: ['/photos/ocean-deck-dining.webp', '/photos/breakfast.webp'],
    icon: 'utensils',
    price: null,
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
