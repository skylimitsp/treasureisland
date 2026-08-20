import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { CalendarX } from 'lucide-react'

import { seo } from '#/lib/seo'
import { formatPrice, formatStayRange } from '#/lib/format'
import { useBookingsQuery } from '#/hooks/queries/bookings.query'
import { AdminPageHeader } from '#/components/admin/admin-page-header'
import { DataTable } from '#/components/admin/data-table'
import { StatusBadge } from '#/components/admin/status-badge'
import { EmptyState } from '#/components/admin/empty-state'
import { BookingDetailDrawer } from '#/components/admin/booking-detail-drawer'
import type { ColumnDef } from '#/components/admin/data-table'
import type { Booking, BookingStatus } from '#/types'

export const Route = createFileRoute('/admin/bookings/')({
  head: () => seo({ title: 'Bookings', noindex: true }),
  component: BookingsPage,
})

const STATUS_OPTIONS: Array<BookingStatus | 'all'> = [
  'all',
  'pending',
  'confirmed',
  'checked_in',
  'cancelled',
]

function BookingsPage() {
  const bookings = useBookingsQuery()
  const [status, setStatus] = useState<BookingStatus | 'all'>('all')
  const [selected, setSelected] = useState<Booking | null>(null)

  const rows = useMemo(() => {
    const data = bookings.data ?? []
    return status === 'all' ? data : data.filter((b) => b.status === status)
  }, [bookings.data, status])

  const columns = useMemo<Array<ColumnDef<Booking>>>(
    () => [
      { accessorKey: 'id', header: 'Reference' },
      { accessorKey: 'guestName', header: 'Guest' },
      { accessorKey: 'roomName', header: 'Room' },
      {
        id: 'stay',
        header: 'Dates',
        accessorFn: (b) => `${b.checkIn} ${b.checkOut}`,
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-sea-ink-soft">
            {formatStayRange(row.original.checkIn, row.original.checkOut)}
          </span>
        ),
      },
      { accessorKey: 'nights', header: 'Nights' },
      {
        accessorKey: 'total',
        header: 'Total',
        cell: ({ row }) => formatPrice(row.original.total),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => (
          <button
            type="button"
            className="btn btn-ghost px-3 py-1.5"
            onClick={() => setSelected(row.original)}
          >
            Manage
          </button>
        ),
      },
    ],
    [],
  )

  return (
    <div>
      <AdminPageHeader
        title="Bookings"
        description="The full reservation lifecycle — confirm, check in, or cancel."
      />

      {bookings.isPending ? (
        <p className="text-sm text-sea-ink-soft">Loading bookings…</p>
      ) : bookings.isError ? (
        <div className="island-shell rounded-md p-6 text-center">
          <p className="text-sea-ink-soft">{bookings.error.message}</p>
          <button
            className="btn btn-ghost mt-4"
            onClick={() => bookings.refetch()}
          >
            Retry
          </button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          searchPlaceholder="Search guest or reference…"
          emptyState={
            <EmptyState
              icon={CalendarX}
              title="No bookings"
              message="No reservations match this filter."
            />
          }
          toolbar={() => (
            <label className="flex items-center gap-2 text-sm text-sea-ink-soft">
              Status
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as BookingStatus | 'all')
                }
                className="rounded-md border border-line bg-[color:var(--surface)] px-3 py-2 text-sm text-sea-ink capitalize outline-none focus:border-lagoon"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option === 'checked_in' ? 'checked in' : option}
                  </option>
                ))}
              </select>
            </label>
          )}
        />
      )}

      <BookingDetailDrawer
        booking={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  )
}
