import { useMutation, useQueryClient } from '@tanstack/react-query'

import { withErrorHandling } from '#/lib/errors'
import { api } from '#/lib/api-client'
import { reviewKeys } from '#/hooks/queries/reviews.query'
import { contentKeys } from '#/hooks/queries/content.query'
import type { Review } from '#/types'

const doToggleFeatured = withErrorHandling(
  async ({
    id,
    featured,
  }: {
    id: string
    featured: boolean
  }): Promise<Review> =>
    api.patch<Review>(`/admin/reviews/${id}`, { featured }),
  'Unable to update this review',
)

/**
 * Features or un-features a guest review.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useToggleReviewFeaturedMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: doToggleFeatured,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all })
      queryClient.invalidateQueries({ queryKey: contentKeys.testimonials() })
    },
  })
}

export interface ReviewInput {
  name: string
  origin: string
  quote: string
  rating: number | null
  featured: boolean
}

const doCreate = withErrorHandling(
  async (input: ReviewInput): Promise<Review> =>
    api.post<Review>('/admin/reviews', input),
  'Unable to add this review',
)

const doDelete = withErrorHandling(
  async (id: string): Promise<void> => api.delete(`/admin/reviews/${id}`),
  'Unable to delete this review',
)

// Featured reviews feed the public testimonials, so refresh both lists.
function useReviewInvalidation() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: reviewKeys.all })
    queryClient.invalidateQueries({ queryKey: contentKeys.testimonials() })
  }
}

/**
 * Adds a review typed in by an admin (e.g. from Google, TripAdvisor or a guest book).
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useCreateReviewMutation = () => {
  const invalidate = useReviewInvalidation()
  return useMutation({ mutationFn: doCreate, onSuccess: invalidate })
}

/**
 * Permanently removes a review.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useDeleteReviewMutation = () => {
  const invalidate = useReviewInvalidation()
  return useMutation({ mutationFn: doDelete, onSuccess: invalidate })
}
