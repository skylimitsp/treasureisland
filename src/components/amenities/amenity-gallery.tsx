import { useState } from 'react'

import { AmenityLightbox } from '#/components/amenities/amenity-lightbox'
import { SectionKicker } from '#/components/shared/section-kicker'
import { useGsap } from '#/hooks/use-gsap'
import { gsap, ScrollTrigger } from '#/lib/gsap'
import { ResponsiveImage } from '#/components/shared/responsive-image'

// Mosaic gallery with a clip-wipe image-reveal per tile and a full-screen
// lightbox. Hidden with fewer than two photos (the hero already shows one).
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

  if (images.length < 2) return null
  // A pair sits side by side; three or more lead with one large tile.
  const pair = images.length === 2

  return (
    <section ref={ref} data-reveal>
      <SectionKicker>Gallery</SectionKicker>
      <h2 className="display-title mt-2 text-2xl md:text-3xl">A closer look</h2>

      <div
        className={`mt-6 grid grid-cols-2 sm:auto-rows-[minmax(0,1fr)] gap-3 sm:gap-4 ${
          pair ? '' : 'lg:grid-cols-3'
        }`}
      >
        {images.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={`Open photo ${i + 1} of ${images.length}`}
            className={`img-frame group relative overflow-hidden rounded-md border border-line ${
              i === 0 && !pair ? 'col-span-2 sm:row-span-2' : ''
            }`}
          >
            <ResponsiveImage
              data-gallery
              src={src}
              alt={`${name} — photo ${i + 1}`}
              loading="lazy"
              decoding="async"
              className={`h-full w-full object-cover ${
                pair
                  ? 'aspect-[4/5]'
                  : i === 0
                    ? 'aspect-[4/3] sm:h-full'
                    : 'aspect-[4/3]'
              }`}
            />
          </button>
        ))}
      </div>

      {open !== null ? (
        <AmenityLightbox
          images={images}
          name={name}
          index={open}
          onClose={() => setOpen(null)}
          onSelect={setOpen}
        />
      ) : null}
    </section>
  )
}
