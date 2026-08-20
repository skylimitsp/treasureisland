import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

// Mosaic gallery (1 large + thumbs) with a focus-trapped lightbox.
export function RoomGallery({
  images,
  name,
}: {
  images: Array<string>
  name: string
}) {
  const [open, setOpen] = useState<number | null>(null)

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') setOpen((i) => ((i ?? 0) + 1) % images.length)
      if (e.key === 'ArrowLeft')
        setOpen((i) => ((i ?? 0) - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, images.length])

  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-3">
      {images.slice(0, 5).map((src, i) => (
        <button
          key={src + i}
          type="button"
          onClick={() => setOpen(i)}
          data-reveal
          className={`img-frame group overflow-hidden ${
            i === 0
              ? 'col-span-4 row-span-2 md:col-span-2'
              : 'col-span-2 md:col-span-1'
          }`}
        >
          <img
            src={src}
            alt={`${name} — photo ${i + 1}`}
            loading={i === 0 ? 'eager' : 'lazy'}
            className="h-full w-full object-cover"
          />
        </button>
      ))}

      {open !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${name} gallery`}
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
            src={images[open]}
            alt={`${name} — photo ${open + 1}`}
            className="max-h-[86vh] max-w-full rounded-md object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </div>
  )
}
