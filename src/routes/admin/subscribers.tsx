import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Download, MailX } from 'lucide-react'

import { seo } from '#/lib/seo'
import { formatStayDate } from '#/lib/format'
import { useSubscribersQuery } from '#/hooks/queries/subscribers.query'
import { AdminPageHeader } from '#/components/admin/admin-page-header'
import { DataTable } from '#/components/admin/data-table'
import { EmptyState } from '#/components/admin/empty-state'
import { SubscriberUnsubscribeButton } from '#/components/admin/subscriber-unsubscribe-button'
import type { ColumnDef } from '#/components/admin/data-table'
import type { NewsletterSignup } from '#/types'

export const Route = createFileRoute('/admin/subscribers')({
  head: () => seo({ title: 'Subscribers', noindex: true }),
  component: SubscribersPage,
})

// Builds and downloads a CSV of the current subscriber list (client-side blob).
function exportCsv(rows: Array<NewsletterSignup>) {
  const header = 'email,source,status,createdAt'
  const body = rows
    .map((r) => `${r.email},${r.source},${r.status},${r.createdAt}`)
    .join('\n')
  const blob = new Blob([`${header}\n${body}`], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'subscribers.csv'
  link.click()
  URL.revokeObjectURL(url)
}

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
        accessorKey: 'createdAt',
        header: 'Joined',
        cell: ({ row }) => formatStayDate(row.original.createdAt),
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => (
          <SubscriberUnsubscribeButton email={row.original.email} />
        ),
      },
    ],
    [],
  )

  return (
    <div>
      <AdminPageHeader
        title="Subscribers"
        description="Newsletter list — export to CSV or remove an address."
        action={
          <button
            type="button"
            className="btn btn-primary"
            disabled={!subscribers.data?.length}
            onClick={() => subscribers.data && exportCsv(subscribers.data)}
          >
            <Download size={16} aria-hidden />
            Export CSV
          </button>
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
