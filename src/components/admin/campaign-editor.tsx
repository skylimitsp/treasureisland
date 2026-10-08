import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Save, Send, Trash2 } from 'lucide-react'

import { isSafeUrl } from '#/lib/campaign-format'
import {
  useDeleteCampaignMutation,
  useSaveCampaignMutation,
  useSendCampaignMutation,
  useTestCampaignMutation,
} from '#/hooks/mutations/campaigns.mutation'
import { useSubscribersQuery } from '#/hooks/queries/subscribers.query'
import { CampaignAudiencePicker } from '#/components/admin/campaign-audience-picker'
import { CampaignPreview } from '#/components/admin/campaign-preview'
import { ConfirmDialog } from '#/components/admin/confirm-dialog'
import type { Campaign, CampaignDraft } from '#/types'

const fieldClass =
  'mt-1.5 min-h-11 w-full rounded-md border border-line bg-[color:var(--surface)] px-3 py-2 text-sea-ink outline-none focus:border-lagoon'

const pick = (c: Campaign): CampaignDraft => ({
  subject: c.subject,
  preheader: c.preheader,
  body: c.body,
  ctaLabel: c.ctaLabel,
  ctaUrl: c.ctaUrl,
  audience: c.audience,
  selectedIds: c.selectedIds,
})

// Draft editor: write, preview, save, send a test to yourself, then send.
export function CampaignEditor({ campaign }: { campaign: Campaign }) {
  const navigate = useNavigate()
  const [draft, setDraft] = useState<CampaignDraft>(() => pick(campaign))
  const [dirty, setDirty] = useState(false)
  const [confirm, setConfirm] = useState<'send' | 'delete' | null>(null)
  const save = useSaveCampaignMutation()
  const test = useTestCampaignMutation()
  const send = useSendCampaignMutation()
  const remove = useDeleteCampaignMutation()
  const subscribers = useSubscribersQuery()

  useEffect(() => {
    if (!dirty) setDraft(pick(campaign))
  }, [campaign, dirty])

  const confirmedCount = (subscribers.data ?? []).filter(
    (s) => s.status === 'subscribed',
  ).length
  const confirmedIds = new Set(
    (subscribers.data ?? [])
      .filter((s) => s.status === 'subscribed')
      .map((s) => s.id),
  )
  const recipients =
    draft.audience === 'all'
      ? confirmedCount
      : (draft.selectedIds ?? []).filter((id) => confirmedIds.has(id)).length

  const ctaProblem =
    Boolean(draft.ctaLabel) !== Boolean(draft.ctaUrl)
      ? 'Fill in both the button text and its link, or leave both empty.'
      : draft.ctaUrl && !isSafeUrl(draft.ctaUrl)
        ? 'Use a full link starting with https://'
        : null
  const sendProblem = !draft.subject?.trim()
    ? 'Add a subject.'
    : !draft.body?.trim()
      ? 'Add a message.'
      : ctaProblem
        ? ctaProblem
        : recipients === 0
          ? 'Choose at least one confirmed subscriber.'
          : null

  function update(patch: CampaignDraft) {
    setDraft((d) => ({ ...d, ...patch }))
    setDirty(true)
    save.reset()
    test.reset()
    send.reset()
  }

  // Normalises empty optional fields to null so the API stores "no button".
  const payload = (): CampaignDraft => ({
    ...draft,
    ctaLabel: draft.ctaLabel?.trim() || null,
    ctaUrl: draft.ctaUrl?.trim() || null,
  })

  async function saveNow() {
    await save.mutateAsync({ id: campaign.id, draft: payload() })
    setDirty(false)
  }

  async function sendTest() {
    if (dirty) await saveNow()
    test.mutate(campaign.id)
  }

  async function sendNow() {
    if (dirty) await saveNow()
    send.mutate(campaign.id, { onSuccess: () => setConfirm(null) })
  }

  const busy = save.isPending || test.isPending || send.isPending
  const error = save.error ?? test.error ?? send.error

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <form
        className="island-shell space-y-4 rounded-md p-5"
        onSubmit={(e) => {
          e.preventDefault()
          void saveNow().catch(() => null)
        }}
      >
        <label className="block text-sm font-semibold text-sea-ink">
          Subject *
          <input
            value={draft.subject ?? ''}
            onChange={(e) => update({ subject: e.target.value })}
            maxLength={150}
            placeholder="e.g. Easter weekend on the island — 20% off"
            className={fieldClass}
          />
        </label>
        <label className="block text-sm font-semibold text-sea-ink">
          Preview text{' '}
          <span className="font-normal text-sea-ink-soft">(optional)</span>
          <input
            value={draft.preheader ?? ''}
            onChange={(e) => update({ preheader: e.target.value })}
            maxLength={150}
            placeholder="Shown after the subject in most inboxes"
            className={fieldClass}
          />
        </label>
        <label className="block text-sm font-semibold text-sea-ink">
          Message *
          <textarea
            rows={10}
            value={draft.body ?? ''}
            onChange={(e) => update({ body: e.target.value })}
            maxLength={20000}
            placeholder={
              'Write your message.\n\nLeave a blank line between paragraphs.'
            }
            className={`${fieldClass} min-h-48`}
          />
          <span className="mt-1 block text-xs font-normal text-sea-ink-soft">
            Blank line = new paragraph · **bold** · [link text](https://…) · web
            addresses become links automatically
          </span>
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-sea-ink">
            Button text{' '}
            <span className="font-normal text-sea-ink-soft">(optional)</span>
            <input
              value={draft.ctaLabel ?? ''}
              onChange={(e) => update({ ctaLabel: e.target.value })}
              maxLength={40}
              placeholder="e.g. Book your stay"
              className={fieldClass}
            />
          </label>
          <label className="block text-sm font-semibold text-sea-ink">
            Button link
            <input
              type="url"
              value={draft.ctaUrl ?? ''}
              onChange={(e) => update({ ctaUrl: e.target.value })}
              placeholder="https://treasureislandghana.com/rooms"
              className={fieldClass}
            />
          </label>
        </div>
        {ctaProblem ? (
          <p className="text-sm text-destructive">{ctaProblem}</p>
        ) : null}

        <CampaignAudiencePicker
          audience={draft.audience ?? 'all'}
          selectedIds={draft.selectedIds ?? []}
          onChange={(next) => update(next)}
        />

        <p aria-live="polite" className="min-h-5 text-sm">
          {error ? (
            <span className="text-destructive">{error.message}</span>
          ) : test.isSuccess ? (
            <span className="text-palm">Test sent to {test.data.to}.</span>
          ) : save.isSuccess && !dirty ? (
            <span className="text-palm">Draft saved.</span>
          ) : dirty ? (
            <span className="text-sea-ink-soft">Unsaved changes</span>
          ) : null}
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={busy || !dirty}
            className="btn btn-ghost disabled:opacity-60"
          >
            <Save size={16} aria-hidden />
            {save.isPending ? 'Saving…' : 'Save draft'}
          </button>
          <button
            type="button"
            disabled={
              busy ||
              Boolean(
                sendProblem &&
                sendProblem !== 'Choose at least one confirmed subscriber.',
              )
            }
            onClick={() => void sendTest().catch(() => null)}
            className="btn btn-ghost disabled:opacity-60"
          >
            {test.isPending ? 'Sending test…' : 'Send test to me'}
          </button>
          <button
            type="button"
            disabled={busy || Boolean(sendProblem)}
            onClick={() => setConfirm('send')}
            className="btn btn-primary disabled:opacity-60"
            title={sendProblem ?? undefined}
          >
            <Send size={16} aria-hidden />
            Send to {recipients}{' '}
            {recipients === 1 ? 'subscriber' : 'subscribers'}
          </button>
          <button
            type="button"
            onClick={() => setConfirm('delete')}
            aria-label="Delete draft"
            className="ml-auto flex size-11 items-center justify-center rounded-full text-sea-ink-soft hover:bg-red-500/10 hover:text-red-600"
          >
            <Trash2 size={18} aria-hidden />
          </button>
        </div>
        {sendProblem ? (
          <p className="text-xs text-sea-ink-soft">
            Before sending: {sendProblem}
          </p>
        ) : null}
      </form>

      <div className="lg:sticky lg:top-20 lg:self-start">
        <p className="island-kicker mb-2">Preview</p>
        <CampaignPreview draft={draft} />
      </div>

      <ConfirmDialog
        open={confirm === 'send'}
        title={`Send to ${recipients} ${recipients === 1 ? 'subscriber' : 'subscribers'}?`}
        message={
          send.isError
            ? send.error.message
            : `“${draft.subject ?? ''}” will be emailed now. This can't be undone.`
        }
        confirmLabel="Send now"
        busy={send.isPending || save.isPending}
        onConfirm={() => void sendNow().catch(() => null)}
        onCancel={() => {
          send.reset()
          setConfirm(null)
        }}
      />
      <ConfirmDialog
        open={confirm === 'delete'}
        title="Delete this draft?"
        message={
          remove.isError
            ? remove.error.message
            : 'The draft will be removed permanently.'
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
          setConfirm(null)
        }}
      />
    </div>
  )
}
