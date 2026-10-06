import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Star, StarOff } from 'lucide-react'

import { seo } from '#/lib/seo'
import { useReviewsQuery } from '#/hooks/queries/reviews.query'
import { AdminPageHeader } from '#/components/admin/admin-page-header'
import { DataTable } from '#/components/admin/data-table'
import { EmptyState } from '#/components/admin/empty-state'
import { ReviewFeatureToggle } from '#/components/admin/review-feature-toggle'
import type { ColumnDef } from '#/components/admin/data-table'
import type { Review } from '#/types'

export const Route = createFileRoute('/admin/reviews')({
  head: () => seo({ title: 'Reviews', noindex: true }),
  component: ReviewsPage,
})

function ReviewsPage() {
  const reviews = useReviewsQuery()

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
        cell: ({ row }) => (
          <ReviewFeatureToggle
            id={row.original.id}
            featured={row.original.featured}
          />
        ),
      },
    ],
    [],
  )

  return (
    <div>
      <AdminPageHeader
        title="Reviews"
        description="Moderate guest reviews — featured ones surface on the public site."
      />

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
              message="Guest reviews will appear here."
            />
          }
        />
      )}
    </div>
  )
}
