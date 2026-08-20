import { createFileRoute, redirect } from '@tanstack/react-router'

import { seo } from '#/lib/seo'
import { hasRole, hydrateSession } from '#/lib/auth'
import { SITE } from '#/constants/site'
import { AdminPageHeader } from '#/components/admin/admin-page-header'

export const Route = createFileRoute('/admin/settings')({
  beforeLoad: () => {
    if (typeof window === 'undefined') return
    hydrateSession()
    if (!hasRole('admin')) throw redirect({ to: '/admin' })
  },
  head: () => seo({ title: 'Settings', noindex: true }),
  component: SettingsPage,
})

const FIELDS: Array<{ label: string; value: string }> = [
  { label: 'Site name', value: SITE.name },
  { label: 'Default title', value: SITE.defaultTitle },
  { label: 'Description', value: SITE.description },
  { label: 'URL', value: SITE.url },
  { label: 'OG image', value: SITE.ogImage },
  { label: 'Twitter', value: SITE.twitter },
  { label: 'Locale', value: SITE.locale },
]

function SettingsPage() {
  return (
    <div>
      <AdminPageHeader
        title="Settings"
        description="Site identity and SEO defaults. Editing is read-only in v1."
      />

      <div className="island-shell rounded-md p-6">
        <dl className="space-y-4">
          {FIELDS.map((field) => (
            <div
              key={field.label}
              className="flex flex-col gap-1 border-b border-line/60 pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-6"
            >
              <dt className="island-kicker">{field.label}</dt>
              <dd className="text-sm text-sea-ink sm:max-w-md sm:text-right">
                {field.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-6 rounded-md border border-red-500/30 bg-red-500/5 p-6">
        <h2 className="display-title text-lg text-red-600">Danger zone</h2>
        <p className="mt-1 text-sm text-sea-ink-soft">
          Resetting demo data will restore the seeded bookings, enquiries, and
          subscribers. Wired to a real backend endpoint before launch.
        </p>
        <button type="button" className="btn btn-warm mt-4" disabled>
          Reset demo data
        </button>
      </div>
    </div>
  )
}
