import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Minus, Plus, Search } from 'lucide-react'

// Frosted quick-search: seeds the booking flow by deep-linking to /rooms.
export function HeroSearch() {
  const navigate = useNavigate()
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    navigate({
      to: '/rooms',
      search: {
        checkIn: checkIn || undefined,
        checkOut: checkOut || undefined,
        guests,
      },
    })
  }

  return (
    <form
      onSubmit={onSubmit}
      className="island-shell mt-8 grid gap-3 rounded-md p-3 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end"
    >
      <label className="rounded-md border border-line bg-white/70 px-4 py-2">
        <span className="island-kicker block">Check-in</span>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="mt-1 w-full bg-transparent text-sea-ink outline-none"
        />
      </label>

      <label className="rounded-md border border-line bg-white/70 px-4 py-2">
        <span className="island-kicker block">Check-out</span>
        <input
          type="date"
          value={checkOut}
          min={checkIn || undefined}
          onChange={(e) => setCheckOut(e.target.value)}
          className="mt-1 w-full bg-transparent text-sea-ink outline-none"
        />
      </label>

      <div className="rounded-md border border-line bg-white/70 px-4 py-2">
        <span className="island-kicker block">Guests</span>
        <div className="mt-1 flex items-center gap-3">
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
            onClick={() => setGuests((g) => Math.min(8, g + 1))}
            className="flex size-7 items-center justify-center rounded-full border border-line"
          >
            <Plus size={14} aria-hidden />
          </button>
        </div>
      </div>

      <button type="submit" className="btn btn-primary h-12">
        <Search size={16} aria-hidden /> Search stays
      </button>
    </form>
  )
}
