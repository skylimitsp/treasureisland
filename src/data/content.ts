import type { Faq, Review, Testimonial } from '#/types'
import type { AboutContent } from '#/types/about'

// Mock guest testimonials — API swap seam.
const TESTIMONIALS: Array<Testimonial> = [
  {
    id: 't1',
    quote:
      'The most beautiful place we have ever stayed. We woke to the sound of the water every morning and never wanted to leave.',
    name: 'Sarah & James',
    origin: 'Sydney, Australia',
    rating: 5,
  },
  {
    id: 't2',
    quote:
      'Every detail was thoughtful, from the overwater villa to the sunset cruise. The staff made our anniversary unforgettable.',
    name: 'The Andersson Family',
    origin: 'Stockholm, Sweden',
    rating: 5,
  },
  {
    id: 't3',
    quote:
      'Barefoot luxury done right. Impeccable dining, a private stretch of beach, and complete calm.',
    name: 'Priya & Arjun',
    origin: 'London, United Kingdom',
    rating: 5,
  },
  {
    id: 't4',
    quote:
      'We booked for three nights and extended to a week. The horse riding at golden hour was a highlight.',
    name: 'Daniel Osei',
    origin: 'Accra, Ghana',
    rating: 5,
  },
]

// Mock FAQs — also feed FAQPage structured data on the home route.
const FAQS: Array<Faq> = [
  {
    q: 'What time is check-in and check-out?',
    a: 'Check-in is from 3pm and check-out is by 11am. Early arrival and late departure can be arranged with the concierge.',
  },
  {
    q: 'Is the resort beachfront?',
    a: 'Yes — Treasure Island sits on a private stretch of white-sand beach with direct lagoon access.',
  },
  {
    q: 'Do you host weddings and celebrations?',
    a: 'We host weddings, birthdays, and family parties. Send an enquiry from the Events page and our team will craft a proposal.',
  },
  {
    q: 'How do I get to the island?',
    a: 'We arrange speedboat and seaplane transfers from the mainland; details are shared after booking.',
  },
  {
    q: 'Are children welcome?',
    a: 'Absolutely. We offer family villas, kids’ dining, and supervised activities across the resort.',
  },
]

export function getTestimonials(): Array<Testimonial> {
  return TESTIMONIALS
}

// Reviews moderation state — which testimonials are featured on the public site.
const featured = new Set<string>(['t1', 't2'])

export function getReviews(): Array<Review> {
  return TESTIMONIALS.map((t) => ({ ...t, featured: featured.has(t.id) }))
}

export function toggleReviewFeatured(id: string): Review {
  const testimonial = TESTIMONIALS.find((t) => t.id === id)
  if (!testimonial) throw new Error('Review not found')
  if (featured.has(id)) featured.delete(id)
  else featured.add(id)
  return { ...testimonial, featured: featured.has(id) }
}

export function getFaqs(): Array<Faq> {
  return FAQS
}

// Mock About content — API swap seam (getAboutContent → httpClient later).
const ABOUT: AboutContent = {
  kicker: 'Our story',
  lead: 'Treasure Island began as a single fisherman’s cottage and grew, slowly, into a private-island retreat — built around the water, and the light.',
  story: [
    'In 2009 we bought a weathered cottage at the end of a sandbar with no lobby, no neighbours, and forty steps of warm sand between the coffee and the sea.',
    'Everything here is designed to be barefoot. Lime-washed walls, wide shutters that fold all the way open, and a terrace that catches the breeze from three directions.',
    'Fifteen years on, the island is still ours to share — the same slow mornings, the same sunset that arrives on time every evening without needing a reservation.',
  ],
  stats: [
    { label: 'Founded', value: 2009, countUp: false },
    { label: 'Villas & suites', value: 24, countUp: true },
    { label: 'Metres of beachfront', value: 340, suffix: 'm', countUp: true },
    { label: 'Guest rating', value: 4.9, suffix: '★', countUp: true },
  ],
  host: {
    name: 'Amara Mensah',
    role: 'Founder & Host',
    quote:
      'Guests always ask what to do first. I always say: put your bag down and go stand in the water.',
    bioBlocks: [
      'I grew up three coves down from this house. After years cooking in city kitchens, I came home, took on my grandfather’s cottage, and spent two years turning it into a place I always wished I could book.',
      'I live nearby, not on-site — close enough to meet you at the jetty with cold coconut juice, far enough that the island is entirely yours.',
    ],
    photo: '/photos/lantern-terrace.webp',
    photoAlt: 'Amara Mensah, founder and host of Treasure Island',
  },
  values: [
    {
      icon: 'leaf',
      title: 'Stewardship',
      headline: 'Let the island lead',
      image: '/photos/palm-pool-aerial.webp',
      tag: 'Solar powered',
      body: 'Solar power, reef-safe everything, and a low-impact build that lets the island lead.',
    },
    {
      icon: 'users',
      title: 'Community',
      headline: 'Rooted in these shores',
      image: '/photos/horse-riding.webp',
      tag: 'Local team',
      body: 'Local hiring and island partners — most of the team grew up on these shores.',
    },
    {
      icon: 'palm',
      title: 'Craft',
      headline: 'Made to last',
      image: '/rooms/living-area.webp',
      tag: 'Hand-built',
      body: 'Hand-built, lime-washed, and made to last — details you feel more than notice.',
    },
  ],
  gallery: [
    { src: '/photos/pool-at-night.webp', alt: 'Ocean view at dusk' },
    { src: '/photos/breakfast.webp', alt: 'Beachfront dining' },
    { src: '/photos/pool-loungers.webp', alt: 'Poolside at the resort' },
    { src: '/rooms/garden-view.webp', alt: 'A garden-view room' },
    { src: '/events/wedding-ceremony.webp', alt: 'A wedding celebration' },
    {
      src: '/photos/jetski-trail.webp',
      alt: 'A jet-ski trail across the lagoon',
    },
  ],
  awards: [
    { label: 'Best Beach Resort', source: 'Condé Nast Traveller', year: 2024 },
    { label: 'Top 25 Island Hotels', source: 'Travel + Leisure', year: 2023 },
    { label: 'Sustainable Stay Award', source: 'Green Globe', year: 2024 },
  ],
}

export function getAboutContent(): AboutContent {
  return ABOUT
}
