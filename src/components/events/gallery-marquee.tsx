import { useEffect, useState } from 'react'
import MarqueeModule from 'react-fast-marquee'

import { cn } from '#/lib/utils'

// CJS package: Vite's dep optimizer can hand back the module object in dev.
const Marquee = (
  'default' in MarqueeModule ? MarqueeModule.default : MarqueeModule
) as typeof MarqueeModule

// Event photos at 640px tall; width keeps each photo's own aspect ratio.
const PHOTOS = [
  { src: 'event-01', w: 426, alt: 'A long banquet table dressed in orange' },
  { src: 'event-02', w: 960, alt: 'A gold dessert table with white florals' },
  { src: 'event-04', w: 1001, alt: 'A cocktail bar set up on the terrace' },
  { src: 'event-05', w: 971, alt: 'A birthday photo wall with a balloon arch' },
  { src: 'event-06', w: 960, alt: 'A waterfront deck set for guests' },
  { src: 'event-07', w: 426, alt: 'A guest in a white gown on the boardwalk' },
  { src: 'event-08', w: 424, alt: 'Guests in white and gold outfits' },
  { src: 'event-09', w: 960, alt: 'A group in matching white and gold' },
  { src: 'event-10', w: 500, alt: 'Celebrants at a 50th birthday backdrop' },
  { src: 'event-11', w: 960, alt: 'Guests posing at the birthday photo wall' },
  { src: 'event-12', w: 426, alt: 'Guests with a horse beside the hotel' },
  { src: 'event-13', w: 410, alt: 'A bride beside the horse-drawn carriage' },
  { src: 'event-14', w: 426, alt: 'A guest in pink on the palm-lined walk' },
]

type Photo = (typeof PHOTOS)[number]

// Fisher–Yates shuffle, then deal alternately into the two rows.
function dealRows(photos: Array<Photo>, shuffle: boolean) {
  const list = [...photos]
  if (shuffle) {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[list[i], list[j]] = [list[j], list[i]]
    }
  }
  return [
    list.filter((_, i) => i % 2 === 0),
    list.filter((_, i) => i % 2 === 1),
  ]
}

// Two endless, shuffled photo rows drifting in opposite directions.
export function GalleryMarquee({ className }: { className?: string }) {
  const [play, setPlay] = useState(true)
  // Server and first client render share one order; shuffle after mount.
  const [rows, setRows] = useState(() => dealRows(PHOTOS, false))

  useEffect(() => {
    setPlay(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    setRows(dealRows(PHOTOS, true))
  }, [])

  return (
    <div
      className={cn('grid gap-4', className)}
      style={{
        maskImage:
          'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
      }}
    >
      {rows.map((row, i) => (
        <Marquee
          key={i}
          direction={i === 0 ? 'left' : 'right'}
          speed={35}
          play={play}
          pauseOnHover
          autoFill
        >
          {row.map((photo) => (
            <img
              key={photo.src}
              src={`/events/gallery/${photo.src}.webp`}
              alt={photo.alt}
              width={photo.w}
              height={640}
              loading="lazy"
              decoding="async"
              className="mr-4 h-48 w-auto rounded-md object-cover md:h-64"
            />
          ))}
        </Marquee>
      ))}
    </div>
  )
}
