import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'

import { SlotRequestConfirmation } from '#/components/amenities/slot-request-confirmation'
import { useSlotRequestMutation } from '#/hooks/mutations/amenities.mutation'
import type { Amenity } from '#/types'
import { DateInput } from '#/components/shared/date-input'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const today = () => new Date().toISOString().slice(0, 10)

// CTA verb + time-slot options adapt to the amenity category.
const VERBS: Record<string, string> = {
  Dining: 'Reserve a table',
  Entertainment: 'Reserve seats',
  Adventure: 'Book a ride',
  'On the water': 'Book a session',
}

const SLOTS: Record<string, Array<string>> = {
  Dining: [
    'Breakfast · 8:00',
    'Lunch · 13:00',
    'Sunset · 18:00',
    'Dinner · 20:00',
  ],
  Entertainment: ['16:00', '17:30', '19:00', '20:30'],
  Adventure: ['Sunrise · 6:30', 'Golden hour · 16:30', 'Sunset · 17:30'],
  'On the water': ['09:00', '11:00', '14:00', 'Sunset · 16:30'],
}

const inputClass =
  'w-full rounded-md border border-line bg-foam/80 px-3 py-2 text-sea-ink outline-none focus:border-lagoon-deep focus:ring-2 focus:ring-lagoon/30 disabled:opacity-60'

// Date fields wrap a bare input, so focus styles move to the wrapping box.
const dateBoxClass = inputClass.replace(/focus:/g, 'focus-within:')

// Light reserve-a-slot request — no payment, no live inventory. Mirrors the
// room booking mechanics: validate, submit via mutation, confirm, aria-live.
export function SlotRequestCard({ amenity }: { amenity: Amenity }) {
  const verb = VERBS[amenity.category] ?? 'Request a slot'
  const slots = SLOTS[amenity.category] ?? ['Morning', 'Afternoon', 'Evening']

  const [date, setDate] = useState('')
  const [slot, setSlot] = useState('')
  const [partySize, setPartySize] = useState(2)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')
  const [touched, setTouched] = useState(false)
  const request = useSlotRequestMutation()

  const emailOk = EMAIL_RE.test(email)
  const valid = Boolean(date) && Boolean(slot) && name.trim() && emailOk

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched(true)
    if (!valid) return
    request.mutate({
      slug: amenity.slug,
      date,
      slot,
      partySize,
      name,
      email,
      note: note.trim() || undefined,
    })
  }

  if (request.isSuccess) {
    return (
      <SlotRequestConfirmation
        request={request.data}
        onReset={() => {
          request.reset()
          setTouched(false)
        }}
      />
    )
  }

  const pending = request.isPending

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="island-shell rounded-md p-6"
    >
      <h2 className="display-title text-xl">{verb}</h2>
      <p className="mt-1 text-sm text-sea-ink-soft">
        A request, not an instant booking — we’ll confirm by email.
      </p>

      <label className="mt-4 block text-sm font-semibold text-sea-ink">
        Date *
        <DateInput
          min={today()}
          value={date}
          placeholder="Choose a date"
          disabled={pending}
          onChange={(e) => setDate(e.target.value)}
          aria-invalid={touched && !date}
          className={`mt-1.5 font-normal ${dateBoxClass}`}
        />
      </label>

      <label className="mt-3 block text-sm font-semibold text-sea-ink">
        Time *
        <select
          value={slot}
          disabled={pending}
          onChange={(e) => setSlot(e.target.value)}
          aria-invalid={touched && !slot}
          className={`mt-1.5 font-normal ${inputClass}`}
        >
          <option value="">Select a time</option>
          {slots.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-3">
        <span className="block text-sm font-semibold text-sea-ink">
          Party size
        </span>
        <div className="mt-1.5 flex items-center justify-between rounded-md border border-line p-2">
          <button
            type="button"
            aria-label="Fewer guests"
            disabled={pending}
            onClick={() => setPartySize((p) => Math.max(1, p - 1))}
            className="flex size-8 items-center justify-center rounded-full border border-line disabled:opacity-60"
          >
            <Minus size={14} aria-hidden />
          </button>
          <span className="w-6 text-center font-semibold" aria-live="polite">
            {partySize}
          </span>
          <button
            type="button"
            aria-label="More guests"
            disabled={pending}
            onClick={() => setPartySize((p) => Math.min(20, p + 1))}
            className="flex size-8 items-center justify-center rounded-full border border-line disabled:opacity-60"
          >
            <Plus size={14} aria-hidden />
          </button>
        </div>
      </div>

      <label className="mt-3 block text-sm font-semibold text-sea-ink">
        Full name *
        <input
          type="text"
          value={name}
          disabled={pending}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={touched && !name.trim()}
          className={`mt-1.5 font-normal ${inputClass}`}
        />
      </label>

      <label className="mt-3 block text-sm font-semibold text-sea-ink">
        Email *
        <input
          type="email"
          value={email}
          disabled={pending}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-invalid={touched && !emailOk}
          className={`mt-1.5 font-normal ${inputClass}`}
        />
      </label>

      <label className="mt-3 block text-sm font-semibold text-sea-ink">
        Note <span className="font-normal text-sea-ink-soft">(optional)</span>
        <textarea
          rows={3}
          value={note}
          disabled={pending}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Allergies, occasions, requests…"
          className={`mt-1.5 font-normal ${inputClass}`}
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="btn btn-primary mt-5 w-full disabled:opacity-60"
      >
        {pending ? 'Sending…' : verb}
      </button>

      <p aria-live="assertive" className="mt-2 min-h-5 text-sm">
        {touched && !valid ? (
          <span className="text-destructive">
            Add a date, time, your name, and a valid email.
          </span>
        ) : request.isError ? (
          <span className="text-destructive">{request.error.message}</span>
        ) : null}
      </p>

      <p className="mt-1 text-xs text-sea-ink-soft">
        No payment is taken here — this simply starts the request.
      </p>
    </form>
  )
}
