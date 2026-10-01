import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { CalendarDays, MapPin, Minus, Plus } from 'lucide-react'

import { formatPrice } from '#/lib/format'
import { useRoomsQuery } from '#/hooks/queries/rooms.query'
import { DateInput } from '#/components/shared/date-input'

// Info/booking card mirroring the StayBox reserve panel; seeds the /rooms flow.
export function StayCard() {
  const navigate = useNavigate()
  const rooms = useRoomsQuery()
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)

  const fromPrice = rooms.data?.length
    ? Math.min(...rooms.data.map((r) => r.pricePerNight))
    : null

  const onReserve = () =>
    navigate({
      to: '/rooms',
      search: {
        checkIn: checkIn || undefined,
        checkOut: checkOut || undefined,
        guests,
      },
    })

  return (
    <div className="island-shell rounded-md p-5">
      <label className="block">
        <span className="island-kicker">Location</span>
        <span className="mt-1 flex items-center gap-2 rounded-md border border-line bg-foam/80 px-3 py-2.5 text-sm">
          <MapPin size={15} className="text-lagoon-deep" aria-hidden />
          Treasure Island, Indian Ocean
        </span>
      </label>

      <div className="mt-4 flex items-center justify-between rounded-md border border-line bg-foam/80 px-3 py-2.5">
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
          <span className="w-4 text-center text-sm font-semibold">
            {guests}
          </span>
          <button
            type="button"
            aria-label="More guests"
            onClick={() => setGuests((g) => Math.min(8, g + 1))}
            className="flex size-7 items-center justify-center rounded-full border border-line"
          >
            <Plus size={14} aria-hidden />
          </button>
        </div>
      </div>

      <label className="mt-4 block">
        <span className="island-kicker">Check in</span>
        <span className="mt-1 flex items-center gap-2 rounded-md border border-line bg-foam/80 px-3 py-2 text-sm">
          <CalendarDays size={15} className="text-lagoon-deep" aria-hidden />
          <DateInput
            value={checkIn}
            showIcon={false}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full"
          />
        </span>
      </label>

      <label className="mt-4 block">
        <span className="island-kicker">Check out</span>
        <span className="mt-1 flex items-center gap-2 rounded-md border border-line bg-foam/80 px-3 py-2 text-sm">
          <CalendarDays size={15} className="text-lagoon-deep" aria-hidden />
          <DateInput
            value={checkOut}
            min={checkIn || undefined}
            showIcon={false}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full"
          />
        </span>
      </label>

      <div className="mt-5 flex items-end justify-between border-t border-line pt-4">
        <span className="text-sm text-sea-ink-soft">Pricing per night</span>
        <span className="text-right">
          <span className="block text-xs text-sea-ink-soft">Starting from</span>
          <span className="display-title text-xl text-sea-ink">
            {fromPrice ? `${formatPrice(fromPrice)} / night` : '—'}
          </span>
        </span>
      </div>

      <button
        type="button"
        onClick={onReserve}
        className="btn btn-primary mt-4 w-full"
      >
        Reserve
      </button>
    </div>
  )
}
