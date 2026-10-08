import { campaignBodyHtml } from '#/lib/campaign-format'
import type { CampaignDraft } from '#/types'

// Approximates the sent email; the body HTML is escaped by `campaignBodyHtml`.
export function CampaignPreview({ draft }: { draft: CampaignDraft }) {
  const hasButton = Boolean(draft.ctaLabel && draft.ctaUrl)
  return (
    <div className="overflow-hidden rounded-md border border-line bg-white">
      <div className="border-b border-line bg-[#f4f8f7] px-4 py-3 text-xs text-sea-ink-soft">
        <p className="truncate">
          <span className="font-semibold text-sea-ink">
            {draft.subject || 'Subject line'}
          </span>
          {draft.preheader ? ` — ${draft.preheader}` : ''}
        </p>
        <p>From: Treasure Island Ada</p>
      </div>
      <div className="px-6 py-6">
        <p className="text-[11px] tracking-[0.08em] text-lagoon-deep uppercase">
          Treasure Island Ada
        </p>
        <h3 className="mt-2 text-xl font-bold text-[#173a40]">
          {draft.subject || 'Your subject appears here'}
        </h3>
        <div
          className="mt-4"
          dangerouslySetInnerHTML={{
            __html:
              campaignBodyHtml(draft.body ?? '') ||
              '<p style="color:#4f6b70">Your message appears here.</p>',
          }}
        />
        {hasButton ? (
          <span className="mt-2 inline-block rounded-md bg-[#2f7f86] px-5 py-3 text-sm font-bold text-white">
            {draft.ctaLabel}
          </span>
        ) : null}
        <p className="mt-8 border-t border-line pt-4 text-[11px] leading-relaxed text-sea-ink-soft">
          Treasure Island Ada · Ada Foah, Volta Region, Ghana · (+233) 055 270
          1946
          <br />
          You are receiving this because you subscribed.{' '}
          <span className="underline">Unsubscribe</span>
        </p>
      </div>
    </div>
  )
}
