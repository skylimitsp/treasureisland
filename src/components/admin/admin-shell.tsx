import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import type { ReactNode } from 'react'

import { authStore } from '#/stores/auth.store'
import { hydrateSession } from '#/lib/auth'
import { AdminSidebar } from '#/components/admin/admin-sidebar'
import { AdminTopbar } from '#/components/admin/admin-topbar'
import type { Role } from '#/types'

const ALLOWED: Array<Role> = ['admin', 'concierge']

// Admin console frame: rehydrates the mock session, guards on the client, and
// wraps every module in the sidebar + topbar chrome.
export function AdminShell({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const navigate = useNavigate()
  const user = useStore(authStore, (s) => s.user)
  const allowed = user ? ALLOWED.includes(user.role) : false

  useEffect(() => {
    hydrateSession()
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !allowed) navigate({ to: '/auth/login' })
  }, [mounted, allowed, navigate])

  if (!mounted || !allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[color:var(--bg-base)] text-sea-ink-soft">
        Loading console…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[color:var(--bg-base)]">
      <AdminSidebar
        role={user!.role}
        open={navOpen}
        onClose={() => setNavOpen(false)}
      />
      <div className="lg:pl-64">
        <AdminTopbar user={user} onMenu={() => setNavOpen(true)} />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </div>
    </div>
  )
}
