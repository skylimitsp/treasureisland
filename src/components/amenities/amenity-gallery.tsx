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
  videoAt = 0,
  videoTitle,
}: {
  images: Array<string>
  name: string
  video?: string
  videoAt?: number
  videoTitle?: string
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

  const clip: GalleryItem | null = video
    ? {
        id: video,
        kind: 'video',
        src: `${video}.mp4`,
        thumb: `${video}-poster.webp`,
        w: 0,
        h: 0,
        alt: videoTitle ?? `${name} — video`,
      }
    : null
  // Photos keep their lightbox index; the video slots in at `videoAt`.
  const tiles: Array<number | 'video'> = images.map((_, i) => i)
  if (clip) tiles.splice(Math.min(videoAt, tiles.length), 0, 'video')
  // Hidden with fewer than two tiles (the hero already shows one photo).
  if (tiles.length < 2) return null
  // A pair sits side by side; three or more lead with one large tile.
  const pair = tiles.length === 2
  const span = (slot: number) =>
    slot === 0 && !pair ? 'col-span-2 sm:row-span-2' : ''

  return (
    <section ref={ref} data-reveal>
      <SectionKicker>Gallery</SectionKicker>
      <h2 className="display-title mt-2 text-2xl md:text-3xl">A closer look</h2>

      <div
        className={`mt-6 grid grid-cols-2 sm:auto-rows-[minmax(0,1fr)] gap-3 sm:gap-4 ${
          pair ? '' : 'lg:grid-cols-3'
        }`}
      >
        {tiles.map((tile, slot) =>
          tile === 'video' ? (
            <VideoPlayTile
              key="video"
              video={clip!}
              className={`${span(slot)} ${
                pair
                  ? 'aspect-[4/5]'
                  : slot === 0
                    ? 'aspect-[4/3] lg:aspect-auto'
                    : 'aspect-[4/3]'
              }`}
            />
          ) : (
            <button
              key={images[tile] + tile}
              type="button"
              onClick={() => setOpen(tile)}
              aria-label={`Open photo ${tile + 1} of ${images.length}`}
              className={`img-frame group relative overflow-hidden rounded-md border border-line ${span(slot)}`}
            >
              <ResponsiveImage
                data-gallery
                src={images[tile]}
                alt={`${name} — photo ${tile + 1}`}
                loading="lazy"
                decoding="async"
                className={`h-full w-full object-cover ${
                  pair
                    ? 'aspect-[4/5]'
                    : slot === 0
                      ? 'aspect-[4/3] sm:h-full'
                      : 'aspect-[4/3]'
                }`}
              />
            </button>
          ),
        )}
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
