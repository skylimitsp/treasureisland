import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { CalendarClock } from 'lucide-react'

import { seo } from '#/lib/seo'
import { formatStayDate } from '#/lib/format'
import { useAmenitiesQuery } from '#/hooks/queries/amenities.query'
import { useSlotRequestsQuery } from '#/hooks/queries/slot-requests.query'
import { AdminPageHeader } from '#/components/admin/admin-page-header'
import { DataTable } from '#/components/admin/data-table'
import { StatusBadge } from '#/components/admin/status-badge'
import { EmptyState } from '#/components/admin/empty-state'
import type { ColumnDef } from '#/components/admin/data-table'
import type { Amenity, SlotRequest } from '#/types'

export const Route = createFileRoute('/admin/amenities')({
  head: () => seo({ title: 'Amenities', noindex: true }),
  component: AmenitiesAdminPage,
})

function AmenitiesAdminPage() {
  const amenities = useAmenitiesQuery()
  const slots = useSlotRequestsQuery()

  const amenityColumns = useMemo<Array<ColumnDef<Amenity>>>(
    () => [
      { accessorKey: 'name', header: 'Amenity' },
      { accessorKey: 'category', header: 'Category' },
      {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) =>
          row.original.price
            ? [row.original.price, row.original.priceNote]
                .filter(Boolean)
                .join(' · ')
            : 'Not published',
      },
      {
        accessorKey: 'bookable',
        header: 'Bookable',
        cell: ({ row }) => (
          <StatusBadge
            status={row.original.bookable ? 'bookable' : 'view only'}
            tone={row.original.bookable ? 'positive' : 'neutral'}
          />
        ),
      },
    ],
    [],
  )

  const slotColumns = useMemo<Array<ColumnDef<SlotRequest>>>(
    () => [
      { accessorKey: 'id', header: 'Reference' },
      { accessorKey: 'amenityName', header: 'Amenity' },
      { accessorKey: 'name', header: 'Guest' },
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => formatStayDate(row.original.date),
      },
      { accessorKey: 'slot', header: 'Slot' },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
    ],
    [],
  )

  return (
    <div>
      <AdminPageHeader
        title="Amenities"
        description="Resort experiences and their booking requests. Editing amenity content is read-only in v1."
      />

      {amenities.isPending ? (
        <p className="text-sm text-sea-ink-soft">Loading amenities…</p>
      ) : amenities.isError ? (
        <div className="island-shell rounded-md p-6 text-center">
          <p className="text-sea-ink-soft">{amenities.error.message}</p>
          <button
            className="btn btn-ghost mt-4"
            onClick={() => amenities.refetch()}
          >
            Retry
          </button>
        </div>
      ) : (
        <DataTable
          columns={amenityColumns}
          data={amenities.data}
          searchPlaceholder="Search amenities…"
        />
      )}

      <section className="mt-10">
        <h2 className="display-title text-xl text-sea-ink">Slot requests</h2>
        <p className="mb-3 text-sm text-sea-ink-soft">
          Guest requests for bookable amenities.
        </p>
        {slots.isPending ? (
          <p className="text-sm text-sea-ink-soft">Loading requests…</p>
        ) : slots.isError ? (
          <p className="text-sm text-red-600">{slots.error.message}</p>
        ) : (
          <DataTable
            columns={slotColumns}
            data={slots.data}
            searchPlaceholder="Search requests…"
            emptyState={
              <EmptyState
                icon={CalendarClock}
                title="No slot requests"
                message="Amenity booking requests will appear here."
              />
            }
          />
        )}
      </section>
    </div>
  )
}
