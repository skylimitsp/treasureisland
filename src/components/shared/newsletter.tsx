import { useState } from 'react'

import { SectionKicker } from '#/components/shared/section-kicker'
import { useSubscribeNewsletterMutation } from '#/hooks/mutations/newsletter.mutation'
import type { NewsletterSource } from '#/types'
import { EMAIL_RE } from '#/lib/validation'

// Email capture with inline + footer variants. Submits via the mock mutation.
export function Newsletter({
  source,
  variant = 'inline',
}: {
  source: NewsletterSource
  variant?: 'inline' | 'footer'
}) {
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const subscribe = useSubscribeNewsletterMutation()
  const invalid = touched && !EMAIL_RE.test(email)
  const dark = variant === 'footer'

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched(true)
    if (!EMAIL_RE.test(email)) return
    subscribe.mutate({ email, source }, { onSuccess: () => setEmail('') })
  }

  return (
    <div
      className={
        variant === 'inline' ? 'island-shell rounded-md p-6 md:p-8' : ''
      }
    >
      <SectionKicker className={dark ? 'text-white/80' : ''}>
        Stay in the loop
      </SectionKicker>
      <p className={`mt-2 ${dark ? 'text-white/85' : 'text-sea-ink-soft'}`}>
        Slow mornings and first-look offers — a few times a year, never spam.
      </p>

      <form
        onSubmit={onSubmit}
        noValidate
        className="mt-4 flex flex-wrap gap-3"
      >
        <label className="sr-only" htmlFor={`nl-${source}`}>
          Email address
        </label>
        <input
          id={`nl-${source}`}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="you@example.com"
          aria-invalid={invalid}
          className="min-w-0 flex-1 rounded-md border border-line bg-foam/80 px-4 py-3 text-sea-ink outline-none focus:border-lagoon-deep focus:ring-2 focus:ring-lagoon/30"
        />
        <button
          type="submit"
          disabled={subscribe.isPending}
          className="btn btn-primary disabled:opacity-60"
        >
          {subscribe.isPending ? 'Subscribing…' : 'Subscribe'}
        </button>
      </form>

      <p aria-live="polite" className="mt-2 min-h-5 text-sm">
        {invalid ? (
          <span className="text-destructive">Enter a valid email address.</span>
        ) : subscribe.isSuccess ? (
          <span className={dark ? 'text-white' : 'text-palm'}>
            Almost there — check your email to confirm.
          </span>
        ) : subscribe.isError ? (
          <span className="text-destructive">{subscribe.error.message}</span>
        ) : null}
      </p>

      <p
        className={`mt-1 text-xs ${dark ? 'text-white/70' : 'text-sea-ink-soft'}`}
      >
        We respect your privacy. Unsubscribe anytime.
      </p>
    </div>
  )
}
