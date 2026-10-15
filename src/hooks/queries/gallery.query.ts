/**
 * Gallery reads: the curated photo + video list for the /gallery page.
 * @author Joseph Nartey
 * @github devjoemedia
 */
import { queryOptions, useQuery } from '@tanstack/react-query'

import { withErrorHandling } from '#/lib/errors'
import { getGalleryItems } from '#/data/gallery'
import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from '#/constants'
import type { GalleryItem } from '#/types'

export const galleryKeys = {
  all: ['gallery'] as const,
  items: () => ['gallery', 'items'] as const,
}

const fetchGallery = withErrorHandling(
  async (): Promise<Array<GalleryItem>> => {
    await new Promise((resolve) => setTimeout(resolve, 150))
    return getGalleryItems() // ← swap for httpClient.get('/gallery')
  },
  'Failed to load the gallery',
)

// Shared options so the route loader can prefetch (SSR/crawlable).
export const galleryQueryOptions = () =>
  queryOptions({
    queryKey: galleryKeys.items(),
    queryFn: fetchGallery,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  })

export function useGalleryQuery() {
  return useQuery(galleryQueryOptions())
}
