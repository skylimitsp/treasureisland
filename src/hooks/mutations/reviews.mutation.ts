import { useMutation, useQueryClient } from '@tanstack/react-query'

import { withErrorHandling } from '#/lib/errors'
import { toggleReviewFeatured } from '#/data/content'
import { reviewKeys } from '#/hooks/queries/reviews.query'
import type { Review } from '#/types'

const doToggleFeatured = withErrorHandling(
  async (id: string): Promise<Review> => {
    await new Promise((resolve) => setTimeout(resolve, 250))
    return toggleReviewFeatured(id) // ← swap for httpClient.patch(...)
  },
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
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: reviewKeys.all }),
  })
}
