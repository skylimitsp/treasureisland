import { useEffect, useState } from 'react'
import { AlertCircle, Minus, Plus } from 'lucide-react'

import { waDate, whatsappUrl } from '#/lib/whatsapp'
import type { EventCategory, EventEnquiryInput } from '#/types'
import { DateInput } from '#/components/shared/date-input'
import { WhatsappButton } from '#/components/shared/whatsapp-button'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[+\d][\d\s()-]{6,}$/

const TYPE_OPTIONS: Array<{ value: EventCategory; label: string }> = [
  { value: 'weddings', label: 'Wedding' },
  { value: 'birthdays', label: 'Birthday party' },
  { value: 'family', label: 'Family party' },
  { value: 'meetings', label: 'Meetings & Events' },
]

const BUDGET_OPTIONS = ['Under $5k', '$5–15k', '$15–40k', '$40k+']

const today = () => new Date().toISOString().slice(0, 10)

type FormValues = Omit<EventEnquiryInput, 'consent'>

const INITIAL: FormValues = {
  eventType: 'weddings',
  date: '',
  flexibleDates: false,
  guests: 40,
  name: '',
  email: '',
  phone: '',
  budget: null,
  message: '',
}

type Errors = Partial<Record<keyof FormValues, string>>

function validate(values: FormValues): Errors {
  const errors: Errors = {}
  if (!values.date) errors.date = 'Please add your preferred date.'
  else if (values.date < today()) errors.date = 'Choose today or a future date.'
  if (!Number.isInteger(values.guests) || values.guests < 1)
    errors.guests = 'Guests must be at least 1.'
  if (!values.name.trim()) errors.name = 'Please add your name.'
  if (!values.email.trim()) errors.email = 'Please add your email.'
  else if (!EMAIL_RE.test(values.email))
    errors.email = 'Enter a valid email address.'
  if (!values.phone.trim()) errors.phone = 'Please add your phone number.'
  else if (!PHONE_RE.test(values.phone))
    errors.phone = 'Enter a valid phone number.'
  if (values.message.trim() && values.message.trim().length < 10)
    errors.message = 'Tell us a little more (10+ characters).'
  return errors
}

const inputClass =
  'w-full rounded-md border border-line bg-foam/80 px-4 py-3 text-sea-ink outline-none focus:border-lagoon-deep focus:ring-2 focus:ring-lagoon/30 disabled:opacity-60'

// Date fields wrap a bare input, so focus styles move to the wrapping box.
const dateBoxClass = inputClass.replace(/focus:/g, 'focus-within:')

// Celebration enquiry, sent to the events team as a pre-filled WhatsApp message.
export function RequestForm({
  defaults,
}: {
  defaults: { eventType?: EventCategory }
}) {
  const [values, setValues] = useState<FormValues>(INITIAL)
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormValues, boolean>>
  >({})
  const [attempted, setAttempted] = useState(false)

  // Prefill the event type when an event card CTA is clicked upstream.
  useEffect(() => {
    setValues((v) => ({ ...v, eventType: defaults.eventType ?? v.eventType }))
  }, [defaults])

  const errors = validate(values)
  const isValid = Object.keys(errors).length === 0
  const show = (field: keyof FormValues) =>
    (touched[field] || attempted) && errors[field]

  function set<TField extends keyof FormValues>(
    field: TField,
    value: FormValues[TField],
  ) {
    setValues((v) => ({ ...v, [field]: value }))
  }
  function blur(field: keyof FormValues) {
    setTouched((t) => ({ ...t, [field]: true }))
  }

  const typeLabel =
    TYPE_OPTIONS.find((o) => o.value === values.eventType)?.label ??
    values.eventType
  const href = whatsappUrl([
    'Hello Treasure Island Ada, I would like to enquire about an event:',
    `Event: ${typeLabel}`,
    values.date &&
      `Preferred date: ${waDate(values.date)}${values.flexibleDates ? ' (flexible)' : ''}`,
    `Guests: ${values.guests}`,
    values.budget && `Budget: ${values.budget}`,
    `Name: ${values.name.trim()}`,
    `Phone: ${values.phone.trim()}`,
    `Email: ${values.email.trim()}`,
    values.message.trim() && `Details: ${values.message.trim()}`,
  ])

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      noValidate
      className="island-shell rounded-md p-6 md:p-8"
    >
      <p className="text-sm text-sea-ink-soft">
        This is an <strong className="text-sea-ink">enquiry</strong>, not an
        instant booking. It opens WhatsApp with your details for our event
        consultants.
      </p>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="ev-type"
            className="block text-sm font-semibold text-sea-ink"
          >
            Event type *
          </label>
          <select
            id="ev-type"
            aria-required
            value={values.eventType}
            onChange={(e) => set('eventType', e.target.value as EventCategory)}
            className={`mt-1.5 ${inputClass}`}
          >
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="ev-date"
            className="block text-sm font-semibold text-sea-ink"
          >
            Preferred date *
          </label>
          <DateInput
            id="ev-date"
            placeholder="Choose a date"
            min={today()}
            aria-required
            aria-invalid={Boolean(show('date'))}
            aria-describedby={show('date') ? 'err-date' : undefined}
            value={values.date}
            onChange={(e) => set('date', e.target.value)}
            onBlur={() => blur('date')}
            className={`mt-1.5 ${dateBoxClass}`}
          />
          {show('date') ? (
            <p
              id="err-date"
              className="mt-1 flex items-center gap-1 text-sm text-destructive"
            >
              <AlertCircle size={14} aria-hidden /> {errors.date}
            </p>
          ) : null}
        </div>

        <div>
          <span className="block text-sm font-semibold text-sea-ink">
            Guests *
          </span>
          <div className="mt-1.5 flex items-center gap-2">
            <button
              type="button"
              aria-label="Decrease guests"
              onClick={() => set('guests', Math.max(1, values.guests - 1))}
              className="flex size-11 items-center justify-center rounded-md border border-line disabled:opacity-60"
            >
              <Minus size={16} aria-hidden />
            </button>
            <input
              type="number"
              min={1}
              aria-required
              aria-label="Guest count"
              aria-invalid={Boolean(show('guests'))}
              aria-describedby={show('guests') ? 'err-guests' : undefined}
              value={values.guests}
              onChange={(e) =>
                set('guests', Math.floor(Number(e.target.value)) || 0)
              }
              onBlur={() => blur('guests')}
              className={`w-24 text-center ${inputClass}`}
            />
            <button
              type="button"
              aria-label="Increase guests"
              onClick={() => set('guests', values.guests + 1)}
              className="flex size-11 items-center justify-center rounded-md border border-line disabled:opacity-60"
            >
              <Plus size={16} aria-hidden />
            </button>
          </div>
          {show('guests') ? (
            <p
              id="err-guests"
              className="mt-1 flex items-center gap-1 text-sm text-destructive"
            >
              <AlertCircle size={14} aria-hidden /> {errors.guests}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="ev-budget"
            className="block text-sm font-semibold text-sea-ink"
          >
            Budget range
          </label>
          <select
            id="ev-budget"
            value={values.budget ?? ''}
            onChange={(e) => set('budget', e.target.value || null)}
            className={`mt-1.5 ${inputClass}`}
          >
            <option value="">No preference</option>
            {BUDGET_OPTIONS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="ev-name"
            className="block text-sm font-semibold text-sea-ink"
          >
            Name *
          </label>
          <input
            id="ev-name"
            type="text"
            aria-required
            aria-invalid={Boolean(show('name'))}
            aria-describedby={show('name') ? 'err-name' : undefined}
            value={values.name}
            onChange={(e) => set('name', e.target.value)}
            onBlur={() => blur('name')}
            className={`mt-1.5 ${inputClass}`}
          />
          {show('name') ? (
            <p
              id="err-name"
              className="mt-1 flex items-center gap-1 text-sm text-destructive"
            >
              <AlertCircle size={14} aria-hidden /> {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="ev-email"
            className="block text-sm font-semibold text-sea-ink"
          >
            Email *
          </label>
          <input
            id="ev-email"
            type="email"
            aria-required
            aria-invalid={Boolean(show('email'))}
            aria-describedby={show('email') ? 'err-email' : undefined}
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
            onBlur={() => blur('email')}
            className={`mt-1.5 ${inputClass}`}
          />
          {show('email') ? (
            <p
              id="err-email"
              className="mt-1 flex items-center gap-1 text-sm text-destructive"
            >
              <AlertCircle size={14} aria-hidden /> {errors.email}
            </p>
          ) : null}
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="ev-phone"
            className="block text-sm font-semibold text-sea-ink"
          >
            Phone *
          </label>
          <input
            id="ev-phone"
            type="tel"
            aria-required
            aria-invalid={Boolean(show('phone'))}
            aria-describedby={show('phone') ? 'err-phone' : undefined}
            value={values.phone}
            onChange={(e) => set('phone', e.target.value)}
            onBlur={() => blur('phone')}
            className={`mt-1.5 ${inputClass}`}
          />
          {show('phone') ? (
            <p
              id="err-phone"
              className="mt-1 flex items-center gap-1 text-sm text-destructive"
            >
              <AlertCircle size={14} aria-hidden /> {errors.phone}
            </p>
          ) : null}
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="ev-message"
            className="block text-sm font-semibold text-sea-ink"
          >
            Tell us about your day
          </label>
          <textarea
            id="ev-message"
            rows={4}
            aria-invalid={Boolean(show('message'))}
            aria-describedby={show('message') ? 'err-message' : undefined}
            value={values.message}
            onChange={(e) => set('message', e.target.value)}
            onBlur={() => blur('message')}
            className={`mt-1.5 ${inputClass}`}
          />
          {show('message') ? (
            <p
              id="err-message"
              className="mt-1 flex items-center gap-1 text-sm text-destructive"
            >
              <AlertCircle size={14} aria-hidden /> {errors.message}
            </p>
          ) : null}
        </div>
      </div>

      <label className="mt-4 flex items-start gap-3 text-sm text-sea-ink">
        <input
          type="checkbox"
          checked={values.flexibleDates}
          onChange={(e) => set('flexibleDates', e.target.checked)}
          className="mt-0.5 size-4"
        />
        My dates are flexible.
      </label>

      <WhatsappButton
        href={href}
        label="Send enquiry via WhatsApp"
        variant="primary"
        disabled={!isValid}
        onBlockedClick={() => setAttempted(true)}
        className="mt-6"
      />

      <p aria-live="assertive" className="mt-3 min-h-5 text-sm">
        {attempted && !isValid ? (
          <span className="flex items-center gap-1 text-destructive">
            <AlertCircle size={15} aria-hidden /> Please fix the highlighted
            fields.
          </span>
        ) : null}
      </p>

      <p className="mt-2 text-xs text-sea-ink-soft">
        No payment is taken and no date is held — this starts a WhatsApp
        conversation with our event consultants.
      </p>
    </form>
  )
}
