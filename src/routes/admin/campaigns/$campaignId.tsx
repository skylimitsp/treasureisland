import { Link, createFileRoute, redirect } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { seo } from '#/lib/seo'
import { hasRole } from '#/lib/auth'
import { useCampaignQuery } from '#/hooks/queries/campaigns.query'
import { AdminPageHeader } from '#/components/admin/admin-page-header'
import { CampaignEditor } from '#/components/admin/campaign-editor'
import { CampaignReport } from '#/components/admin/campaign-report'
import { EmailStatusBanner } from '#/components/admin/email-status-banner'

export const Route = createFileRoute('/admin/campaigns/$campaignId')({
  beforeLoad: () => {
    if (typeof window === 'undefined') return
    if (!hasRole('admin')) throw redirect({ to: '/admin' })
  },
  head: () => seo({ title: 'Campaign', noindex: true }),
  component: CampaignPage,
})

function CampaignPage() {
  const { campaignId } = Route.useParams()
  const campaign = useCampaignQuery(campaignId)
  const c = campaign.data

  return (
    <div>
      <Link
        to="/admin/campaigns"
        className="mb-3 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-lagoon-deep"
      >
        <ArrowLeft size={16} aria-hidden /> All campaigns
      </Link>
      <AdminPageHeader
        title={c ? c.subject || 'Untitled draft' : 'Campaign'}
        description={
          c?.status === 'draft'
            ? 'Draft: write your email, check the preview, send yourself a test, then send.'
            : 'A record of this campaign and who received it.'
        }
      />
      {c?.status === 'draft' ? <EmailStatusBanner /> : null}

      {campaign.isPending ? (
        <p className="text-sm text-sea-ink-soft">Loading campaign…</p>
      ) : campaign.isError ? (
        <div className="island-shell rounded-md p-6 text-center">
          <p className="text-sea-ink-soft">{campaign.error.message}</p>
          <Link to="/admin/campaigns" className="btn btn-ghost mt-4">
            Back to campaigns
          </Link>
        </div>
      ) : campaign.data.status === 'draft' ? (
        <CampaignEditor key={campaign.data.id} campaign={campaign.data} />
      ) : (
        <CampaignReport campaign={campaign.data} />
      )}
    </div>
  )
}
