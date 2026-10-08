import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { seo } from '#/lib/seo'
import { login } from '#/lib/auth'
import { api } from '#/lib/api-client'
import { AuthCard } from '#/components/auth/auth-card'
import { AuthField } from '#/components/auth/auth-field'

interface LoginSearch {
  redirect?: string
}

export const Route = createFileRoute('/auth/login')({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  head: () =>
    seo({
      title: 'Sign in',
      description: 'Staff sign-in for the Treasure Island admin console.',
      noindex: true,
    }),
  component: LoginPage,
})

// Only same-site paths are followed after sign-in (no open redirects).
const safeRedirect = (href?: string) =>
  href && href.startsWith('/') && !href.startsWith('//') ? href : '/admin'

function LoginPage() {
  const navigate = useNavigate()
  const { redirect } = Route.useSearch()
  const [mode, setMode] = useState<'login' | 'forgot' | 'sent'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onLogin(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await login(email.trim(), password)
      await navigate({ href: safeRedirect(redirect) })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in')
    } finally {
      setBusy(false)
    }
  }

  async function onForgot(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await api.post('/auth/password/forgot', { email: email.trim() })
      setMode('sent')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Please try again')
    } finally {
      setBusy(false)
    }
  }

  if (mode === 'sent') {
    return (
      <AuthCard title="Check your email">
        <p className="text-sm text-sea-ink-soft">
          If an account exists for {email}, we have sent a link to reset the
          password. It expires in 2 hours.
        </p>
        <button
          type="button"
          className="btn btn-ghost mt-6 w-full"
          onClick={() => setMode('login')}
        >
          Back to sign in
        </button>
      </AuthCard>
    )
  }

  const forgot = mode === 'forgot'
  return (
    <AuthCard
      title={forgot ? 'Reset your password' : 'Welcome back'}
      intro={
        forgot
          ? 'Enter your staff email and we will send you a reset link.'
          : 'Sign in with your staff email and password.'
      }
    >
      <form onSubmit={forgot ? onForgot : onLogin} className="space-y-4">
        <AuthField
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          required
        />
        {forgot ? null : (
          <AuthField
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={setPassword}
            required
          />
        )}
        <p aria-live="assertive" className="min-h-5 text-sm text-destructive">
          {error}
        </p>
        <button
          type="submit"
          disabled={busy}
          className="btn btn-primary w-full disabled:opacity-60"
        >
          {busy ? 'Please wait…' : forgot ? 'Send reset link' : 'Sign in'}
        </button>
      </form>
      <button
        type="button"
        className="mt-4 text-sm font-semibold text-lagoon-deep"
        onClick={() => {
          setError(null)
          setMode(forgot ? 'login' : 'forgot')
        }}
      >
        {forgot ? 'Back to sign in' : 'Forgot your password?'}
      </button>
    </AuthCard>
  )
}
