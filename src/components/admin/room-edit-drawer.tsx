import { useState } from 'react'

import { useUpdateRoomMutation } from '#/hooks/mutations/rooms.mutation'
import { EntityDrawer } from '#/components/admin/entity-drawer'
import type { Room } from '#/types'

interface RoomEditDrawerProps {
  room: Room | null
  onClose: () => void
}

// Edits a room's nightly rate and capacity (mock write).
export function RoomEditDrawer({ room, onClose }: RoomEditDrawerProps) {
  const mutation = useUpdateRoomMutation()
  const [price, setPrice] = useState(room?.pricePerNight ?? 0)
  const [maxGuests, setMaxGuests] = useState(room?.maxGuests ?? 1)

  if (!room) return null

  const save = () =>
    mutation.mutate(
      { id: room.id, patch: { pricePerNight: price, maxGuests } },
      { onSuccess: onClose },
    )

  return (
    <EntityDrawer
      open
      title={room.name}
      description="Edit rate and capacity"
      onClose={onClose}
    >
      <div className="space-y-5">
        <label className="block">
          <span className="text-sm font-medium text-sea-ink">
            Price per night (USD)
          </span>
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-line bg-[color:var(--surface)] px-3 py-2 text-sm text-sea-ink outline-none focus:border-lagoon"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-sea-ink">Max guests</span>
          <input
            type="number"
            min={1}
            value={maxGuests}
            onChange={(e) => setMaxGuests(Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-line bg-[color:var(--surface)] px-3 py-2 text-sm text-sea-ink outline-none focus:border-lagoon"
          />
        </label>

        {mutation.isError ? (
          <p className="text-sm text-red-600">{mutation.error.message}</p>
        ) : null}

        <div className="flex justify-end gap-3">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={mutation.isPending}
            onClick={save}
          >
            {mutation.isPending ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </EntityDrawer>
  )
}
