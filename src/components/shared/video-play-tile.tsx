import { useCallback, useState } from 'react'
import { Play } from 'lucide-react'

import { MediaLightbox } from '#/components/gallery/media-lightbox'
import type { GalleryItem } from '#/types'

// Poster tile with a pulsing play button that opens the video in a modal.
export function VideoPlayTile({
  video,
  className = '',
}: {
  video: GalleryItem
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const step = useCallback(() => {}, [])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Play video: ${video.alt}`}
        className={`img-frame group relative overflow-hidden bg-black ${className}`}
      >
        <img
          src={video.thumb}
          alt=""
          decoding="async"
          // Overrides .img-frame's dusk crop; portrait clips keep heads in frame.
          style={{ objectPosition: '50% 25%' }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-black/15 transition-colors group-hover:bg-black/25">
          <span className="play-fab relative flex size-16 items-center justify-center rounded-full bg-lagoon-deep text-white transition-transform group-hover:scale-105 group-active:scale-95 md:size-20 dark:text-black/80">
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
          items={[video]}
          index={0}
          onClose={close}
          onStep={step}
        />
      ) : null}
    </>
  )
}
