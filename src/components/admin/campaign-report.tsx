import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Copy, Trash2 } from 'lucide-react'

import { formatStayDate } from '#/lib/format'
import {
  useDeleteCampaignMutation,
  useDuplicateCampaignMutation,
} from '#/hooks/mutations/campaigns.mutation'
import { CampaignPreview } from '#/components/admin/campaign-preview'
import { ConfirmDialog } from '#/components/admin/confirm-dialog'
import { StatusBadge } from '#/components/admin/status-badge'
import type { CampaignDetail } from '#/types'

// Read-only record of a sent (or sending/failed) campaign and who it reached.
export function CampaignReport({ campaign }: { campaign: CampaignDetail }) {
  const navigate = useNavigate()
  const duplicate = useDuplicateCampaignMutation()
  const remove = useDeleteCampaignMutation()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const sending = campaign.status === 'sending'
  const done = campaign.sentCount + campaign.failedCount
  const pct = campaign.recipientCount
    ? Math.round((done / campaign.recipientCount) * 100)
    : 0

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="space-y-6">
        <section className="island-shell rounded-md p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <StatusBadge status={campaign.status} />
            <div className="flex gap-2">
              <button
                type="button"
                disabled={duplicate.isPending}
                onClick={() =>
                  duplicate.mutate(campaign.id, {
                    onSuccess: (copy) =>
                      void navigate({
                        to: '/admin/campaigns/$campaignId',
                        params: { campaignId: copy.id },
                      }),
                  })
                }
                className="btn btn-ghost px-3 py-1.5"
              >
                <Copy size={15} aria-hidden />
                {duplicate.isPending ? 'Copying…' : 'Duplicate as new draft'}
              </button>
              {sending ? null : (
                <button
                  type="button"
                  aria-label="Delete campaign"
                  onClick={() => setConfirmDelete(true)}
                  className="flex size-9 items-center justify-center rounded-full text-sea-ink-soft hover:bg-red-500/10 hover:text-red-600"
                >
                  <Trash2 size={16} aria-hidden />
                </button>
              )}
            </div>
          </div>
          <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
            {[
              ['Recipients', campaign.recipientCount],
              ['Delivered', campaign.sentCount],
              ['Failed', campaign.failedCount],
            ].map(([label, value]) => (
              <div key={label} className="rounded-md border border-line p-3">
                <dt className="island-kicker">{label}</dt>
                <dd className="display-title mt-1 text-2xl text-sea-ink">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
          {sending ? (
            <div className="mt-4" aria-live="polite">
              <div
                className="h-2 overflow-hidden rounded-full bg-black/10"
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Sending progress"
              >
                <div
                  className="h-full bg-lagoon transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-sea-ink-soft">Sending… {pct}%</p>
            </div>
          ) : null}
          <p className="mt-4 text-sm text-sea-ink-soft">
            {campaign.sentAt
              ? `Sent ${formatStayDate(campaign.sentAt)}${campaign.sentByName ? ` by ${campaign.sentByName}` : ''}`
              : null}
            {campaign.audience === 'all'
              ? ' · to all confirmed subscribers'
              : ' · to chosen subscribers'}
          </p>
          {duplicate.isError ? (
            <p className="mt-2 text-sm text-destructive">
              {duplicate.error.message}
            </p>
          ) : null}
        </section>

        <section className="island-shell rounded-md p-5">
          <h2 className="display-title text-lg text-sea-ink">Recipients</h2>
          <ul className="mt-3 max-h-96 divide-y divide-line overflow-y-auto text-sm">
            {campaign.recipients.map((r) => (
              <li
                key={r.subscriberId}
                className="flex items-center justify-between gap-3 py-2"
              >
                <span className="truncate text-sea-ink">{r.email}</span>
                <span className="shrink-0" title={r.error ?? undefined}>
                  <StatusBadge
                    status={r.status}
                    tone={
                      r.status === 'sent'
                        ? 'positive'
                        : r.status === 'failed'
                          ? 'danger'
                          : 'neutral'
                    }
                  />
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="lg:sticky lg:top-20 lg:self-start">
        <p className="island-kicker mb-2">What was sent</p>
        <CampaignPreview draft={campaign} />
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this campaign?"
        message={
          remove.isError
            ? remove.error.message
            : 'Its record and recipient list will be removed. Emails already sent are not affected.'
        }
        confirmLabel="Delete"
        destructive
        busy={remove.isPending}
        onConfirm={() =>
          remove.mutate(campaign.id, {
            onSuccess: () => void navigate({ to: '/admin/campaigns' }),
          })
        }
        onCancel={() => {
          remove.reset()
          setConfirmDelete(false)
        }}
      />
    </div>
  )
}
