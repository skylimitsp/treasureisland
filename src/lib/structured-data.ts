/**
 * schema.org JSON-LD builders (see docs/seo.md §3–4). Each returns a plain,
 * serialisable node with absolute URLs; pass results to `seo({ jsonLd })`.
 * @author Joseph Nartey
 * @github devjoemedia
 */
import { CONTACT, SITE } from '#/constants/site'
import type { MenuItem, MenuSection, Room } from '#/types'

const CONTEXT = 'https://schema.org'

function abs(path: string): string {
  return path.startsWith('http') ? path : `${SITE.url}${path}`
}

export function organizationLd() {
  return {
    '@context': CONTEXT,
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url,
    logo: abs(SITE.ogImage),
    email: CONTACT.email,
    telephone: CONTACT.phone,
  }
}

// WebSite node with a sitelinks search box target.
export function websiteLd() {
  return {
    '@context': CONTEXT,
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE.url}/rooms?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

// The resort itself — powers the hotel rich result on the home page.
export function lodgingBusinessLd(input?: {
  rating?: number
  reviewCount?: number
  priceRange?: string
}) {
  return {
    '@context': CONTEXT,
    '@type': 'Resort',
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    image: abs(SITE.ogImage),
    telephone: CONTACT.phone,
    email: CONTACT.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: CONTACT.locality,
      addressRegion: CONTACT.region,
      addressCountry: 'GH',
    },
    openingHours: 'Mo-Su 00:00-23:59',
    priceRange: input?.priceRange ?? '$$$',
    ...(input?.rating && input.reviewCount
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: input.rating,
            reviewCount: input.reviewCount,
          },
        }
      : {}),
  }
}

export function breadcrumbLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  }
}

export function faqLd(qas: Array<{ q: string; a: string }>) {
  return {
    '@context': CONTEXT,
    '@type': 'FAQPage',
    mainEntity: qas.map((qa) => ({
      '@type': 'Question',
      name: qa.q,
      acceptedAnswer: { '@type': 'Answer', text: qa.a },
    })),
  }
}

// A bookable room with its nightly Offer — the headline booking rich result.
export function hotelRoomLd(
  room: Room,
  opts: { path: string; available?: boolean },
) {
  return {
    '@context': CONTEXT,
    '@type': 'HotelRoom',
    name: room.name,
    description: room.description,
    url: abs(opts.path),
    image: abs(room.image),
    occupancy: {
      '@type': 'QuantitativeValue',
      maxValue: room.maxGuests,
      unitText: 'guests',
    },
    offers: {
      '@type': 'Offer',
      price: room.pricePerNight,
      priceCurrency: 'USD',
      url: abs(opts.path),
      availability:
        opts.available === false
          ? 'https://schema.org/SoldOut'
          : 'https://schema.org/InStock',
    },
  }
}

// ItemList of rooms for the /rooms listing page.
export function roomListLd(rooms: Array<Room>) {
  return {
    '@context': CONTEXT,
    '@type': 'ItemList',
    itemListElement: rooms.map((room, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: abs(`/rooms/${room.slug}`),
      name: room.name,
    })),
  }
}

// The restaurant menu as schema.org Menu, built from the same data the page renders.
export function menuLd(items: Array<MenuItem>, sections: Array<MenuSection>) {
  return {
    '@context': CONTEXT,
    '@type': 'Menu',
    name: `${SITE.name} restaurant menu`,
    url: abs('/menu'),
    inLanguage: 'en',
    hasMenuSection: sections.map((section) => ({
      '@type': 'MenuSection',
      name: section.title,
      hasMenuItem: items
        .filter((i) => i.available && i.category === section.id)
        .map((i) => ({
          '@type': 'MenuItem',
          name: i.name,
          description: i.description,
          offers: {
            '@type': 'Offer',
            price: i.price,
            priceCurrency: 'USD',
          },
        })),
    })),
  }
}
