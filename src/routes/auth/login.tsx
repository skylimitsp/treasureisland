import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ShieldCheck, Sparkles } from 'lucide-react'

import { seo } from '#/lib/seo'
import { signIn } from '#/lib/auth'
import { useUsersQuery } from '#/hooks/queries/users.query'
import type { Role, User } from '#/types'

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

function LoginPage() {
  const users = useUsersQuery()
  const navigate = useNavigate()
  const { redirect } = Route.useSearch()

  const signInAs = (role: Role) => {
    const user = users.data?.find((u: User) => u.role === role)
    if (!user) return
    signIn(user)
    if (redirect) navigate({ href: redirect })
    else navigate({ to: '/admin' })
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[color:var(--bg-base)] px-4">
      <div className="island-shell w-full max-w-md rounded-md p-8">
        <span className="island-kicker">Admin Console</span>
        <h1 className="display-title mt-2 text-3xl text-sea-ink">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-sea-ink-soft">
          Mock sign-in for the demo. Choose a role to enter the console — a real
          backend swaps this for a secure session.
        </p>

        <div className="mt-8 space-y-3">
          <button
            type="button"
            onClick={() => signInAs('admin')}
            disabled={!users.data}
            className="flex w-full items-center gap-3 rounded-md border border-line bg-[color:var(--surface)] px-4 py-3 text-left text-sea-ink hover:border-lagoon disabled:opacity-60"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-lagoon/15 text-lagoon-deep">
              <ShieldCheck size={20} aria-hidden />
            </span>
            <span>
              <span className="block font-semibold">Sign in as Admin</span>
              <span className="block text-xs text-sea-ink-soft">
                Full access — bookings, staff, settings
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => signInAs('concierge')}
            disabled={!users.data}
            className="flex w-full items-center gap-3 rounded-md border border-line bg-[color:var(--surface)] px-4 py-3 text-left text-sea-ink hover:border-lagoon disabled:opacity-60"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-sunset/15 text-sunset-deep">
              <Sparkles size={20} aria-hidden />
            </span>
            <span>
              <span className="block font-semibold">Sign in as Concierge</span>
              <span className="block text-xs text-sea-ink-soft">
                Operations — bookings, enquiries, reviews
              </span>
            </span>
          </button>
        </div>

        {users.isError ? (
          <p className="mt-4 text-sm text-red-600">{users.error.message}</p>
        ) : null}
      </div>
    </main>
  )
}
