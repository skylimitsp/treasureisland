import { useMemo } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { MessageSquareOff } from 'lucide-react'

import { seo } from '#/lib/seo'
import { isEnabled } from '#/constants/features'
import { formatStayDate } from '#/lib/format'
import { useEnquiriesQuery } from '#/hooks/queries/enquiries.query'
import { AdminPageHeader } from '#/components/admin/admin-page-header'
import { DataTable } from '#/components/admin/data-table'
import { StatusBadge } from '#/components/admin/status-badge'
import { EmptyState } from '#/components/admin/empty-state'
import { EnquiryStatusSelect } from '#/components/admin/enquiry-status-select'
import type { ColumnDef } from '#/components/admin/data-table'
import type { EventEnquiry } from '#/types'

export const Route = createFileRoute('/admin/enquiries')({
  // Hidden until the `adminEnquiries` feature flag is switched on.
  beforeLoad: () => {
    if (!isEnabled('adminEnquiries')) throw redirect({ to: '/admin' })
  },
  head: () => seo({ title: 'Enquiries', noindex: true }),
  component: EnquiriesPage,
})

function EnquiriesPage() {
  const enquiries = useEnquiriesQuery()

  const columns = useMemo<Array<ColumnDef<EventEnquiry>>>(
    () => [
      { accessorKey: 'id', header: 'Reference' },
      { accessorKey: 'name', header: 'Contact' },
      {
        accessorKey: 'eventType',
        header: 'Event',
        cell: ({ row }) => (
          <span className="capitalize">{row.original.eventType}</span>
        ),
      },
      {
        accessorKey: 'date',
        header: 'Preferred date',
        cell: ({ row }) => formatStayDate(row.original.date),
      },
      { accessorKey: 'guests', header: 'Guests' },
      {
        accessorKey: 'budget',
        header: 'Budget',
        cell: ({ row }) => row.original.budget ?? '—',
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
          <EnquiryStatusSelect
            id={row.original.id}
            status={row.original.status}
          />
        ),
      },
    ],
    [],
  )

  return (
    <div>
      <AdminPageHeader
        title="Enquiries"
        description="Celebration and event leads — move each from new to contacted to closed."
      />

      {enquiries.isPending ? (
        <p className="text-sm text-sea-ink-soft">Loading enquiries…</p>
      ) : enquiries.isError ? (
        <div className="island-shell rounded-md p-6 text-center">
          <p className="text-sea-ink-soft">{enquiries.error.message}</p>
          <button
            className="btn btn-ghost mt-4"
            onClick={() => enquiries.refetch()}
          >
            Retry
          </button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={enquiries.data}
          searchPlaceholder="Search name or reference…"
          emptyState={
            <EmptyState
              icon={MessageSquareOff}
              title="No enquiries"
              message="New event enquiries will appear here."
            />
          }
        />
      )}
    </div>
  )
}
