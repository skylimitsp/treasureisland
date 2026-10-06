// Content model for the About page — the official "Message from Manager".

export interface GalleryImage {
  src: string
  alt: string
}

export interface AboutContent {
  kicker: string
  title: string
  subtitle: string
  tagline: string
  paragraphs: Array<string>
  services: string
  gallery: Array<GalleryImage>
}
