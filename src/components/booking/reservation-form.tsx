import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'

import { DateInput } from '#/components/shared/date-input'
import { WhatsappButton } from '#/components/shared/whatsapp-button'
import { ROOM_TYPES } from '#/constants/room-types'
import type { RoomType } from '#/constants/room-types'
import { EMAIL_RE, isPhone } from '#/lib/validation'
import { waDate, whatsappUrl } from '#/lib/whatsapp'

const VERB = 'Request via WhatsApp'

const today = () => new Date().toISOString().slice(0, 10)

const nightsBetween = (from: string, to: string) =>
  from && to ? Math.round((Date.parse(to) - Date.parse(from)) / 86_400_000) : 0

const inputClass =
  'w-full rounded-md border border-line bg-foam/80 px-3 py-2 text-sea-ink outline-none focus:border-lagoon-deep focus:ring-2 focus:ring-lagoon/30 disabled:opacity-60'

// Date fields wrap a bare input, so focus styles move to the wrapping box.
const dateBoxClass = inputClass.replace(/focus:/g, 'focus-within:')

// Stay reservation request: the guest's choices open a pre-filled WhatsApp
// chat with reservations, who confirm availability and rates.
export function ReservationForm({ roomType }: { roomType?: RoomType }) {
  const [type, setType] = useState<string>(roomType ?? '')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')
  const [touched, setTouched] = useState(false)

  const nights = nightsBetween(checkIn, checkOut)
  const datesOk = Boolean(checkIn) && nights > 0
  const emailOk = !email || EMAIL_RE.test(email)
  const phoneOk = isPhone(phone)
  const valid = Boolean(type) && datesOk && name.trim() && phoneOk && emailOk

  const href = whatsappUrl([
    'Hello Treasure Island Ada, I would like to book a stay:',
    type && `Room type: ${type}`,
    checkIn && `Check-in: ${waDate(checkIn)}`,
    checkOut && `Check-out: ${waDate(checkOut)}`,
    nights > 0 && `Nights: ${nights}`,
    `Guests: ${guests}`,
    name.trim() && `Name: ${name.trim()}`,
    phoneOk && `Phone: ${phone.trim()}`,
    email && `Email: ${email}`,
    note.trim() && `Requests: ${note.trim()}`,
  ])

  const missing = [
    !type && 'a room type',
    !datesOk && 'check-in and check-out dates',
    !name.trim() && 'your name',
    !phoneOk && 'a phone number',
  ].filter((m): m is string => Boolean(m))
  const missingText =
    missing.length > 1
      ? `${missing.slice(0, -1).join(', ')} and ${missing[missing.length - 1]}`
      : missing[0]

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      noValidate
      className="island-shell rounded-md p-6 md:p-8"
    >
      <h2 className="display-title text-2xl">Reservation request</h2>
      <p className="mt-1 text-sm text-sea-ink-soft">
        Tell us when you’d like to stay. Our reservations team confirms
        availability and rates on WhatsApp.
      </p>

      <label className="mt-6 block text-sm font-semibold text-sea-ink">
        Room type *
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          aria-invalid={touched && !type}
          className={`mt-1.5 font-normal ${inputClass}`}
        >
          <option value="">Select a room type</option>
          {ROOM_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-sea-ink">
          Check-in *
          <DateInput
            min={today()}
            value={checkIn}
            placeholder="Add date"
            onChange={(e) => {
              setCheckIn(e.target.value)
              if (checkOut && e.target.value >= checkOut) setCheckOut('')
            }}
            aria-invalid={touched && !checkIn}
            className={`mt-1.5 font-normal ${dateBoxClass}`}
          />
        </label>
        <label className="block text-sm font-semibold text-sea-ink">
          Check-out *
          <DateInput
            min={checkIn || today()}
            value={checkOut}
            placeholder="Add date"
            onChange={(e) => setCheckOut(e.target.value)}
            aria-invalid={touched && !datesOk}
            className={`mt-1.5 font-normal ${dateBoxClass}`}
          />
        </label>
      </div>
      {nights > 0 ? (
        <p className="mt-2 text-sm text-sea-ink-soft">
          {nights} {nights === 1 ? 'night' : 'nights'}
        </p>
      ) : null}

      <div className="mt-4">
        <span className="block text-sm font-semibold text-sea-ink">Guests</span>
        <div className="mt-1.5 flex items-center justify-between rounded-md border border-line p-2">
          <button
            type="button"
            aria-label="Fewer guests"
            onClick={() => setGuests((g) => Math.max(1, g - 1))}
            className="flex size-8 items-center justify-center rounded-full border border-line"
          >
            <Minus size={14} aria-hidden />
          </button>
          <span className="w-6 text-center font-semibold" aria-live="polite">
            {guests}
          </span>
          <button
            type="button"
            aria-label="More guests"
            onClick={() => setGuests((g) => Math.min(20, g + 1))}
            className="flex size-8 items-center justify-center rounded-full border border-line"
          >
            <Plus size={14} aria-hidden />
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-sea-ink">
          Full name *
          <input
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={touched && !name.trim()}
            className={`mt-1.5 font-normal ${inputClass}`}
          />
        </label>
        <label className="block text-sm font-semibold text-sea-ink">
          Phone *
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+233 24 123 4567"
            aria-invalid={touched && !phoneOk}
            className={`mt-1.5 font-normal ${inputClass}`}
          />
        </label>
      </div>

      <label className="mt-4 block text-sm font-semibold text-sea-ink">
        Email <span className="font-normal text-sea-ink-soft">(optional)</span>
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-invalid={touched && !emailOk}
          className={`mt-1.5 font-normal ${inputClass}`}
        />
      </label>

      <label className="mt-4 block text-sm font-semibold text-sea-ink">
        Special requests{' '}
        <span className="font-normal text-sea-ink-soft">(optional)</span>
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Arrival time, occasions, accessibility needs…"
          className={`mt-1.5 font-normal ${inputClass}`}
        />
      </label>

      <WhatsappButton
        href={href}
        label={VERB}
        variant="primary"
        disabled={!valid}
        onBlockedClick={() => setTouched(true)}
        className="mt-6"
      />

      <p aria-live="assertive" className="mt-2 min-h-5 text-sm">
        {touched && !valid ? (
          <span className="text-destructive">
            {missingText ? `Add ${missingText}.` : 'Check your email address.'}
          </span>
        ) : null}
      </p>

      <p className="mt-1 text-xs text-sea-ink-soft">
        No payment is taken here — this opens a WhatsApp chat with our team.
      </p>
    </form>
  )
}
