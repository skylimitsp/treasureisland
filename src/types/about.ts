// Content model for the About page (single source of truth).

export interface AboutStat {
  label: string
  value: number
  suffix?: string
  countUp?: boolean
}

export interface AboutHost {
  name: string
  role: string
  quote: string
  bioBlocks: Array<string>
  photo: string
  photoAlt: string
}

export interface AboutValue {
  icon: 'leaf' | 'users' | 'palm'
  title: string
  headline: string
  body: string
  image: string
  tag: string
}

export interface GalleryImage {
  src: string
  alt: string
}

export interface AboutAward {
  label: string
  source: string
  year: number
}

export interface AboutContent {
  kicker: string
  lead: string
  story: Array<string>
  stats: Array<AboutStat>
  host: AboutHost
  values: Array<AboutValue>
  gallery: Array<GalleryImage>
  awards: Array<AboutAward>
}
