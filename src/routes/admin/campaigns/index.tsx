import { useMemo } from 'react'
import {
  Link,
  createFileRoute,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { Mail, Plus } from 'lucide-react'

import { seo } from '#/lib/seo'
import { hasRole } from '#/lib/auth'
import { formatStayDate } from '#/lib/format'
import { useCampaignsQuery } from '#/hooks/queries/campaigns.query'
import { useCreateCampaignMutation } from '#/hooks/mutations/campaigns.mutation'
import { AdminPageHeader } from '#/components/admin/admin-page-header'
import { DataTable } from '#/components/admin/data-table'
import { EmptyState } from '#/components/admin/empty-state'
import { EmailStatusBanner } from '#/components/admin/email-status-banner'
import { StatusBadge } from '#/components/admin/status-badge'
import type { ColumnDef } from '#/components/admin/data-table'
import type { Campaign } from '#/types'

export const Route = createFileRoute('/admin/campaigns/')({
  beforeLoad: () => {
    if (typeof window === 'undefined') return
    if (!hasRole('admin')) throw redirect({ to: '/admin' })
  },
  head: () => seo({ title: 'Campaigns', noindex: true }),
  component: CampaignsPage,
})

function CampaignsPage() {
  const campaigns = useCampaignsQuery()
  const create = useCreateCampaignMutation()
  const navigate = useNavigate()

  function newCampaign() {
    create.mutate(
      {},
      {
        onSuccess: (c) =>
          void navigate({
            to: '/admin/campaigns/$campaignId',
            params: { campaignId: c.id },
          }),
      },
    )
  }

  const columns = useMemo<Array<ColumnDef<Campaign>>>(
    () => [
      {
        accessorKey: 'subject',
        header: 'Subject',
        cell: ({ row }) => (
          <Link
            to="/admin/campaigns/$campaignId"
            params={{ campaignId: row.original.id }}
            className="font-semibold text-sea-ink hover:text-lagoon-deep"
          >
            {row.original.subject || 'Untitled draft'}
          </Link>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: 'audience',
        header: 'Audience',
        cell: ({ row }) =>
          row.original.status === 'draft'
            ? row.original.audience === 'all'
              ? 'All subscribers'
              : `${row.original.selectedIds.length} chosen`
            : `${row.original.sentCount} of ${row.original.recipientCount} delivered`,
      },
      {
        id: 'date',
        header: 'Date',
        cell: ({ row }) =>
          row.original.sentAt
            ? `Sent ${formatStayDate(row.original.sentAt)}`
            : `Edited ${formatStayDate(row.original.updatedAt)}`,
      },
      {
        id: 'open',
        header: '',
        enableSorting: false,
        cell: ({ row }) => (
          <Link
            to="/admin/campaigns/$campaignId"
            params={{ campaignId: row.original.id }}
            className="btn btn-ghost px-3 py-1.5"
          >
            {row.original.status === 'draft' ? 'Edit' : 'View'}
          </Link>
        ),
      },
    ],
    [],
  )

  return (
    <div>
      <AdminPageHeader
        title="Campaigns"
        description="Promotional emails to your newsletter subscribers. Send to everyone or a chosen few."
        action={
          <button
            type="button"
            className="btn btn-primary"
            disabled={create.isPending}
            onClick={newCampaign}
          >
            <Plus size={16} aria-hidden />
            {create.isPending ? 'Creating…' : 'New campaign'}
          </button>
        }
      />
      <EmailStatusBanner />
      {create.isError ? (
        <p className="mb-4 text-sm text-destructive">{create.error.message}</p>
      ) : null}

      {campaigns.isPending ? (
        <p className="text-sm text-sea-ink-soft">Loading campaigns…</p>
      ) : campaigns.isError ? (
        <div className="island-shell rounded-md p-6 text-center">
          <p className="text-sea-ink-soft">{campaigns.error.message}</p>
          <button
            className="btn btn-ghost mt-4"
            onClick={() => campaigns.refetch()}
          >
            Retry
          </button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={campaigns.data}
          searchPlaceholder="Search campaigns…"
          emptyState={
            <EmptyState
              icon={Mail}
              title="No campaigns yet"
              message="Create your first campaign to email your subscribers."
            />
          }
        />
      )}
    </div>
  )
}
