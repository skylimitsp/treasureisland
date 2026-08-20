import { Link } from '@tanstack/react-router'
import {
  BedDouble,
  CalendarCheck,
  CalendarRange,
  FileText,
  LayoutDashboard,
  Mail,
  MessagesSquare,
  Settings,
  Sparkles,
  Star,
  Users,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Role } from '#/types'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  adminOnly?: boolean
}

const NAV: Array<NavItem> = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
  { to: '/admin/availability', label: 'Availability', icon: CalendarRange },
  { to: '/admin/rooms', label: 'Rooms', icon: BedDouble },
  { to: '/admin/enquiries', label: 'Enquiries', icon: MessagesSquare },
  { to: '/admin/amenities', label: 'Amenities', icon: Sparkles },
  { to: '/admin/content', label: 'Content', icon: FileText },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/subscribers', label: 'Subscribers', icon: Mail },
  { to: '/admin/staff', label: 'Staff', icon: Users, adminOnly: true },
  { to: '/admin/settings', label: 'Settings', icon: Settings, adminOnly: true },
]

interface AdminSidebarProps {
  role: Role
  open: boolean
  onClose: () => void
}

// Left navigation for the admin console; role-filters admin-only items.
export function AdminSidebar({ role, open, onClose }: AdminSidebarProps) {
  const items = NAV.filter((item) => !item.adminOnly || role === 'admin')

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <aside
        aria-label="Admin navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-[color:var(--foam)] transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <Link to="/admin" className="no-underline" onClick={onClose}>
            <span className="display-title text-lg text-sea-ink">
              Treasure Island
            </span>
            <span className="block text-xs text-sea-ink-soft">
              Admin Console
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="flex size-9 items-center justify-center rounded-full border border-line text-sea-ink lg:hidden"
          >
            <X size={18} aria-hidden />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              activeOptions={{ exact: item.to === '/admin' }}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-sea-ink-soft no-underline hover:bg-black/5"
              activeProps={{
                className:
                  'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-lagoon-deep no-underline bg-lagoon/10',
              }}
            >
              <item.icon size={18} aria-hidden />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-line px-5 py-4 text-xs text-sea-ink-soft">
          <span className="island-kicker">Role</span>
          <span className="mt-1 block capitalize text-sea-ink">{role}</span>
        </div>
      </aside>
    </>
  )
}
