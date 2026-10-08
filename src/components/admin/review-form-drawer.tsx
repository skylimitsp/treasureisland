import { useState } from 'react'

import { ApiRequestError } from '#/lib/api-client'
import { useCreateReviewMutation } from '#/hooks/mutations/reviews.mutation'
import { EntityDrawer } from '#/components/admin/entity-drawer'
import type { ReviewInput } from '#/hooks/mutations/reviews.mutation'

const EMPTY: ReviewInput = {
  name: '',
  origin: '',
  quote: '',
  rating: null,
  featured: true,
}

const fieldClass =
  'mt-1.5 min-h-11 w-full rounded-md border border-line bg-[color:var(--surface)] px-3 py-2 text-sea-ink outline-none focus:border-lagoon'

// Admin form for adding a guest review by hand; featured reviews show on the site.
export function ReviewFormDrawer({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const create = useCreateReviewMutation()
  const [form, setForm] = useState<ReviewInput>(EMPTY)
  const [touched, setTouched] = useState(false)

  const errors = {
    name: form.name.trim().length < 2 ? 'Add the guest’s name.' : null,
    quote: form.quote.trim().length < 2 ? 'Add the review text.' : null,
  }
  const serverErrors = new Map(
    create.error instanceof ApiRequestError
      ? (create.error.details ?? []).map((d) => [d.path, d.message])
      : [],
  )
  const errorFor = (field: 'name' | 'quote' | 'origin') =>
    (touched && errors[field as 'name' | 'quote']) || serverErrors.get(field)

  function set<TKey extends keyof ReviewInput>(
    key: TKey,
    value: ReviewInput[TKey],
  ) {
    create.reset()
    setForm((f) => ({ ...f, [key]: value }))
  }

  function close() {
    setForm(EMPTY)
    setTouched(false)
    create.reset()
    onClose()
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched(true)
    if (errors.name || errors.quote) return
    create.mutate(
      {
        ...form,
        name: form.name.trim(),
        origin: form.origin.trim(),
        quote: form.quote.trim(),
      },
      { onSuccess: close },
    )
  }

  return (
    <EntityDrawer
      open={open}
      title="Add a review"
      description="Type in a review a guest gave you, for example on Google, TripAdvisor or in the guest book."
      onClose={close}
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <label className="block text-sm font-semibold text-sea-ink">
          Guest name *
          <input
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            aria-invalid={Boolean(errorFor('name'))}
            className={fieldClass}
            placeholder="e.g. Akosua Boateng"
          />
          {errorFor('name') ? (
            <span className="mt-1 block text-xs font-normal text-destructive">
              {errorFor('name')}
            </span>
          ) : null}
        </label>

        <label className="block text-sm font-semibold text-sea-ink">
          From <span className="font-normal text-sea-ink-soft">(optional)</span>
          <input
            value={form.origin}
            onChange={(e) => set('origin', e.target.value)}
            className={fieldClass}
            placeholder="e.g. Guest · 3 Bedroom Supreme, or Accra"
          />
        </label>

        <label className="block text-sm font-semibold text-sea-ink">
          Rating{' '}
          <span className="font-normal text-sea-ink-soft">(optional)</span>
          <select
            value={form.rating ?? ''}
            onChange={(e) =>
              set('rating', e.target.value ? Number(e.target.value) : null)
            }
            className={fieldClass}
          >
            <option value="">No rating</option>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {'★'.repeat(n)} ({n} of 5)
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-semibold text-sea-ink">
          Review *
          <textarea
            rows={6}
            value={form.quote}
            onChange={(e) => set('quote', e.target.value)}
            aria-invalid={Boolean(errorFor('quote'))}
            maxLength={2000}
            className={`${fieldClass} min-h-32`}
            placeholder="What the guest said, in their words."
          />
          <span className="mt-1 flex justify-between text-xs font-normal">
            <span className="text-destructive">{errorFor('quote')}</span>
            <span className="text-sea-ink-soft">{form.quote.length}/2000</span>
          </span>
        </label>

        <label className="flex items-start gap-3 text-sm text-sea-ink">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => set('featured', e.target.checked)}
            className="mt-0.5 size-4"
          />
          <span>
            Show on the website
            <span className="block text-xs text-sea-ink-soft">
              Featured reviews appear in the testimonials section.
            </span>
          </span>
        </label>

        <p aria-live="assertive" className="min-h-5 text-sm text-destructive">
          {create.isError && serverErrors.size === 0
            ? create.error.message
            : null}
        </p>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={create.isPending}
            className="btn btn-primary flex-1 disabled:opacity-60"
          >
            {create.isPending ? 'Saving…' : 'Add review'}
          </button>
          <button type="button" onClick={close} className="btn btn-ghost">
            Cancel
          </button>
        </div>
      </form>
    </EntityDrawer>
  )
}
