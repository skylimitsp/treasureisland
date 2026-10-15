import { useCallback, useMemo, useState } from 'react'

import { GalleryTabs } from '#/components/gallery/gallery-tabs'
import { MediaLightbox } from '#/components/gallery/media-lightbox'
import { MediaTile } from '#/components/gallery/media-tile'
import { useGalleryQuery } from '#/hooks/queries/gallery.query'
import type { GalleryTab } from '#/components/gallery/gallery-tabs'

// Tabs + CSS-columns masonry + viewer. The viewer steps through the active
// tab's items only, wrapping at either end.
export function GalleryBrowser({
  tab,
  onTabChange,
}: {
  tab: GalleryTab
  onTabChange: (tab: GalleryTab) => void
}) {
  const gallery = useGalleryQuery()
  const [open, setOpen] = useState<number | null>(null)

  const all = useMemo(() => gallery.data ?? [], [gallery.data])
  const items = useMemo(() => {
    if (tab === 'photos') return all.filter((i) => i.kind === 'photo')
    if (tab === 'videos') return all.filter((i) => i.kind === 'video')
    return all
  }, [all, tab])

  const counts = useMemo(
    () => ({
      all: all.length,
      photos: all.filter((i) => i.kind === 'photo').length,
      videos: all.filter((i) => i.kind === 'video').length,
    }),
    [all],
  )

  const close = useCallback(() => setOpen(null), [])
  const step = useCallback(
    (delta: number) =>
      setOpen((i) =>
        i === null ? i : (i + delta + items.length) % items.length,
      ),
    [items.length],
  )

  return (
    <section className="page-wrap--wide mt-12 mb-24">
      <div className="flex justify-center">
        <GalleryTabs
          value={tab}
          counts={counts}
          onChange={(next) => {
            setOpen(null)
            onTabChange(next)
          }}
        />
      </div>

      <div
        id="gallery-panel"
        role="tabpanel"
        aria-labelledby={`gallery-tab-${tab}`}
        className="mt-10"
      >
        {gallery.isPending ? (
          <div className="columns-2 gap-3 sm:gap-4 md:columns-3 xl:columns-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="mb-3 animate-pulse break-inside-avoid rounded-md bg-black/5 sm:mb-4"
                style={{ aspectRatio: i % 3 === 0 ? '4 / 3' : '3 / 4' }}
              />
            ))}
          </div>
        ) : gallery.isError ? (
          <div className="island-shell mx-auto max-w-md rounded-md p-6 text-center">
            <p className="text-sea-ink-soft">{gallery.error.message}</p>
            <button
              type="button"
              className="btn btn-ghost mt-4"
              onClick={() => gallery.refetch()}
            >
              Try again
            </button>
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-sea-ink-soft">
            Nothing here yet — check back soon.
          </p>
        ) : (
          // Keyed by tab so the tiles re-run their entrance on every switch.
          <div
            key={tab}
            className="columns-2 gap-3 sm:gap-4 md:columns-3 xl:columns-4"
          >
            {items.map((item, i) => (
              <MediaTile
                key={item.id}
                item={item}
                index={i}
                onOpen={() => setOpen(i)}
              />
            ))}
          </div>
        )}
      </div>

      {open !== null && items[open] ? (
        <MediaLightbox
          items={items}
          index={open}
          onClose={close}
          onStep={step}
        />
      ) : null}
    </section>
  )
}
