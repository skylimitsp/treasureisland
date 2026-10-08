import { useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'

import { seo } from '#/lib/seo'
import { acceptInvite } from '#/lib/auth'
import { AuthCard } from '#/components/auth/auth-card'
import { AuthField } from '#/components/auth/auth-field'

export const Route = createFileRoute('/auth/invite')({
  validateSearch: (search: Record<string, unknown>): { token?: string } => ({
    token: typeof search.token === 'string' ? search.token : undefined,
  }),
  head: () => seo({ title: 'Accept invite', noindex: true }),
  component: InvitePage,
})

// New staff open the emailed link, choose a name and password, and land in the console.
function InvitePage() {
  const { token } = Route.useSearch()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (!token) {
    return (
      <AuthCard title="Invite link missing">
        <p className="text-sm text-sea-ink-soft">
          Open the link from your invite email, or ask an admin to send a new
          one.
        </p>
        <Link to="/auth/login" className="btn btn-ghost mt-6 w-full">
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
      await acceptInvite(token ?? '', name.trim(), password)
      await navigate({ to: '/admin' })
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to accept the invite',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthCard
      title="Join the team"
      intro="Set your name and a password to activate your staff account."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <AuthField
          label="Full name"
          autoComplete="name"
          value={name}
          onChange={setName}
          required
        />
        <AuthField
          label="Password"
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
          {busy ? 'Activating…' : 'Activate account'}
        </button>
      </form>
    </AuthCard>
  )
}
