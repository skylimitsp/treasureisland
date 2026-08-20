import { queryOptions, useQuery } from '@tanstack/react-query'

import { withErrorHandling } from '#/lib/errors'
import { getReviews } from '#/data/content'
import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from '#/constants'
import type { Review } from '#/types'

export const reviewKeys = {
  all: ['reviews'] as const,
  list: () => ['reviews', 'list'] as const,
}

const fetchReviews = withErrorHandling(async (): Promise<Array<Review>> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return getReviews() // ← swap for httpClient.get('/admin/reviews')
}, 'Failed to load reviews')

export const reviewsQueryOptions = () =>
  queryOptions({
    queryKey: reviewKeys.list(),
    queryFn: fetchReviews,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  })

/**
 * Lists guest reviews for moderation.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useReviewsQuery = () => useQuery(reviewsQueryOptions())
