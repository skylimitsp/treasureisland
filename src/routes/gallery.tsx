import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { seo } from '#/lib/seo'
import { galleryQueryOptions } from '#/hooks/queries/gallery.query'
import { GalleryHero } from '#/components/gallery/gallery-hero'
import { GalleryBrowser } from '#/components/gallery/gallery-browser'
import type { GalleryTab } from '#/components/gallery/gallery-tabs'

const TABS: Array<GalleryTab> = ['all', 'photos', 'videos']

export const Route = createFileRoute('/gallery')({
  // The active tab lives in the URL so a filtered view can be shared.
  validateSearch: (search: Record<string, unknown>): { tab?: GalleryTab } => ({
    tab: TABS.includes(search.tab as GalleryTab)
      ? (search.tab as GalleryTab)
      : undefined,
  }),
  // Server-render the gallery list so the photos are crawlable.
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(galleryQueryOptions()),
  head: () =>
    seo({
      title: 'Gallery',
      description:
        'Photos and videos from Treasure Island Ada — weddings, parties, ' +
        'sunsets, water sports and slow days by the Volta estuary in Ada Foah.',
      path: '/gallery',
    }),
  component: GalleryPage,
})

function GalleryPage() {
  const { tab = 'all' } = Route.useSearch()
  const navigate = useNavigate({ from: '/gallery' })

  return (
    <main>
      <GalleryHero />
      <GalleryBrowser
        tab={tab}
        onTabChange={(next) =>
          navigate({
            search: { tab: next === 'all' ? undefined : next },
            replace: true,
            resetScroll: false,
          })
        }
      />
    </main>
  )
}
