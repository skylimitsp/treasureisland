import type { Faq, Review, Testimonial } from '#/types'
import type { AboutContent } from '#/types/about'

// Official guest testimonials from treasureislandghana.com — API swap seam.
const TESTIMONIALS: Array<Testimonial> = [
  {
    id: 't1',
    quote:
      'The service here has just been fantastic; whatever we needed was brought to us right away. Our event coordinator was amazing, she has been most helpful. The food was so delicious; the entire experience was really great.',
    name: 'Jeff Bans',
    origin: 'CEO of Touristlink',
  },
  {
    id: 't2',
    quote:
      'I am impressed with Treasure Island. They are actually newer than some new hotels as they are continuously improving their product and adding new facilities.',
    name: 'Nathaniel Asante',
    origin: 'Businessman',
  },
  {
    id: 't3',
    quote:
      'Truly a home away from home, the 3-bedroom apartment style Supreme’s is my family and I’s favorite. It has everything from a living room to a kitchen section.',
    name: 'Akosua C. Boateng',
    origin: 'Guest · 3 Bedroom Supreme',
  },
]

// FAQs built only from official facts — also feed FAQPage structured data.
const FAQS: Array<Faq> = [
  {
    q: 'Where is Treasure Island Ada?',
    a: 'Treasure Island Ada is a private island resort in Ada Foah, near the estuary of the Atlantic Ocean & Volta River in Ghana.',
  },
  {
    q: 'How do I get to Treasure Island from Accra?',
    a: 'Ada Foah is roughly 100 km from Accra, about 2 hours by road. Tro-tros (shared minibuses) run from major stations including Accra’s Tema Station, and taxis or private cars offer direct routes. The resort sits on an island in the Volta River, so the final stretch is a river crossing by boat.',
  },
  {
    q: 'When are you open?',
    a: 'We are open 24 hours. Visit us any day, Monday through Sunday, 24/7, to experience our various types of services and amenities. A warm welcome awaits you.',
  },
  {
    q: 'What kinds of rooms do you have?',
    a: 'Accommodations range from individual “home style” chalets to standard rooms, waterfront rooms, deluxe rooms and suites with balconies, and penthouses with a private pool or big jacuzzi.',
  },
  {
    q: 'Do you host weddings, parties and meetings?',
    a: 'Yes. We host weddings, birthday parties, family parties and meetings, with great group rates and customized packages to suit your needs.',
  },
  {
    q: 'How do I make a booking?',
    a: 'Call (+233)-055-270-1946, WhatsApp (+233)-30-291-8140 or email reservations@treasureislandghana.com. Mobile Money payments: (+233)-24-842-3724.',
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

// Official About copy ("A Message from Manager") — keep verbatim.
const ABOUT: AboutContent = {
  kicker: 'A Message from Manager',
  title: 'Welcome to Treasure island Ada',
  subtitle: 'Where Fun and Excitement await you',
  tagline:
    'IDEALLY SITUATED BETWEEN WONDER AND WONDERFUL; ON A PRIVATE ISLAND NEAR THE ESTUARY OF THE ATLANTIC OCEAN & VOLTA RIVER.',
  paragraphs: [
    'Leave the everyday behind and enter a world of wonder and enchantment at Treasure Island Hotels & Resort in Ada, Ghana.  Located in the heart of the most magical place in Ghana, Treasure Island Hotel & Resorts, in Ada Foah, provides a truly extraordinary backdrop for your Ghana vacation, getaway or meetings.  Beautiful tropical landscaping, tranquil waterways & classic art and architecture work together to create a stunning landmark in the midst of one of the most spectacular places on earth, situated right near the Volta River & The Atlantic Ocean’s estuary.',
    'Inside our magnificent Treasure Island Hotel & Resorts in Ada, Ghana, an environment of elegance and sophistication awaits you. From our spectacular water slides and unique architecture to our incredibly comfortable guest rooms, 12D Cinema, Game Room, Horse Back Riding, Camel Riding, etc., we offer the ultimate escape just moments away from the thrill and excitement of the island.',
    'Accommodations range from individual “home style” chalets, to standard rooms, water front boat house rooms, penthouses overlooking the Atlantic Ocean & breathtaking Volta River. Our stylish lobbies provide guests with a warm and inviting welcome and a distinct sense of arrival. Treasure Island Ada, guest rooms include custom draperies, upgraded technology and of course, all rooms feature incredibly comfortable beds. We have great group rates, and customized packages to suit your needs.',
  ],
  services:
    'We offer various types of services ranging from but not limited to, home style chalets, penthouses, deluxe rooms with balconies, standard rooms, 12D cinema, game centre, conference centre, night club, full bar and restaurant, boating, jet skiing, horse back riding, petting zoo and a lot more.',
  gallery: [
    {
      src: '/photos/aerial-resort.webp',
      alt: 'Treasure Island Ada from above',
    },
    {
      src: '/photos/pool-at-night.webp',
      alt: 'The pool and jacuzzis lit up at night',
    },
    {
      src: '/photos/palm-pool-aerial.webp',
      alt: 'The pool and water slide from above',
    },
    { src: '/rooms/suite-bedroom.webp', alt: 'A suite bedroom' },
    { src: '/events/wedding-ceremony.webp', alt: 'A wedding celebration' },
    {
      src: '/photos/jetski-trail.webp',
      alt: 'A jet ski on the Volta River',
    },
  ],
}

export function getAboutContent(): AboutContent {
  return ABOUT
}
