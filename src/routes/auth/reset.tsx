import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'

import { seo } from '#/lib/seo'
import { api } from '#/lib/api-client'
import { AuthCard } from '#/components/auth/auth-card'
import { AuthField } from '#/components/auth/auth-field'

export const Route = createFileRoute('/auth/reset')({
  validateSearch: (search: Record<string, unknown>): { token?: string } => ({
    token: typeof search.token === 'string' ? search.token : undefined,
  }),
  head: () => seo({ title: 'Reset password', noindex: true }),
  component: ResetPage,
})

// Sets a new password from the emailed link; other sessions are signed out by the API.
function ResetPage() {
  const { token } = Route.useSearch()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)

  if (!token || done) {
    return (
      <AuthCard title={done ? 'Password updated' : 'Reset link missing'}>
        <p className="text-sm text-sea-ink-soft">
          {done
            ? 'You can now sign in with your new password.'
            : 'Open the link from your reset email, or request a new one.'}
        </p>
        <Link to="/auth/login" className="btn btn-primary mt-6 w-full">
          Go to sign in
        </Link>
      </AuthCard>
    )
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) return setError('The passwords do not match.')
    setBusy(true)
    setError(null)
    try {
      await api.post('/auth/password/reset', { token, password })
      setDone(true)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to reset the password',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthCard title="Choose a new password">
      <form onSubmit={onSubmit} className="space-y-4">
        <AuthField
          label="New password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
          minLength={10}
          hint="At least 10 characters."
          required
        />
        <AuthField
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={setConfirm}
          required
        />
        <p aria-live="assertive" className="min-h-5 text-sm text-destructive">
          {error}
        </p>
        <button
          type="submit"
          disabled={busy}
          className="btn btn-primary w-full disabled:opacity-60"
        >
          {busy ? 'Saving…' : 'Save password'}
        </button>
      </form>
    </AuthCard>
  )
}
