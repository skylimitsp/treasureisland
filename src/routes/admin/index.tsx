import { createFileRoute } from '@tanstack/react-router'
import {
  CalendarCheck,
  CalendarClock,
  DollarSign,
  Mail,
  MessagesSquare,
  PercentCircle,
} from 'lucide-react'

import { seo } from '#/lib/seo'
import { formatPrice, formatStayDate } from '#/lib/format'
import {
  useDashboardMetricsQuery,
  useRecentActivityQuery,
} from '#/hooks/queries/dashboard.query'
import { AdminPageHeader } from '#/components/admin/admin-page-header'
import { StatCard } from '#/components/admin/stat-card'
import type { ActivityKind } from '#/types'

export const Route = createFileRoute('/admin/')({
  head: () => seo({ title: 'Dashboard', noindex: true }),
  component: DashboardPage,
})

const ACTIVITY_LABEL: Record<ActivityKind, string> = {
  booking: 'Booking',
  enquiry: 'Enquiry',
  subscriber: 'Subscriber',
}

function DashboardPage() {
  const metrics = useDashboardMetricsQuery()
  const activity = useRecentActivityQuery()
  const m = metrics.data

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Operational health at a glance — bookings, revenue, and pipeline."
      />

      {metrics.isError ? (
        <div className="island-shell rounded-md p-6 text-center">
          <p className="text-sea-ink-soft">{metrics.error.message}</p>
          <button
            className="btn btn-ghost mt-4"
            onClick={() => metrics.refetch()}
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Bookings today"
            value={m ? String(m.bookingsToday) : '—'}
            icon={CalendarCheck}
            hint="Arrivals checking in today"
          />
          <StatCard
            label="Upcoming"
            value={m ? String(m.upcomingBookings) : '—'}
            icon={CalendarClock}
            hint="Reservations still ahead"
          />
          <StatCard
            label="Revenue"
            value={m ? formatPrice(m.revenue) : '—'}
            icon={DollarSign}
            hint="Active reservations total"
          />
          <StatCard
            label="Occupancy"
            value={m ? `${m.occupancy}%` : '—'}
            icon={PercentCircle}
            hint="Rooms in-house right now"
          />
          <StatCard
            label="Pending enquiries"
            value={m ? String(m.pendingEnquiries) : '—'}
            icon={MessagesSquare}
            hint="New event leads to action"
          />
          <StatCard
            label="Subscribers"
            value={m ? String(m.subscribers) : '—'}
            icon={Mail}
            hint="Newsletter list size"
          />
        </div>
      )}

      <section className="mt-8">
        <h2 className="display-title text-xl text-sea-ink">Recent activity</h2>
        <div className="island-shell mt-3 rounded-md">
          {activity.isPending ? (
            <p className="p-6 text-sm text-sea-ink-soft">Loading activity…</p>
          ) : activity.isError ? (
            <p className="p-6 text-sm text-red-600">{activity.error.message}</p>
          ) : activity.data.length === 0 ? (
            <p className="p-6 text-sm text-sea-ink-soft">No activity yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {activity.data.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-4 px-5 py-3.5"
                >
                  <div>
                    <p className="text-sm font-semibold text-sea-ink">
                      {item.title}
                    </p>
                    <p className="text-xs text-sea-ink-soft">{item.detail}</p>
                  </div>
                  <div className="text-right">
                    <span className="island-kicker">
                      {ACTIVITY_LABEL[item.kind]}
                    </span>
                    <p className="text-xs text-sea-ink-soft">
                      {formatStayDate(item.createdAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}
