import { useMemo } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { Users } from 'lucide-react'

import { seo } from '#/lib/seo'
import { hasRole, hydrateSession } from '#/lib/auth'
import { useUsersQuery } from '#/hooks/queries/users.query'
import { AdminPageHeader } from '#/components/admin/admin-page-header'
import { DataTable } from '#/components/admin/data-table'
import { StatusBadge } from '#/components/admin/status-badge'
import { EmptyState } from '#/components/admin/empty-state'
import { StaffRoleSelect } from '#/components/admin/staff-role-select'
import type { ColumnDef } from '#/components/admin/data-table'
import type { User } from '#/types'

export const Route = createFileRoute('/admin/staff')({
  // Admin-only module; concierge is bounced back to the dashboard.
  beforeLoad: () => {
    if (typeof window === 'undefined') return
    hydrateSession()
    if (!hasRole('admin')) throw redirect({ to: '/admin' })
  },
  head: () => seo({ title: 'Staff', noindex: true }),
  component: StaffPage,
})

function StaffPage() {
  const users = useUsersQuery()

  const columns = useMemo<Array<ColumnDef<User>>>(
    () => [
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'email', header: 'Email' },
      {
        accessorKey: 'role',
        header: 'Current role',
        cell: ({ row }) => (
          <StatusBadge
            status={row.original.role}
            tone={row.original.role === 'admin' ? 'positive' : 'info'}
          />
        ),
      },
      {
        id: 'actions',
        header: 'Change role',
        enableSorting: false,
        cell: ({ row }) => (
          <StaffRoleSelect
            id={row.original.id}
            name={row.original.name}
            role={row.original.role}
          />
        ),
      },
    ],
    [],
  )

  return (
    <div>
      <AdminPageHeader
        title="Staff"
        description="Manage staff roles. Role changes take effect immediately."
      />

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
