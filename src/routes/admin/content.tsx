import { createFileRoute } from '@tanstack/react-router'

import { seo } from '#/lib/seo'
import { useAboutContent, useFaqsQuery } from '#/hooks/queries/content.query'
import { AdminPageHeader } from '#/components/admin/admin-page-header'

export const Route = createFileRoute('/admin/content')({
  head: () => seo({ title: 'Content', noindex: true }),
  component: ContentPage,
})

function ContentPage() {
  const about = useAboutContent()
  const faqs = useFaqsQuery()

  return (
    <div>
      <AdminPageHeader
        title="Content"
        description="About page and site copy. Editing is read-only in v1 — a block editor lands next."
      />

      {about.isPending ? (
        <p className="text-sm text-sea-ink-soft">Loading content…</p>
      ) : about.isError ? (
        <div className="island-shell rounded-md p-6 text-center">
          <p className="text-sea-ink-soft">{about.error.message}</p>
          <button
            className="btn btn-ghost mt-4"
            onClick={() => about.refetch()}
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="island-shell rounded-md p-6">
            <span className="island-kicker">{about.data.kicker}</span>
            <p className="display-title mt-2 text-2xl text-sea-ink">
              {about.data.lead}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {about.data.story.map((block, i) => (
                <p key={i} className="text-sm text-sea-ink-soft">
                  {block}
                </p>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {about.data.stats.map((stat) => (
              <div key={stat.label} className="island-shell rounded-md p-5">
                <span className="island-kicker">{stat.label}</span>
                <p className="display-title mt-2 text-2xl text-sea-ink">
                  {stat.value}
                  {stat.suffix ?? ''}
                </p>
              </div>
            ))}
          </div>

          <div className="island-shell rounded-md p-6">
            <h2 className="display-title text-lg text-sea-ink">
              Host — {about.data.host.name}
            </h2>
            <p className="mt-2 text-sm italic text-sea-ink-soft">
              “{about.data.host.quote}”
            </p>
          </div>

          <div className="island-shell rounded-md p-6">
            <h2 className="display-title text-lg text-sea-ink">FAQ entries</h2>
            <ul className="mt-3 space-y-2">
              {(faqs.data ?? []).map((faq) => (
                <li key={faq.q} className="text-sm text-sea-ink">
                  {faq.q}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
