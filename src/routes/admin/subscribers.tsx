import { useMemo } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Download, MailX, Megaphone } from 'lucide-react'

import { seo } from '#/lib/seo'
import { formatStayDate } from '#/lib/format'
import { useSubscribersQuery } from '#/hooks/queries/subscribers.query'
import { AdminPageHeader } from '#/components/admin/admin-page-header'
import { DataTable } from '#/components/admin/data-table'
import { EmptyState } from '#/components/admin/empty-state'
import { SubscriberUnsubscribeButton } from '#/components/admin/subscriber-unsubscribe-button'
import { StatusBadge } from '#/components/admin/status-badge'
import type { ColumnDef } from '#/components/admin/data-table'
import type { NewsletterSignup } from '#/types'

export const Route = createFileRoute('/admin/subscribers')({
  head: () => seo({ title: 'Subscribers', noindex: true }),
  component: SubscribersPage,
})

function SubscribersPage() {
  const subscribers = useSubscribersQuery()

  const columns = useMemo<Array<ColumnDef<NewsletterSignup>>>(
    () => [
      { accessorKey: 'email', header: 'Email' },
      {
        accessorKey: 'source',
        header: 'Source',
        cell: ({ row }) => (
          <span className="capitalize">{row.original.source}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        accessorKey: 'createdAt',
        header: 'Joined',
        cell: ({ row }) => formatStayDate(row.original.createdAt),
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) =>
          row.original.status === 'unsubscribed' ? null : (
            <SubscriberUnsubscribeButton
              id={row.original.id}
              email={row.original.email}
            />
          ),
      },
    ],
    [],
  )

  return (
    <div>
      <AdminPageHeader
        title="Subscribers"
        description="Newsletter list. New sign-ups stay pending until they confirm by email; the export includes confirmed subscribers only."
        action={
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/campaigns" className="btn btn-primary">
              <Megaphone size={16} aria-hidden />
              Email subscribers
            </Link>
            <a
              href="/api/v1/admin/subscribers/export.csv"
              download
              className="btn btn-ghost"
            >
              <Download size={16} aria-hidden />
              Export CSV
            </a>
          </div>
        }
      />

      {subscribers.isPending ? (
        <p className="text-sm text-sea-ink-soft">Loading subscribers…</p>
      ) : subscribers.isError ? (
        <div className="island-shell rounded-md p-6 text-center">
          <p className="text-sea-ink-soft">{subscribers.error.message}</p>
          <button
            className="btn btn-ghost mt-4"
            onClick={() => subscribers.refetch()}
          >
            Retry
          </button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={subscribers.data}
          searchPlaceholder="Search email…"
          emptyState={
            <EmptyState
              icon={MailX}
              title="No subscribers"
              message="Newsletter sign-ups will appear here."
            />
          }
        />
      )}
    </div>
  )
}
