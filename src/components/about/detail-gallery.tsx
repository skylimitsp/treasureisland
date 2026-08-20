import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

const LARGE = '/rooms/room1.jpg'
const RIGHT = ['/amenities/restaurant.webp', '/amenities/jacuzzi.webp']
const THUMBS = [
  '/wedding.webp',
  '/heroes/escape.jpg',
  '/rooms/room5.jpg',
  '/rooms/room6.jpg',
]
const ALL = [LARGE, ...RIGHT, ...THUMBS]

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

  const tile = (src: string, i: number, extra = '') => (
    <button
      type="button"
      onClick={() => setOpen(i)}
      className={`img-frame group overflow-hidden ${extra}`}
    >
      <img
        src={src}
        alt={`Treasure Island — photo ${i + 1}`}
        loading={i === 0 ? 'eager' : 'lazy'}
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
        {THUMBS.map((src, i) => tile(src, i + 3, 'aspect-[4/3]'))}
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
          <img
            src={ALL[open]}
            alt={`Treasure Island — photo ${open + 1}`}
            className="max-h-[86vh] max-w-full rounded-md object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </div>
  )
}
