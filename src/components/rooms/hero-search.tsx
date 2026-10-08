import { useId, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Minus, Plus, Search } from 'lucide-react'
import { DateInput } from '#/components/shared/date-input'

// Labels sit above the fields so every field box shares the button's 48px height.
const fieldBox =
  'flex h-12 items-center rounded-md border border-line glass-field px-4'

// Frosted quick-search: seeds the booking flow by deep-linking to /rooms.
export function HeroSearch() {
  const navigate = useNavigate()
  const id = useId()
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
      <div>
        <label htmlFor={`${id}-in`} className="island-kicker mb-1.5 block px-1">
          Check-in
        </label>
        <DateInput
          id={`${id}-in`}
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className={`${fieldBox} text-sea-ink focus-within:border-lagoon-deep focus-within:ring-2 focus-within:ring-lagoon/30`}
        />
      </div>

      <div>
        <label
          htmlFor={`${id}-out`}
          className="island-kicker mb-1.5 block px-1"
        >
          Check-out
        </label>
        <DateInput
          id={`${id}-out`}
          value={checkOut}
          min={checkIn || undefined}
          onChange={(e) => setCheckOut(e.target.value)}
          className={`${fieldBox} text-sea-ink focus-within:border-lagoon-deep focus-within:ring-2 focus-within:ring-lagoon/30`}
        />
      </div>

      <div role="group" aria-labelledby={`${id}-guests`}>
        <span id={`${id}-guests`} className="island-kicker mb-1.5 block px-1">
          Guests
        </span>
        <div className={`${fieldBox} justify-between gap-4`}>
          <button
            type="button"
            aria-label="Fewer guests"
            onClick={() => setGuests((g) => Math.max(1, g - 1))}
            className="relative flex size-8 items-center justify-center rounded-full border border-line after:absolute after:-inset-2 after:content-['']"
          >
            <Minus size={14} aria-hidden />
          </button>
          <span
            className="w-4 text-center font-semibold text-sea-ink"
            aria-live="polite"
          >
            {guests}
          </span>
          <button
            type="button"
            aria-label="More guests"
            onClick={() => setGuests((g) => Math.min(8, g + 1))}
            className="relative flex size-8 items-center justify-center rounded-full border border-line after:absolute after:-inset-2 after:content-['']"
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
