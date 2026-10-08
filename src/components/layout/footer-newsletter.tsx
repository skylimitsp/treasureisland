import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

import { useSubscribeNewsletterMutation } from '#/hooks/mutations/newsletter.mutation'
import { EMAIL_RE } from '#/lib/validation'

// Centered newsletter band atop the footer; the button sits inside the field.
export function FooterNewsletter() {
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const subscribe = useSubscribeNewsletterMutation()
  const invalid = touched && !EMAIL_RE.test(email)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched(true)
    if (!EMAIL_RE.test(email)) return
    subscribe.mutate(
      { email, source: 'footer' },
      { onSuccess: () => setEmail('') },
    )
  }

  return (
    <div className="mx-auto max-w-xl text-center">
      <p className="text-sm text-white/70">Letters from the shore.</p>
      <h2 className="display-title mt-2 text-3xl text-white md:text-4xl">
        Sign up for our newsletter
      </h2>
      <p className="mt-3 text-sm text-white/75">
        News, offers and events from Treasure Island Ada.
      </p>

      <form
        onSubmit={onSubmit}
        noValidate
        className="mt-7 flex items-center gap-2 rounded-md bg-white p-1.5 focus-within:ring-2 focus-within:ring-lagoon/60"
      >
        <label className="sr-only" htmlFor="nl-footer">
          Email address
        </label>
        <input
          id="nl-footer"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="Enter your email address"
          aria-invalid={invalid}
          className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-footer outline-none placeholder:text-footer/60"
        />
        <button
          type="submit"
          disabled={subscribe.isPending}
          className="btn btn-primary disabled:opacity-60"
        >
          {subscribe.isPending ? 'Subscribing…' : 'Subscribe'}
          <ArrowRight size={16} aria-hidden />
        </button>
      </form>

      <p aria-live="polite" className="mt-3 min-h-5 text-sm">
        {invalid ? (
          <span className="text-sunset">Enter a valid email address.</span>
        ) : subscribe.isSuccess ? (
          <span className="text-white">
            Almost there — check your email to confirm.
          </span>
        ) : subscribe.isError ? (
          <span className="text-sunset">{subscribe.error.message}</span>
        ) : null}
      </p>
    </div>
  )
}
