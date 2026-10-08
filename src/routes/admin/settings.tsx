import { createFileRoute, redirect } from '@tanstack/react-router'

import { seo } from '#/lib/seo'
import { hasRole } from '#/lib/auth'
import { SITE } from '#/constants/site'
import { AdminPageHeader } from '#/components/admin/admin-page-header'
import { BookingSettingsForm } from '#/components/admin/booking-settings-form'

export const Route = createFileRoute('/admin/settings')({
  beforeLoad: () => {
    if (typeof window === 'undefined') return
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
  { label: 'Twitter', value: SITE.twitter ?? 'Not set' },
  { label: 'Locale', value: SITE.locale },
]

function SettingsPage() {
  return (
    <div>
      <AdminPageHeader
        title="Settings"
        description="Booking rules for the online request form, plus the site's identity."
      />

      <BookingSettingsForm />

      <div className="island-shell mt-6 rounded-md p-6">
        <h2 className="display-title text-lg text-sea-ink">Site identity</h2>
        <p className="mt-1 mb-4 text-sm text-sea-ink-soft">
          Read-only for now; changed by your developer.
        </p>
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
    </div>
  )
}
