import { queryOptions, useQuery } from '@tanstack/react-query'

import { withErrorHandling } from '#/lib/errors'
import { api } from '#/lib/api-client'
import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from '#/constants'
import type { Review } from '#/types'

export const reviewKeys = {
  all: ['reviews'] as const,
  list: () => ['reviews', 'list'] as const,
}

const fetchReviews = withErrorHandling(async (): Promise<Array<Review>> => {
  return api.get<Array<Review>>('/admin/reviews')
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
