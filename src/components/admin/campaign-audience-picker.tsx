import { useMemo, useState } from 'react'

import { useSubscribersQuery } from '#/hooks/queries/subscribers.query'

interface CampaignAudiencePickerProps {
  audience: 'all' | 'selected'
  selectedIds: Array<string>
  onChange: (next: {
    audience: 'all' | 'selected'
    selectedIds: Array<string>
  }) => void
}

// Choose everyone or a hand-picked list; only confirmed subscribers can be picked.
export function CampaignAudiencePicker({
  audience,
  selectedIds,
  onChange,
}: CampaignAudiencePickerProps) {
  const subscribers = useSubscribersQuery()
  const [query, setQuery] = useState('')

  const confirmed = useMemo(
    () => (subscribers.data ?? []).filter((s) => s.status === 'subscribed'),
    [subscribers.data],
  )
  const visible = confirmed.filter((s) =>
    s.email.toLowerCase().includes(query.trim().toLowerCase()),
  )
  const selected = new Set(selectedIds)
  const allVisibleSelected =
    visible.length > 0 && visible.every((s) => selected.has(s.id))

  function toggle(id: string) {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onChange({ audience: 'selected', selectedIds: [...next] })
  }

  function toggleVisible() {
    const next = new Set(selected)
    for (const s of visible) {
      if (allVisibleSelected) next.delete(s.id)
      else next.add(s.id)
    }
    onChange({ audience: 'selected', selectedIds: [...next] })
  }

  return (
    <fieldset>
      <legend className="text-sm font-semibold text-sea-ink">Send to</legend>
      <div className="mt-2 space-y-2">
        <label className="flex min-h-11 items-center gap-3 rounded-md border border-line px-3 text-sm text-sea-ink">
          <input
            type="radio"
            name="audience"
            checked={audience === 'all'}
            onChange={() => onChange({ audience: 'all', selectedIds })}
            className="size-4"
          />
          All confirmed subscribers
          <span className="ml-auto text-sea-ink-soft">
            {subscribers.data ? confirmed.length : '…'}
          </span>
        </label>
        <label className="flex min-h-11 items-center gap-3 rounded-md border border-line px-3 text-sm text-sea-ink">
          <input
            type="radio"
            name="audience"
            checked={audience === 'selected'}
            onChange={() => onChange({ audience: 'selected', selectedIds })}
            className="size-4"
          />
          Only the subscribers I choose
          <span className="ml-auto text-sea-ink-soft">
            {selectedIds.length} chosen
          </span>
        </label>
      </div>

      {audience === 'selected' ? (
        <div className="mt-3 rounded-md border border-line">
          <div className="flex items-center gap-2 border-b border-line p-2">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search email…"
              aria-label="Search subscribers"
              className="min-h-10 min-w-0 flex-1 rounded-md border border-line bg-[color:var(--surface)] px-3 text-sm outline-none focus:border-lagoon"
            />
            <button
              type="button"
              onClick={toggleVisible}
              disabled={visible.length === 0}
              className="btn btn-ghost px-3 py-1.5 text-sm disabled:opacity-60"
            >
              {allVisibleSelected ? 'Clear shown' : 'Select shown'}
            </button>
          </div>
          {subscribers.isPending ? (
            <p className="p-3 text-sm text-sea-ink-soft">
              Loading subscribers…
            </p>
          ) : subscribers.isError ? (
            <p className="p-3 text-sm text-destructive">
              {subscribers.error.message}
            </p>
          ) : visible.length === 0 ? (
            <p className="p-3 text-sm text-sea-ink-soft">
              {confirmed.length === 0
                ? 'No confirmed subscribers yet.'
                : 'No subscribers match your search.'}
            </p>
          ) : (
            <ul className="max-h-64 divide-y divide-line overflow-y-auto">
              {visible.map((s) => (
                <li key={s.id}>
                  <label className="flex min-h-11 cursor-pointer items-center gap-3 px-3 text-sm text-sea-ink hover:bg-black/5">
                    <input
                      type="checkbox"
                      checked={selected.has(s.id)}
                      onChange={() => toggle(s.id)}
                      aria-label={s.email}
                      className="size-4"
                    />
                    <span className="truncate">{s.email}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
      <p className="mt-2 text-xs text-sea-ink-soft">
        Pending (unconfirmed) and unsubscribed addresses never receive
        campaigns.
      </p>
    </fieldset>
  )
}
