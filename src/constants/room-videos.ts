import type { GalleryItem } from '#/types'

// Room tours shown while the room listings are switched off (see FEATURES).
export const ROOMS_TOUR: GalleryItem = {
  id: 'rooms-tour',
  kind: 'video',
  src: '/videos/rooms-tour.mp4',
  thumb: '/videos/rooms-tour-cover.webp',
  w: 1024,
  h: 576,
  alt: 'Rooms & suites — video tour',
}

export const ROOMS_TOUR_2: GalleryItem = {
  id: 'rooms-tour-2',
  kind: 'video',
  src: '/videos/rooms-tour-2.mp4',
  thumb: '/videos/rooms-tour-2-poster.webp',
  w: 464,
  h: 832,
  alt: 'Room types — video tour',
}
