import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

import type { GalleryItem } from '#/types'

// Full-screen viewer, portalled to <body> so animated (transformed) ancestors
// can't trap it. Arrow keys step, Escape closes, page scroll is locked.
export function MediaLightbox({
  items,
  index,
  onClose,
  onStep,
}: {
  items: Array<GalleryItem>
  index: number
  onClose: () => void
  onStep: (delta: number) => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const item = items[index]

  useEffect(() => {
    closeRef.current?.focus()
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onStep(1)
      if (e.key === 'ArrowLeft') onStep(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, onStep])

  const navBtn =
    'absolute top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/30'

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Gallery viewer"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 px-4 py-16"
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        aria-label="Close viewer"
        onClick={onClose}
        className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30"
      >
        <X aria-hidden />
      </button>

      <div
        className="flex max-h-full max-w-full items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {item.kind === 'video' ? (
          <video
            key={item.id}
            src={item.src}
            poster={item.thumb}
            controls
            autoPlay
            playsInline
            className="max-h-[80vh] max-w-full rounded-md bg-black"
          />
        ) : (
          <img
            key={item.id}
            src={item.src}
            alt={item.alt}
            className="max-h-[80vh] max-w-full rounded-md object-contain"
          />
        )}
      </div>

      <p
        className="mt-4 text-center text-sm text-white/85"
        onClick={(e) => e.stopPropagation()}
      >
        {item.alt}
        {items.length > 1 ? (
          <span className="ml-3 text-white/50 tabular-nums">
            {index + 1} / {items.length}
          </span>
        ) : null}
      </p>

      {items.length > 1 ? (
        <>
          <button
            type="button"
            aria-label="Previous"
            onClick={(e) => {
              e.stopPropagation()
              onStep(-1)
            }}
            className={`${navBtn} left-3 md:left-6`}
          >
            <ChevronLeft aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={(e) => {
              e.stopPropagation()
              onStep(1)
            }}
            className={`${navBtn} right-3 md:right-6`}
          >
            <ChevronRight aria-hidden />
          </button>
        </>
      ) : null}
    </div>,
    document.body,
  )
}
