import { useState } from 'react'
import { CheckCircle2, Minus, Plus } from 'lucide-react'

import { formatPrice } from '#/lib/format'
import { useCreateBookingMutation } from '#/hooks/mutations/rooms.mutation'
import type { Room } from '#/types'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function nights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime()
  return ms > 0 ? Math.round(ms / 86400000) : 0
}

// Sticky reserve card — computes nights × rate and creates a booking.
export function BookingCard({
  room,
  initialCheckIn = '',
  initialCheckOut = '',
  initialGuests = 2,
}: {
  room: Room
  initialCheckIn?: string
  initialCheckOut?: string
  initialGuests?: number
}) {
  const [checkIn, setCheckIn] = useState(initialCheckIn)
  const [checkOut, setCheckOut] = useState(initialCheckOut)
  const [guests, setGuests] = useState(Math.min(initialGuests, room.maxGuests))
  const [guestName, setGuestName] = useState('')
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const booking = useCreateBookingMutation()

  const n = nights(checkIn, checkOut)
  const total = n * room.pricePerNight
  const emailOk = EMAIL_RE.test(email)
  const valid = n > 0 && guestName.trim() && emailOk

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched(true)
    if (!valid) return
    booking.mutate({
      roomSlug: room.slug,
      guestName,
      email,
      checkIn,
      checkOut,
      guests,
    })
  }

  if (booking.isSuccess) {
    const b = booking.data
    return (
      <div className="island-shell rounded-md p-6">
        <CheckCircle2 className="text-palm" aria-hidden />
        <h3 className="display-title mt-3 text-xl">Booking confirmed</h3>
        <p className="mt-1 text-sm text-sea-ink-soft">
          Reference <strong>{b.id}</strong> — a confirmation has been sent to{' '}
          {b.email}.
        </p>
        <dl className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between">
            <dt className="text-sea-ink-soft">Room</dt>
            <dd>{b.roomName}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sea-ink-soft">Nights</dt>
            <dd>{b.nights}</dd>
          </div>
          <div className="flex justify-between font-semibold">
            <dt>Total</dt>
            <dd>{formatPrice(b.total)}</dd>
          </div>
        </dl>
        <button
          className="btn btn-ghost mt-5 w-full"
          onClick={() => booking.reset()}
        >
          Book another stay
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="island-shell rounded-md p-6">
      <p className="flex items-baseline gap-1">
        <span className="display-title text-2xl text-sea-ink">
          {formatPrice(room.pricePerNight)}
        </span>
        <span className="text-sm text-sea-ink-soft">/ night</span>
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <label className="rounded-md border border-line p-2 text-sm">
          <span className="island-kicker block">Check-in</span>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="mt-1 w-full bg-transparent outline-none"
          />
        </label>
        <label className="rounded-md border border-line p-2 text-sm">
          <span className="island-kicker block">Check-out</span>
          <input
            type="date"
            value={checkOut}
            min={checkIn || undefined}
            onChange={(e) => setCheckOut(e.target.value)}
            className="mt-1 w-full bg-transparent outline-none"
          />
        </label>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-md border border-line p-3">
        <span className="island-kicker">Guests</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Fewer guests"
            onClick={() => setGuests((g) => Math.max(1, g - 1))}
            className="flex size-7 items-center justify-center rounded-full border border-line"
          >
            <Minus size={14} aria-hidden />
          </button>
          <span className="w-4 text-center font-semibold">{guests}</span>
          <button
            type="button"
            aria-label="More guests"
            onClick={() => setGuests((g) => Math.min(room.maxGuests, g + 1))}
            className="flex size-7 items-center justify-center rounded-full border border-line"
          >
            <Plus size={14} aria-hidden />
          </button>
        </div>
      </div>

      <input
        type="text"
        value={guestName}
        onChange={(e) => setGuestName(e.target.value)}
        placeholder="Full name"
        className="mt-3 w-full rounded-md border border-line bg-foam/80 px-3 py-2 outline-none focus:border-lagoon-deep focus:ring-2 focus:ring-lagoon/30"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        aria-invalid={touched && !emailOk}
        className="mt-2 w-full rounded-md border border-line bg-foam/80 px-3 py-2 outline-none focus:border-lagoon-deep focus:ring-2 focus:ring-lagoon/30"
      />

      {n > 0 ? (
        <dl className="mt-4 border-t border-line pt-4 text-sm">
          <div className="flex justify-between text-sea-ink-soft">
            <dt>
              {formatPrice(room.pricePerNight)} × {n}{' '}
              {n === 1 ? 'night' : 'nights'}
            </dt>
            <dd>{formatPrice(total)}</dd>
          </div>
          <div className="mt-2 flex justify-between text-base font-semibold">
            <dt>Total</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
        </dl>
      ) : null}

      <button
        type="submit"
        disabled={booking.isPending}
        className="btn btn-primary mt-4 w-full disabled:opacity-60"
      >
        {booking.isPending ? 'Reserving…' : 'Reserve'}
      </button>

      <p aria-live="polite" className="mt-2 min-h-5 text-sm">
        {touched && !valid ? (
          <span className="text-destructive">
            Add valid dates, your name, and a valid email.
          </span>
        ) : booking.isError ? (
          <span className="text-destructive">{booking.error.message}</span>
        ) : null}
      </p>
    </form>
  )
}
