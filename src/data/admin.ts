import { getBookings, getRooms } from '#/data/rooms'
import { getEventEnquiries } from '#/data/events'
import { getSubscribers } from '#/data/newsletter'
import type { ActivityItem, DashboardMetrics } from '#/types'

// Aggregates cross-domain mock accessors into console KPIs — the API swap seam.
function isSameDay(iso: string, ref: Date): boolean {
  const d = new Date(iso)
  return (
    d.getFullYear() === ref.getFullYear() &&
    d.getMonth() === ref.getMonth() &&
    d.getDate() === ref.getDate()
  )
}

export function getDashboardMetrics(): DashboardMetrics {
  const now = new Date()
  const bookings = getBookings()
  const active = bookings.filter((b) => b.status !== 'cancelled')

  const bookingsToday = bookings.filter((b) => isSameDay(b.checkIn, now)).length
  const upcomingBookings = active.filter(
    (b) => new Date(b.checkIn).getTime() >= now.getTime(),
  ).length
  const revenue = active.reduce((sum, b) => sum + b.total, 0)

  // Occupancy estimate: rooms with a current in-house stay vs total inventory.
  const occupied = active.filter(
    (b) =>
      new Date(b.checkIn).getTime() <= now.getTime() &&
      new Date(b.checkOut).getTime() > now.getTime(),
  ).length
  const roomCount = getRooms().length
  const occupancy = roomCount ? Math.round((occupied / roomCount) * 100) : 0

  const pendingEnquiries = getEventEnquiries().filter(
    (e) => e.status === 'new',
  ).length

  return {
    bookingsToday,
    upcomingBookings,
    revenue,
    occupancy,
    pendingEnquiries,
    subscribers: getSubscribers().length,
  }
}

export function getRecentActivity(): Array<ActivityItem> {
  const bookings: Array<ActivityItem> = getBookings().map((b) => ({
    id: `act-bk-${b.id}`,
    kind: 'booking',
    title: `Booking ${b.id}`,
    detail: `${b.guestName} · ${b.roomName}`,
    createdAt: b.createdAt,
  }))
  const enquiries: Array<ActivityItem> = getEventEnquiries().map((e) => ({
    id: `act-enq-${e.id}`,
    kind: 'enquiry',
    title: `Enquiry ${e.id}`,
    detail: `${e.name} · ${e.eventType}`,
    createdAt: e.createdAt,
  }))
  const subscribers: Array<ActivityItem> = getSubscribers().map((s) => ({
    id: `act-nl-${s.id}`,
    kind: 'subscriber',
    title: 'New subscriber',
    detail: `${s.email} · ${s.source}`,
    createdAt: s.createdAt,
  }))

  return [...bookings, ...enquiries, ...subscribers]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 8)
}
