import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { ResponsiveImage } from '#/components/shared/responsive-image'

const PHOTOS = [
  { src: '/photos/aerial-resort.webp', alt: 'Treasure Island Ada from above' },
  {
    src: '/photos/ocean-deck-dining.webp',
    alt: 'Guests dining on the waterside deck',
  },
  {
    src: '/photos/infinity-lounge.webp',
    alt: 'Rooftop terrace and suites at dusk',
  },
  { src: '/events/wedding-carriage.webp', alt: 'A wedding carriage arrival' },
  { src: '/rooms/room-1.webp', alt: 'A guest bedroom' },
  { src: '/rooms/room-5.webp', alt: 'A loft bedroom' },
  { src: '/rooms/room-6.webp', alt: 'A bedroom with a feature wall' },
]
const [LARGE, ...REST] = PHOTOS
const RIGHT = REST.slice(0, 2)
const THUMBS = REST.slice(2)
const ALL = PHOTOS

// Gallery mosaic matching the StayBox layout: one large tile + two stacked on
// the right, then a row of four thumbnails, with a focus-trapped lightbox.
export function DetailGallery() {
  const [open, setOpen] = useState<number | null>(null)

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') setOpen((i) => ((i ?? 0) + 1) % ALL.length)
      if (e.key === 'ArrowLeft')
        setOpen((i) => ((i ?? 0) - 1 + ALL.length) % ALL.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const tile = (photo: (typeof PHOTOS)[number], i: number, extra = '') => (
    <button
      type="button"
      key={photo.src}
      onClick={() => setOpen(i)}
      aria-label={`View larger: ${photo.alt}`}
      className={`img-frame group overflow-hidden ${extra}`}
    >
      <ResponsiveImage
        sizes="(min-width: 1024px) 45vw, 100vw"
        src={photo.src}
        alt=""
        loading={i === 0 ? 'eager' : 'lazy'}
        fetchPriority={i === 0 ? 'high' : 'auto'}
        decoding="async"
        className="h-full w-full object-cover"
      />
    </button>
  )

  return (
    <div>
      <div className="grid aspect-[16/10] grid-cols-3 grid-rows-2 gap-3">
        {tile(LARGE, 0, 'col-span-2 row-span-2')}
        {tile(RIGHT[0], 1)}
        {tile(RIGHT[1], 2)}
      </div>
      <div className="mt-3 grid grid-cols-4 gap-3">
        {THUMBS.map((photo, i) => tile(photo, i + 3, 'aspect-[4/3]'))}
      </div>

      {open !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Resort gallery"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpen(null)}
        >
          <button
            type="button"
            aria-label="Close gallery"
            className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full bg-white/15 text-white"
            onClick={() => setOpen(null)}
          >
            <X aria-hidden />
          </button>
          <ResponsiveImage
            sizes="100vw"
            src={ALL[open].src}
            alt={ALL[open].alt}
            className="max-h-[86vh] max-w-full rounded-md object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </div>
  )
}
