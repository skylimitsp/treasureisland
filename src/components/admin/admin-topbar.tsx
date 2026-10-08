import { useState } from 'react'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { ChevronRight, LogOut, Menu, UserRound } from 'lucide-react'

import { signOut } from '#/lib/auth'
import type { User } from '#/types'

interface AdminTopbarProps {
  user: User | null
  onMenu: () => void
}

const SEGMENT_LABELS: Record<string, string> = {
  admin: 'Dashboard',
}

// Turns the pathname into a readable breadcrumb trail.
function crumbsFrom(pathname: string): Array<string> {
  const parts = pathname.replace(/^\/+|\/+$/g, '').split('/')
  // IDs (UUIDs, references like TI-2026-0001) read as "Details" rather than raw codes.
  const isId = (p: string) =>
    /^[0-9a-f-]{20,}$/i.test(p) || /\d{4}-\d{4}$/.test(p)
  return parts.map((part) =>
    SEGMENT_LABELS[part]
      ? SEGMENT_LABELS[part]
      : isId(part)
        ? 'Details'
        : part.charAt(0).toUpperCase() + part.slice(1),
  )
}

// Top bar: breadcrumb + user menu with sign out.
export function AdminTopbar({ user, onMenu }: AdminTopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = useLocation({ select: (l) => l.pathname })
  const navigate = useNavigate()
  const crumbs = crumbsFrom(pathname)

  const queryClient = useQueryClient()
  const handleSignOut = async () => {
    await signOut().catch(() => null)
    queryClient.clear()
    navigate({ to: '/auth/login' })
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-line bg-[color:var(--surface-strong)] px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open navigation"
          className="flex size-9 items-center justify-center rounded-full border border-line text-sea-ink lg:hidden"
        >
          <Menu size={18} aria-hidden />
        </button>
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-sm"
        >
          {crumbs.map((crumb, i) => (
            <span key={crumb + i} className="flex items-center gap-1.5">
              {i > 0 ? (
                <ChevronRight
                  size={14}
                  aria-hidden
                  className="text-sea-ink-soft"
                />
              ) : null}
              <span
                className={
                  i === crumbs.length - 1
                    ? 'font-semibold text-sea-ink'
                    : 'text-sea-ink-soft'
                }
              >
                {crumb}
              </span>
            </span>
          ))}
        </nav>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          className="flex items-center gap-2 rounded-full border border-line py-1 pl-1 pr-3 text-sm text-sea-ink"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-lagoon/15 text-lagoon-deep">
            <UserRound size={16} aria-hidden />
          </span>
          <span className="hidden sm:inline">{user?.name ?? 'Account'}</span>
        </button>
        {menuOpen ? (
          <div className="absolute right-0 mt-2 w-52 rounded-md border border-line bg-[color:var(--foam)] p-2 shadow-xl">
            <div className="px-3 py-2">
              <p className="text-sm font-semibold text-sea-ink">{user?.name}</p>
              <p className="text-xs capitalize text-sea-ink-soft">
                {user?.role}
              </p>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-sea-ink hover:bg-black/5"
            >
              <LogOut size={16} aria-hidden />
              Sign out
            </button>
          </div>
        ) : null}
      </div>
    </header>
  )
}
