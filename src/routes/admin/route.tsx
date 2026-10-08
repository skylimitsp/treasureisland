import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

import { seo } from '#/lib/seo'
import { hasRole, loadSession } from '#/lib/auth'
import { AdminShell } from '#/components/admin/admin-shell'

export const Route = createFileRoute('/admin')({
  // Client-side redirect for UX only; the API enforces roles on every request.
  beforeLoad: async ({ location }) => {
    if (typeof window === 'undefined') return
    await loadSession()
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
