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
