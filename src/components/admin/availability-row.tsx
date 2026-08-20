import { useState } from 'react'

import { formatPrice } from '#/lib/format'
import { useSetAvailabilityMutation } from '#/hooks/mutations/availability.mutation'
import { StatusBadge } from '#/components/admin/status-badge'
import type { RoomAvailability } from '#/types'

// One room's availability controls: open/closed toggle + blocked-nights note.
export function AvailabilityRow({ item }: { item: RoomAvailability }) {
  const mutation = useSetAvailabilityMutation()
  const [note, setNote] = useState(item.blockedNote)

  const toggleOpen = () =>
    mutation.mutate({ roomId: item.roomId, patch: { open: !item.open } })

  const saveNote = () =>
    mutation.mutate({ roomId: item.roomId, patch: { blockedNote: note } })

  return (
    <div className="island-shell flex flex-col gap-4 rounded-md p-5 md:flex-row md:items-center md:justify-between">
      <div className="min-w-[180px]">
        <p className="font-semibold text-sea-ink">{item.roomName}</p>
        <p className="text-sm text-sea-ink-soft">
          {formatPrice(item.pricePerNight)} / night
        </p>
      </div>

      <div className="flex items-center gap-3">
        <StatusBadge
          status={item.open ? 'open' : 'closed'}
          tone={item.open ? 'positive' : 'danger'}
        />
        <button
          type="button"
          className="btn btn-ghost px-3 py-1.5"
          disabled={mutation.isPending}
          onClick={toggleOpen}
        >
          {item.open ? 'Block room' : 'Open room'}
        </button>
      </div>

      <div className="flex flex-1 items-center gap-2 md:max-w-sm">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Blocked nights / note"
          className="w-full rounded-md border border-line bg-[color:var(--surface)] px-3 py-2 text-sm text-sea-ink outline-none focus:border-lagoon"
        />
        <button
          type="button"
          className="btn btn-ghost px-3 py-1.5"
          disabled={mutation.isPending || note === item.blockedNote}
          onClick={saveNote}
        >
          Save
        </button>
      </div>
    </div>
  )
}
