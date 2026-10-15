import { useState } from 'react'
import { Play } from 'lucide-react'

import { formatDuration } from '#/lib/format'
import type { GalleryItem } from '#/types'

// One masonry tile. Videos show their poster and only load a muted preview
// while hovered with a mouse, so a grid of films stays light.
export function MediaTile({
  item,
  index,
  onOpen,
}: {
  item: GalleryItem
  index: number
  onOpen: () => void
}) {
  const [preview, setPreview] = useState(false)
  const isVideo = item.kind === 'video'

  return (
    <button
      type="button"
      onClick={onOpen}
      onPointerEnter={(e) => {
        if (isVideo && e.pointerType === 'mouse') setPreview(true)
      }}
      onPointerLeave={() => setPreview(false)}
      aria-label={
        isVideo ? `Play video: ${item.alt}` : `View photo: ${item.alt}`
      }
      className="rise-in group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-md bg-foam sm:mb-4"
      style={{
        aspectRatio: `${item.w} / ${item.h}`,
        animationDelay: `${Math.min(index, 12) * 40}ms`,
      }}
    >
      <img
        src={item.thumb}
        alt=""
        width={item.w}
        height={item.h}
        loading={index < 8 ? 'eager' : 'lazy'}
        decoding="async"
        className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />
      {isVideo && preview ? (
        <video
          src={item.src}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
          className="absolute inset-0 size-full object-cover"
        />
      ) : null}

      <span
        className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      />
      {isVideo ? (
        <span
          className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 py-1 pl-1.5 pr-2.5 text-xs font-semibold text-white backdrop-blur"
          aria-hidden
        >
          <span className="flex size-5 items-center justify-center rounded-full bg-white text-footer">
            <Play size={10} fill="currentColor" />
          </span>
          {item.duration ? formatDuration(item.duration) : 'Video'}
        </span>
      ) : null}
    </button>
  )
}
