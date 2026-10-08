import type { ReactNode } from 'react'

// Centered card shared by the sign-in, invite and password-reset pages.
export function AuthCard({
  title,
  intro,
  children,
}: {
  title: string
  intro?: string
  children: ReactNode
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[color:var(--bg-base)] px-4">
      <div className="island-shell w-full max-w-md rounded-md p-8">
        <span className="island-kicker">Admin Console</span>
        <h1 className="display-title mt-2 text-3xl text-sea-ink">{title}</h1>
        {intro ? (
          <p className="mt-2 text-sm text-sea-ink-soft">{intro}</p>
        ) : null}
        <div className="mt-8">{children}</div>
      </div>
    </main>
  )
}
