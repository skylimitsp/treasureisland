import { useEffect, useState } from 'react'

import { useSettingsQuery } from '#/hooks/queries/settings.query'
import { useSaveSettingsMutation } from '#/hooks/mutations/settings.mutation'
import type { AdminSettings } from '#/types'

type Draft = Pick<
  AdminSettings,
  'currency' | 'taxRatePercent' | 'pendingHoldHours'
>

const fieldClass =
  'mt-1.5 min-h-11 w-full rounded-md border border-line bg-[color:var(--surface)] px-3 py-2 text-sea-ink outline-none focus:border-lagoon'

// Rules the booking API applies to every online request and quote.
export function BookingSettingsForm() {
  const settings = useSettingsQuery()
  const save = useSaveSettingsMutation()
  const [draft, setDraft] = useState<Draft | null>(null)

  useEffect(() => {
    if (settings.data && !draft) {
      const { currency, taxRatePercent, pendingHoldHours } = settings.data
      setDraft({ currency, taxRatePercent, pendingHoldHours })
    }
  }, [settings.data, draft])

  if (settings.isError) {
    return <p className="text-sm text-destructive">{settings.error.message}</p>
  }
  if (!draft)
    return <p className="text-sm text-sea-ink-soft">Loading settings…</p>

  const update = <TKey extends keyof Draft>(key: TKey, value: Draft[TKey]) => {
    save.reset()
    setDraft({ ...draft, [key]: value })
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        save.mutate(draft)
      }}
      className="island-shell rounded-md p-6"
    >
      <h2 className="display-title text-lg text-sea-ink">Booking rules</h2>
      <p className="mt-1 text-sm text-sea-ink-soft">
        Applied to online booking requests, quotes and confirmation emails.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <label className="text-sm font-semibold text-sea-ink">
          Currency
          <select
            value={draft.currency}
            onChange={(e) =>
              update('currency', e.target.value as Draft['currency'])
            }
            className={fieldClass}
          >
            <option value="USD">USD ($)</option>
            <option value="GHS">GHS (GH₵)</option>
          </select>
        </label>
        <label className="text-sm font-semibold text-sea-ink">
          Tax &amp; levies (%)
          <input
            type="number"
            min={0}
            max={50}
            step={0.5}
            value={draft.taxRatePercent}
            onChange={(e) => update('taxRatePercent', Number(e.target.value))}
            className={fieldClass}
          />
        </label>
        <label className="text-sm font-semibold text-sea-ink">
          Hold unconfirmed requests (hours)
          <input
            type="number"
            min={1}
            max={336}
            value={draft.pendingHoldHours}
            onChange={(e) =>
              update('pendingHoldHours', Math.round(Number(e.target.value)))
            }
            className={fieldClass}
          />
        </label>
      </div>
      <p className="mt-3 text-xs text-sea-ink-soft">
        Currency applies to rooms added from now on; existing room prices keep
        their currency.
      </p>
      <div className="mt-5 flex items-center gap-3">
        <button
          type="submit"
          disabled={save.isPending}
          className="btn btn-primary disabled:opacity-60"
        >
          {save.isPending ? 'Saving…' : 'Save changes'}
        </button>
        <p aria-live="polite" className="text-sm">
          {save.isSuccess ? (
            <span className="text-palm">Saved.</span>
          ) : save.isError ? (
            <span className="text-destructive">{save.error.message}</span>
          ) : null}
        </p>
      </div>
    </form>
  )
}
