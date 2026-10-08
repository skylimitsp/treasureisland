import { useMemo, useState } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { BedDouble } from 'lucide-react'

import { seo } from '#/lib/seo'
import { isEnabled } from '#/constants/features'
import { formatPrice } from '#/lib/format'
import { ROOM_CATEGORY_LABELS } from '#/lib/rooms-filter'
import { useRoomsQuery } from '#/hooks/queries/rooms.query'
import { AdminPageHeader } from '#/components/admin/admin-page-header'
import { DataTable } from '#/components/admin/data-table'
import { EmptyState } from '#/components/admin/empty-state'
import { RoomEditDrawer } from '#/components/admin/room-edit-drawer'
import type { ColumnDef } from '#/components/admin/data-table'
import type { Room } from '#/types'

export const Route = createFileRoute('/admin/rooms')({
  // Hidden until the `adminRooms` feature flag is switched on.
  beforeLoad: () => {
    if (!isEnabled('adminRooms')) throw redirect({ to: '/admin' })
  },
  head: () => seo({ title: 'Rooms', noindex: true }),
  component: RoomsAdminPage,
})

function RoomsAdminPage() {
  const rooms = useRoomsQuery()
  const [selected, setSelected] = useState<Room | null>(null)

  const columns = useMemo<Array<ColumnDef<Room>>>(
    () => [
      { accessorKey: 'name', header: 'Room' },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => ROOM_CATEGORY_LABELS[row.original.category],
      },
      {
        accessorKey: 'pricePerNight',
        header: 'Rate',
        cell: ({ row }) => formatPrice(row.original.pricePerNight),
      },
      { accessorKey: 'maxGuests', header: 'Max guests' },
      {
        accessorKey: 'view',
        header: 'View',
        cell: ({ row }) => row.original.view ?? '—',
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
            Edit
          </button>
        ),
      },
    ],
    [],
  )

  return (
    <div>
      <AdminPageHeader
        title="Rooms"
        description="Inventory across the resort — edit nightly rate and capacity."
      />

      {rooms.isPending ? (
        <p className="text-sm text-sea-ink-soft">Loading rooms…</p>
      ) : rooms.isError ? (
        <div className="island-shell rounded-md p-6 text-center">
          <p className="text-sea-ink-soft">{rooms.error.message}</p>
          <button
            className="btn btn-ghost mt-4"
            onClick={() => rooms.refetch()}
          >
            Retry
          </button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={rooms.data}
          searchPlaceholder="Search rooms…"
          emptyState={
            <EmptyState
              icon={BedDouble}
              title="No rooms"
              message="Room inventory will appear here."
            />
          }
        />
      )}

      <RoomEditDrawer room={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
