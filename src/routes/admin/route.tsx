import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

import { seo } from '#/lib/seo'
import { hasRole, hydrateSession } from '#/lib/auth'
import { AdminShell } from '#/components/admin/admin-shell'

export const Route = createFileRoute('/admin')({
  // Client-only mock guard; a real backend must re-check every request.
  beforeLoad: ({ location }) => {
    if (typeof window === 'undefined') return
    hydrateSession()
    if (!hasRole('admin', 'concierge')) {
      throw redirect({
        to: '/auth/login',
        search: { redirect: location.href },
      })
    }
  },
  head: () => seo({ title: 'Admin', noindex: true }),
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  )
}
