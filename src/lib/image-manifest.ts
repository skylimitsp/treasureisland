// Widths of /public images and whether AVIF / 800w variants exist.

export interface ImageMeta {
  w: number
  h: number
  avif: boolean
  sm: boolean // has a -800 variant
}

export const IMAGE_MANIFEST: Record<string, ImageMeta | undefined> = {
  '/events/wedding-carriage-wide.webp': {
    w: 1024,
    h: 768,
    avif: true,
    sm: true,
  },
  '/events/wedding-carriage.webp': { w: 768, h: 1024, avif: true, sm: false },
  '/events/wedding-ceremony.webp': { w: 768, h: 1024, avif: true, sm: false },
  '/photos/aerial-resort.webp': { w: 1440, h: 1080, avif: true, sm: true },
  '/photos/beach-hero.webp': { w: 1618, h: 1078, avif: true, sm: true },
  '/photos/breakfast.webp': { w: 1066, h: 1600, avif: true, sm: true },
  '/photos/conference-hall.webp': { w: 1620, h: 1080, avif: true, sm: true },
  '/photos/horse-riding.webp': { w: 2000, h: 1367, avif: true, sm: true },
  '/photos/infinity-lounge.webp': { w: 1440, h: 1080, avif: true, sm: true },
  '/photos/island-shore.webp': { w: 1920, h: 1080, avif: true, sm: true },
  '/photos/jetski-loop.webp': { w: 864, h: 1080, avif: true, sm: false },
  '/photos/jetski-trail.webp': { w: 720, h: 1080, avif: true, sm: false },
  '/photos/lagoon-sunset.webp': { w: 1920, h: 1080, avif: true, sm: true },
  '/photos/lantern-terrace.webp': { w: 2000, h: 1333, avif: true, sm: true },
  '/photos/ocean-deck-dining.webp': { w: 1440, h: 1080, avif: true, sm: true },
  '/photos/palm-pool-aerial.webp': { w: 864, h: 1080, avif: true, sm: false },
  '/photos/pool-at-night.webp': { w: 1620, h: 1080, avif: true, sm: true },
  '/photos/pool-loungers.webp': { w: 1618, h: 1078, avif: true, sm: true },
  '/photos/resort-night.webp': { w: 1920, h: 1080, avif: true, sm: true },
  '/rooms/garden-view.webp': { w: 1600, h: 1066, avif: true, sm: true },
  '/rooms/kitchenette.webp': { w: 1600, h: 1066, avif: true, sm: true },
  '/rooms/living-area.webp': { w: 1600, h: 1066, avif: true, sm: true },
  '/rooms/room-1.webp': { w: 1600, h: 1066, avif: true, sm: true },
  '/rooms/room-2.webp': { w: 1440, h: 1080, avif: true, sm: true },
  '/rooms/room-3.webp': { w: 720, h: 1080, avif: true, sm: false },
  '/rooms/room-5.webp': { w: 1600, h: 1066, avif: true, sm: true },
  '/rooms/room-6.webp': { w: 1080, h: 1080, avif: true, sm: true },
  '/rooms/suite-bedroom.webp': { w: 1600, h: 1066, avif: true, sm: true },
}
