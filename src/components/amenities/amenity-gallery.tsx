import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

import { SectionKicker } from '#/components/shared/section-kicker'
import { useGsap } from '#/hooks/use-gsap'
import { gsap, ScrollTrigger } from '#/lib/gsap'

// Mosaic gallery with a clip-wipe image-reveal per tile and a keyboard-driven
// lightbox. An empty gallery (e.g. 12D Cinema) shows dark placeholder tiles.
export function AmenityGallery({
  images,
  name,
}: {
  images: Array<string>
  name: string
}) {
  const [open, setOpen] = useState<number | null>(null)

  const ref = useGsap<HTMLElement>((self) => {
    const tiles = gsap.utils.toArray<HTMLElement>('[data-gallery]', self)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    tiles.forEach((tile) => {
      gsap.fromTo(
        tile,
        { clipPath: 'inset(0 100% 0 0)', scale: 1.08 },
        {
          clipPath: 'inset(0 0% 0 0)',
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: tile, start: 'top 82%' },
        },
      )
    })
    window.addEventListener('load', () => ScrollTrigger.refresh(), {
      once: true,
    })
  })

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
    <section ref={ref} data-reveal>
      <SectionKicker>Gallery</SectionKicker>
      <h2 className="display-title mt-2 text-2xl md:text-3xl">A closer look</h2>

      {images.length === 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="img-frame flex aspect-[4/3] items-center justify-center rounded-md border border-line bg-sea-ink text-sm text-white/60"
            >
              Photography coming soon
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 grid auto-rows-[minmax(0,1fr)] gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setOpen(i)}
              className={`img-frame group relative overflow-hidden rounded-md border border-line ${
                i === 0 ? 'sm:col-span-2 sm:row-span-2' : ''
              }`}
            >
              <img
                data-gallery
                src={src}
                alt={`${name} — photo ${i + 1}`}
                loading="lazy"
                className={`h-full w-full object-cover ${
                  i === 0 ? 'aspect-[4/3] sm:h-full' : 'aspect-[4/3]'
                }`}
              />
            </button>
          ))}
        </div>
      )}

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
    </section>
  )
}
