import { useCallback, useState } from 'react'
import { Play } from 'lucide-react'

import { MediaLightbox } from '#/components/gallery/media-lightbox'
import type { GalleryItem } from '#/types'

const VIDEO: GalleryItem = {
  id: 'about-tour',
  kind: 'video',
  src: '/videos/about-tour.mp4',
  thumb: '/videos/about-tour-poster.webp',
  w: 1024,
  h: 576,
  alt: 'Treasure Island Ada — video tour',
}

// Large tile: poster with a pulsing play button that opens the tour in a modal.
export function GalleryVideoTile() {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const step = useCallback(() => {}, [])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Play the Treasure Island Ada video tour"
        className="img-frame group relative col-span-2 row-span-2 overflow-hidden bg-black"
      >
        <img
          src={VIDEO.thumb}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-black/15 transition-colors group-hover:bg-black/25">
          <span className="play-fab relative flex size-16 items-center justify-center rounded-full bg-lagoon-deep text-white transition-transform dark:text-black/80 group-hover:scale-105 group-active:scale-95 md:size-20">
            <span aria-hidden className="play-fab-ping" />
            <span aria-hidden className="play-fab-ping" />
            <Play
              aria-hidden
              className="ml-1 size-7 fill-current transition-transform group-hover:-rotate-6 md:size-8"
            />
          </span>
        </span>
      </button>

      {open ? (
        <MediaLightbox
          items={[VIDEO]}
          index={0}
          onClose={close}
          onStep={step}
        />
      ) : null}
    </>
  )
}
