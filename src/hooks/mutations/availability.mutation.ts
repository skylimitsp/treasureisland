import { useMutation, useQueryClient } from '@tanstack/react-query'

import { withErrorHandling } from '#/lib/errors'
import { setRoomAvailability } from '#/data/rooms'
import { availabilityKeys } from '#/hooks/queries/availability.query'
import type { RoomAvailability } from '#/types'

interface AvailabilityChange {
  roomId: string
  patch: Partial<{ open: boolean; blockedNote: string }>
}

const doSetAvailability = withErrorHandling(
  async ({ roomId, patch }: AvailabilityChange): Promise<RoomAvailability> => {
    await new Promise((resolve) => setTimeout(resolve, 280))
    return setRoomAvailability(roomId, patch) // ← swap for httpClient.patch(...)
  },
  'Unable to update availability',
)

/**
 * Blocks/opens a room or edits its availability note.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useSetAvailabilityMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: doSetAvailability,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: availabilityKeys.all }),
  })
}
