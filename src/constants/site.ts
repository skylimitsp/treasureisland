// Site-wide identity, contact details and SEO defaults (official, from
// treasureislandghana.com — see ../docs/official-content.md).

export const SITE = {
  name: 'Treasure Island Ada',
  defaultTitle:
    'Treasure Island Ada · Private Island Resort in Ada Foah, Ghana',
  description:
    'A private island resort near the estuary of the Atlantic Ocean & Volta ' +
    'River in Ada Foah, Ghana. Chalets, penthouses, 12D cinema, boat cruises, ' +
    'horse riding, weddings and meetings.',
  url: 'https://treasureislandghana.com',
  ogImage: '/photos/og-default.jpg',
  twitter: undefined as string | undefined,
  locale: 'en_GH',
} as const

export const CONTACT = {
  phone: '(+233)-055-270-1946',
  phoneHref: 'tel:+233552701946',
  whatsapp: '(+233)-30-291-8140',
  whatsappHref: 'https://wa.me/233302918140',
  mobileMoney: '(+233)-24-842-3724',
  email: 'reservations@treasureislandghana.com',
  locality: 'Ada Foah',
  region: 'Volta Region',
  country: 'Ghana',
  hours: '24 Hours',
} as const
