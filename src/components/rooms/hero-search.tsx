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
      className="glass-panel mt-8 grid gap-3 rounded-md p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_auto] sm:items-end"
    >
      <label className="rounded-md border border-line glass-field px-4 py-2 focus-within:border-lagoon-deep focus-within:ring-2 focus-within:ring-lagoon/30">
        <span className="island-kicker block">Check-in</span>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="mt-1 w-full min-w-0 bg-transparent text-sea-ink outline-none"
        />
      </label>

      <label className="rounded-md border border-line glass-field px-4 py-2 focus-within:border-lagoon-deep focus-within:ring-2 focus-within:ring-lagoon/30">
        <span className="island-kicker block">Check-out</span>
        <input
          type="date"
          value={checkOut}
          min={checkIn || undefined}
          onChange={(e) => setCheckOut(e.target.value)}
          className="mt-1 w-full min-w-0 bg-transparent text-sea-ink outline-none"
        />
      </label>

      <div className="rounded-md border border-line glass-field px-4 py-2">
        <span className="island-kicker block">Guests</span>
        <div className="mt-1 flex items-center gap-3">
          <button
            type="button"
            aria-label="Fewer guests"
            onClick={() => setGuests((g) => Math.max(1, g - 1))}
            className="relative flex size-7 items-center justify-center rounded-full border border-line after:absolute after:-inset-2 after:content-['']"
          >
            <Minus size={14} aria-hidden />
          </button>
          <span className="w-4 text-center font-semibold">{guests}</span>
          <button
            type="button"
            aria-label="More guests"
            onClick={() => setGuests((g) => Math.min(8, g + 1))}
            className="relative flex size-7 items-center justify-center rounded-full border border-line after:absolute after:-inset-2 after:content-['']"
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
