import { useState } from 'react'

import { AmenityLightbox } from '#/components/amenities/amenity-lightbox'
import { SectionKicker } from '#/components/shared/section-kicker'
import { useGsap } from '#/hooks/use-gsap'
import { gsap, ScrollTrigger } from '#/lib/gsap'
import { ResponsiveImage } from '#/components/shared/responsive-image'
import { VideoPlayTile } from '#/components/shared/video-play-tile'
import type { GalleryItem } from '#/types'

// Mosaic gallery with a clip-wipe image-reveal per tile and a full-screen
// lightbox. An optional video leads as the large tile and plays in a modal.
export function AmenityGallery({
  images,
  name,
  video,
}: {
  images: Array<string>
  name: string
  video?: string
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

  const tiles = images.length + (video ? 1 : 0)
  // Hidden with fewer than two tiles (the hero already shows one photo).
  if (tiles < 2) return null
  // A pair sits side by side; three or more lead with one large tile.
  const pair = tiles === 2
  const lead = video && !pair ? 'col-span-2 sm:row-span-2' : ''
  const clip: GalleryItem | null = video
    ? {
        id: video,
        kind: 'video',
        src: `${video}.mp4`,
        thumb: `${video}-poster.webp`,
        w: 0,
        h: 0,
        alt: `${name} — video`,
      }
    : null

  return (
    <section ref={ref} data-reveal>
      <SectionKicker>Gallery</SectionKicker>
      <h2 className="display-title mt-2 text-2xl md:text-3xl">A closer look</h2>

      <div
        className={`mt-6 grid grid-cols-2 sm:auto-rows-[minmax(0,1fr)] gap-3 sm:gap-4 ${
          pair ? '' : 'lg:grid-cols-3'
        }`}
      >
        {clip ? (
          <VideoPlayTile
            video={clip}
            className={`${lead} ${pair ? 'aspect-[4/5]' : 'aspect-[4/3] lg:aspect-auto'}`}
          />
        ) : null}
        {images.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={`Open photo ${i + 1} of ${images.length}`}
            className={`img-frame group relative overflow-hidden rounded-md border border-line ${
              i === 0 && !pair && !video ? 'col-span-2 sm:row-span-2' : ''
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
                  : i === 0 && !video
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
