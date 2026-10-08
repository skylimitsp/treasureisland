import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Plus, Star, StarOff } from 'lucide-react'

import { seo } from '#/lib/seo'
import { hasRole } from '#/lib/auth'
import { useReviewsQuery } from '#/hooks/queries/reviews.query'
import { AdminPageHeader } from '#/components/admin/admin-page-header'
import { DataTable } from '#/components/admin/data-table'
import { EmptyState } from '#/components/admin/empty-state'
import { ReviewFeatureToggle } from '#/components/admin/review-feature-toggle'
import { ReviewDeleteButton } from '#/components/admin/review-delete-button'
import { ReviewFormDrawer } from '#/components/admin/review-form-drawer'
import { StatusBadge } from '#/components/admin/status-badge'
import type { ColumnDef } from '#/components/admin/data-table'
import type { Review } from '#/types'

export const Route = createFileRoute('/admin/reviews')({
  head: () => seo({ title: 'Reviews', noindex: true }),
  component: ReviewsPage,
})

function ReviewsPage() {
  const reviews = useReviewsQuery()
  const [adding, setAdding] = useState(false)
  // Adding, featuring and deleting are admin-only in the API; concierge sees status.
  const isAdmin = hasRole('admin')

  const columns = useMemo<Array<ColumnDef<Review>>>(
    () => [
      { accessorKey: 'name', header: 'Guest' },
      { accessorKey: 'origin', header: 'From' },
      {
        accessorKey: 'rating',
        header: 'Rating',
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-1 text-gold">
            <Star size={14} fill="currentColor" strokeWidth={0} aria-hidden />
            {row.original.rating?.toFixed(1) ?? '—'}
          </span>
        ),
      },
      {
        accessorKey: 'quote',
        header: 'Review',
        cell: ({ row }) => (
          <span className="line-clamp-2 max-w-md text-sea-ink-soft">
            {row.original.quote}
          </span>
        ),
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) =>
          isAdmin ? (
            <div className="flex items-center justify-end gap-1">
              <ReviewFeatureToggle
                id={row.original.id}
                featured={row.original.featured}
              />
              <ReviewDeleteButton
                id={row.original.id}
                name={row.original.name}
              />
            </div>
          ) : (
            <StatusBadge
              status={row.original.featured ? 'on website' : 'hidden'}
              tone={row.original.featured ? 'positive' : 'neutral'}
            />
          ),
      },
    ],
    [isAdmin],
  )

  return (
    <div>
      <AdminPageHeader
        title="Reviews"
        description="Guest reviews. Featured ones appear in the website's testimonials."
        action={
          isAdmin ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setAdding(true)}
            >
              <Plus size={16} aria-hidden />
              Add review
            </button>
          ) : undefined
        }
      />
      <ReviewFormDrawer open={adding} onClose={() => setAdding(false)} />

      {reviews.isPending ? (
        <p className="text-sm text-sea-ink-soft">Loading reviews…</p>
      ) : reviews.isError ? (
        <div className="island-shell rounded-md p-6 text-center">
          <p className="text-sea-ink-soft">{reviews.error.message}</p>
          <button
            className="btn btn-ghost mt-4"
            onClick={() => reviews.refetch()}
          >
            Retry
          </button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={reviews.data}
          searchPlaceholder="Search reviews…"
          emptyState={
            <EmptyState
              icon={StarOff}
              title="No reviews"
              message="Add a review a guest gave you to start the list."
            />
          }
        />
      )}
    </div>
  )
}
