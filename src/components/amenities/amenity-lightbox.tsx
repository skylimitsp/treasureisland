import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

import { ResponsiveImage } from '#/components/shared/responsive-image'

// Portalled to <body> so transformed (GSAP-animated) ancestors can't trap the
// fixed overlay. Arrows/swipe step, Escape closes, page scroll is locked.
export function AmenityLightbox({
  images,
  name,
  index,
  onClose,
  onSelect,
}: {
  images: Array<string>
  name: string
  index: number
  onClose: () => void
  onSelect: (index: number) => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const touchX = useRef<number | null>(null)
  const count = images.length
  const step = (delta: number) => onSelect((index + delta + count) % count)

  useEffect(() => {
    closeRef.current?.focus()
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onSelect((index + 1) % count)
      if (e.key === 'ArrowLeft') onSelect((index - 1 + count) % count)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, count, onClose, onSelect])

  const navBtn =
    'absolute top-1/2 z-10 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/30 sm:flex'

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${name} gallery`}
      className="fixed inset-0 z-[200] flex flex-col bg-black"
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-4 py-3 text-white sm:px-6">
        <p className="text-sm tabular-nums text-white/80">
          {index + 1} / {count}
        </p>
        <button
          ref={closeRef}
          type="button"
          aria-label="Close gallery"
          onClick={onClose}
          className="flex size-11 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/30"
        >
          <X aria-hidden />
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-20"
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX
        }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return
          const dx = e.changedTouches[0].clientX - touchX.current
          touchX.current = null
          if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1)
        }}
      >
        <ResponsiveImage
          key={images[index]}
          sizes="100vw"
          src={images[index]}
          alt={`${name} — photo ${index + 1}`}
          decoding="async"
          className="max-h-full max-w-full rounded-md object-contain"
          onClick={(e) => e.stopPropagation()}
        />

        {count > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={(e) => {
                e.stopPropagation()
                step(-1)
              }}
              className={`${navBtn} left-4 md:left-6`}
            >
              <ChevronLeft aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={(e) => {
                e.stopPropagation()
                step(1)
              }}
              className={`${navBtn} right-4 md:right-6`}
            >
              <ChevronRight aria-hidden />
            </button>
          </>
        ) : null}
      </div>

      {count > 1 ? (
        <div
          className="flex items-center justify-center gap-3 px-4 py-4"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => step(-1)}
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-white sm:hidden"
          >
            <ChevronLeft aria-hidden />
          </button>
          <div className="flex gap-2 overflow-x-auto">
            {images.map((src, i) => (
              <button
                key={src + i}
                type="button"
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index}
                onClick={() => onSelect(i)}
                className={`size-12 shrink-0 overflow-hidden rounded-md border-2 transition-opacity sm:size-16 ${
                  i === index
                    ? 'border-white opacity-100'
                    : 'border-transparent opacity-50 hover:opacity-80'
                }`}
              >
                <ResponsiveImage
                  src={src}
                  alt=""
                  sizes="64px"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => step(1)}
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-white sm:hidden"
          >
            <ChevronRight aria-hidden />
          </button>
        </div>
      ) : null}
    </div>,
    document.body,
  )
}
