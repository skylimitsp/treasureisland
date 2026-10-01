import { useEffect, useRef, useState } from 'react'
import { AlertCircle, Minus, Plus } from 'lucide-react'

import { EnquiryConfirmation } from '#/components/events/enquiry-confirmation'
import { useCreateEventEnquiryMutation } from '#/hooks/mutations/events.mutation'
import type { EventCategory, EventEnquiry, EventEnquiryInput } from '#/types'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[+\d][\d\s()-]{6,}$/
const MAX_SUBMISSIONS = 5

const TYPE_OPTIONS: Array<{ value: EventCategory; label: string }> = [
  { value: 'weddings', label: 'Wedding' },
  { value: 'birthdays', label: 'Birthday' },
  { value: 'family', label: 'Family party' },
  { value: 'meetings', label: 'Meeting' },
]

const BUDGET_OPTIONS = ['Under $5k', '$5–15k', '$15–40k', '$40k+']

const today = () => new Date().toISOString().slice(0, 10)

interface FormValues extends Omit<EventEnquiryInput, 'guests'> {
  guests: number
  website: string // honeypot — must stay empty
}

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
  consent: false,
  website: '',
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

// Celebration enquiry form — an enquiry, not a booking. No payment is taken.
export function RequestForm({
  defaults,
}: {
  defaults: { eventType?: EventCategory; packageName?: string }
}) {
  const [values, setValues] = useState<FormValues>(INITIAL)
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormValues, boolean>>
  >({})
  const [attempted, setAttempted] = useState(false)
  const [submitted, setSubmitted] = useState<EventEnquiry | null>(null)
  const sentCount = useRef(0)
  const enquiry = useCreateEventEnquiryMutation()

  // Prefill event type / message when a card or tier CTA is clicked upstream.
  useEffect(() => {
    setValues((v) => ({
      ...v,
      eventType: defaults.eventType ?? v.eventType,
      message:
        defaults.packageName && !v.message
          ? `We'd love to hear about the ${defaults.packageName} package.`
          : v.message,
    }))
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

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setAttempted(true)
    if (!isValid) return

    // Honeypot: pretend to succeed without storing anything.
    if (values.website.trim()) {
      setSubmitted({
        ...toInput(values),
        id: 'ENQ-0000-0000',
        status: 'new',
        createdAt: new Date().toISOString(),
      })
      return
    }
    if (sentCount.current >= MAX_SUBMISSIONS) return

    enquiry.mutate(toInput(values), {
      onSuccess: (record) => {
        sentCount.current += 1
        setSubmitted(record)
      },
    })
  }

  if (submitted) return <EnquiryConfirmation enquiry={submitted} />

  const rateLimited = sentCount.current >= MAX_SUBMISSIONS
  const disabled = enquiry.isPending || rateLimited

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="island-shell rounded-md p-6 md:p-8"
    >
      <p className="text-sm text-sea-ink-soft">
        This is an <strong className="text-sea-ink">enquiry</strong>, not an
        instant booking — we will reply within 48 hours with a tailored
        proposal.
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
            disabled={disabled}
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
          <input
            id="ev-date"
            type="date"
            min={today()}
            aria-required
            aria-invalid={Boolean(show('date'))}
            aria-describedby={show('date') ? 'err-date' : undefined}
            disabled={disabled}
            value={values.date}
            onChange={(e) => set('date', e.target.value)}
            onBlur={() => blur('date')}
            className={`mt-1.5 ${inputClass}`}
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
              disabled={disabled}
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
              disabled={disabled}
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
              disabled={disabled}
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
            disabled={disabled}
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
            disabled={disabled}
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
            disabled={disabled}
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
            disabled={disabled}
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
            disabled={disabled}
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
          disabled={disabled}
          checked={values.flexibleDates}
          onChange={(e) => set('flexibleDates', e.target.checked)}
          className="mt-0.5 size-4"
        />
        My dates are flexible.
      </label>

      <label className="mt-3 flex items-start gap-3 text-sm text-sea-ink">
        <input
          type="checkbox"
          disabled={disabled}
          checked={values.consent}
          onChange={(e) => set('consent', e.target.checked)}
          className="mt-0.5 size-4"
        />
        Send me occasional island offers and planning tips.
      </label>

      {/* Honeypot — visually hidden, off-screen; bots that fill it are ignored. */}
      <div
        aria-hidden
        className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="ev-website">Website</label>
        <input
          id="ev-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => set('website', e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={disabled || (attempted && !isValid)}
        className="btn btn-primary mt-6 w-full disabled:opacity-60"
      >
        {enquiry.isPending ? 'Sending…' : 'Send enquiry'}
      </button>

      <p aria-live="assertive" className="mt-3 min-h-5 text-sm">
        {enquiry.isError ? (
          <span className="flex items-center gap-1 text-destructive">
            <AlertCircle size={15} aria-hidden /> {enquiry.error.message}{' '}
            <button
              type="button"
              onClick={() =>
                enquiry.mutate(toInput(values), { onSuccess: setSubmitted })
              }
              className="font-semibold underline"
            >
              Retry
            </button>
          </span>
        ) : rateLimited ? (
          <span className="text-sea-ink-soft">
            Thanks — you have sent a few enquiries already. Please email us
            directly for anything further.
          </span>
        ) : null}
      </p>

      <p className="mt-2 text-xs text-sea-ink-soft">
        No payment is taken here and no date is held — this simply starts the
        conversation with our events team.
      </p>
    </form>
  )
}

// Strips the honeypot before the value crosses the data seam.
function toInput(values: FormValues): EventEnquiryInput {
  const { website: _website, ...input } = values
  return input
}
