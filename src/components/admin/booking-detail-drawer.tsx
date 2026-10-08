import { useState } from 'react'

import { formatPrice, formatStayRange } from '#/lib/format'
import { useUpdateBookingStatusMutation } from '#/hooks/mutations/bookings.mutation'
import { EntityDrawer } from '#/components/admin/entity-drawer'
import { StatusBadge } from '#/components/admin/status-badge'
import { ConfirmDialog } from '#/components/admin/confirm-dialog'
import type { Booking } from '#/types'

interface BookingDetailDrawerProps {
  booking: Booking | null
  onClose: () => void
}

// Reservation detail with confirm / check-in / cancel lifecycle actions.
export function BookingDetailDrawer({
  booking,
  onClose,
}: BookingDetailDrawerProps) {
  const mutation = useUpdateBookingStatusMutation()
  const [confirmCancel, setConfirmCancel] = useState(false)

  if (!booking) return null
  const rate = booking.nights ? Math.round(booking.total / booking.nights) : 0

  const setStatus = (status: Booking['status']) =>
    mutation.mutate({ id: booking.id, status }, { onSuccess: onClose })

  const cancel = () =>
    mutation.mutate(
      { id: booking.id, status: 'cancelled' },
      {
        onSuccess: () => {
          setConfirmCancel(false)
          onClose()
        },
      },
    )

  return (
    <EntityDrawer
      open
      title={booking.id}
      description={booking.roomName}
      onClose={onClose}
    >
      <div className="space-y-5 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-sea-ink-soft">Status</span>
          <StatusBadge status={booking.status} />
        </div>

        <dl className="space-y-3">
          {[
            ['Guest', booking.guestName],
            ['Email', booking.email],
            ['Stay', formatStayRange(booking.checkIn, booking.checkOut)],
            ['Nights', String(booking.nights)],
            ['Guests', String(booking.guests)],
          ].map(([label, value]) => (
            <div key={label} className="flex items-start justify-between gap-4">
              <dt className="text-sea-ink-soft">{label}</dt>
              <dd className="text-right font-medium text-sea-ink">{value}</dd>
            </div>
          ))}
          <div className="flex items-start justify-between gap-4">
            <dt className="text-sea-ink-soft">Phone</dt>
            <dd className="text-right font-medium text-sea-ink">
              {booking.phone ? (
                <a
                  href={`tel:${booking.phone.replace(/[^\d+]/g, '')}`}
                  className="text-lagoon-deep underline"
                >
                  {booking.phone}
                </a>
              ) : (
                <span className="text-sea-ink-soft">Not given</span>
              )}
            </dd>
          </div>
        </dl>

        <div className="rounded-md border border-line p-4">
          <p className="island-kicker">Price breakdown</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sea-ink-soft">
              {formatPrice(rate)} × {booking.nights} nights
            </span>
            <span className="font-semibold text-sea-ink">
              {formatPrice(booking.total)}
            </span>
          </div>
        </div>

        {mutation.isError ? (
          <p className="text-red-600">{mutation.error.message}</p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {booking.status === 'pending' ? (
            <button
              type="button"
              className="btn btn-primary"
              disabled={mutation.isPending}
              onClick={() => setStatus('confirmed')}
            >
              Confirm
            </button>
          ) : null}
          {booking.status === 'confirmed' ? (
            <button
              type="button"
              className="btn btn-primary"
              disabled={mutation.isPending}
              onClick={() => setStatus('checked_in')}
            >
              Mark checked-in
            </button>
          ) : null}
          {booking.status === 'checked_in' ? (
            <button
              type="button"
              className="btn btn-primary"
              disabled={mutation.isPending}
              onClick={() => setStatus('checked_out')}
            >
              Mark checked-out
            </button>
          ) : null}
          {booking.status === 'pending' || booking.status === 'confirmed' ? (
            <button
              type="button"
              className="btn btn-warm"
              disabled={mutation.isPending}
              onClick={() => setConfirmCancel(true)}
            >
              Cancel booking
            </button>
          ) : null}
        </div>
      </div>

      <ConfirmDialog
        open={confirmCancel}
        title="Cancel this booking?"
        message={`Reservation ${booking.id} for ${booking.guestName} will be cancelled.`}
        confirmLabel="Cancel booking"
        destructive
        busy={mutation.isPending}
        onConfirm={cancel}
        onCancel={() => setConfirmCancel(false)}
      />
    </EntityDrawer>
  )
}
