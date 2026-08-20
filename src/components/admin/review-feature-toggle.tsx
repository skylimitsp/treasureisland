import { Star } from 'lucide-react'

import { useToggleReviewFeaturedMutation } from '#/hooks/mutations/reviews.mutation'

interface ReviewFeatureToggleProps {
  id: string
  featured: boolean
}

// Row action: features or un-features a guest review.
export function ReviewFeatureToggle({
  id,
  featured,
}: ReviewFeatureToggleProps) {
  const mutation = useToggleReviewFeaturedMutation()
  return (
    <button
      type="button"
      className="btn btn-ghost px-3 py-1.5"
      disabled={mutation.isPending}
      onClick={() => mutation.mutate(id)}
    >
      <Star
        size={15}
        aria-hidden
        className={featured ? 'text-gold' : 'text-sea-ink-soft'}
        fill={featured ? 'currentColor' : 'none'}
      />
      {featured ? 'Featured' : 'Feature'}
    </button>
  )
}
