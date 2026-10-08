import { useMemo } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { Users } from 'lucide-react'

import { seo } from '#/lib/seo'
import { getSession, hasRole } from '#/lib/auth'
import { useUsersQuery } from '#/hooks/queries/users.query'
import { AdminPageHeader } from '#/components/admin/admin-page-header'
import { DataTable } from '#/components/admin/data-table'
import { StatusBadge } from '#/components/admin/status-badge'
import { EmptyState } from '#/components/admin/empty-state'
import { StaffRoleSelect } from '#/components/admin/staff-role-select'
import { StaffStatusToggle } from '#/components/admin/staff-status-toggle'
import { StaffInviteForm } from '#/components/admin/staff-invite-form'
import { formatStayDate } from '#/lib/format'
import type { ColumnDef } from '#/components/admin/data-table'
import type { StaffMember } from '#/types'

export const Route = createFileRoute('/admin/staff')({
  // Admin-only module; concierge is bounced back to the dashboard.
  beforeLoad: () => {
    if (typeof window === 'undefined') return
    if (!hasRole('admin')) throw redirect({ to: '/admin' })
  },
  head: () => seo({ title: 'Staff', noindex: true }),
  component: StaffPage,
})

function StaffPage() {
  const users = useUsersQuery()

  const selfId = getSession()?.id

  const columns = useMemo<Array<ColumnDef<StaffMember>>>(
    () => [
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'email', header: 'Email' },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) =>
          row.original.id === selfId ? (
            <StatusBadge status={row.original.role} tone="positive" />
          ) : (
            <StaffRoleSelect
              id={row.original.id}
              name={row.original.name}
              role={row.original.role}
            />
          ),
      },
      {
        accessorKey: 'active',
        header: 'Status',
        cell: ({ row }) => (
          <StatusBadge
            status={row.original.active ? 'active' : 'suspended'}
            tone={row.original.active ? 'positive' : 'danger'}
          />
        ),
      },
      {
        accessorKey: 'lastLoginAt',
        header: 'Last sign-in',
        cell: ({ row }) =>
          row.original.lastLoginAt
            ? formatStayDate(row.original.lastLoginAt)
            : 'Never',
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => (
          <StaffStatusToggle
            id={row.original.id}
            name={row.original.name}
            active={row.original.active}
            isSelf={row.original.id === selfId}
          />
        ),
      },
    ],
    [selfId],
  )

  return (
    <div>
      <AdminPageHeader
        title="Staff"
        description="Invite staff, change roles, or suspend access. Changes take effect immediately."
      />
      <StaffInviteForm />

      {users.isPending ? (
        <p className="text-sm text-sea-ink-soft">Loading staff…</p>
      ) : users.isError ? (
        <div className="island-shell rounded-md p-6 text-center">
          <p className="text-sea-ink-soft">{users.error.message}</p>
          <button
            className="btn btn-ghost mt-4"
            onClick={() => users.refetch()}
          >
            Retry
          </button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={users.data}
          searchPlaceholder="Search staff…"
          emptyState={
            <EmptyState
              icon={Users}
              title="No staff"
              message="Staff members will appear here."
            />
          }
        />
      )}
    </div>
  )
}
