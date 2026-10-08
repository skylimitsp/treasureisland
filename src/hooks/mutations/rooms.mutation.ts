import { useMutation, useQueryClient } from '@tanstack/react-query'

import { withErrorHandling } from '#/lib/errors'
import { updateRoom } from '#/data/rooms'
import { api } from '#/lib/api-client'
import { roomKeys } from '#/hooks/queries/rooms.query'
import { availabilityKeys } from '#/hooks/queries/availability.query'
import type { Booking, BookingInput, Room } from '#/types'

// Sends a booking request (pending until staff confirm); the key stops double submits.
const doCreateBooking = withErrorHandling(
  async (input: BookingInput): Promise<Booking> =>
    api.post<Booking>('/bookings', input, {
      'idempotency-key': crypto.randomUUID(),
    }),
  'Unable to complete your booking',
)

interface RoomEdit {
  id: string
  patch: Partial<Pick<Room, 'pricePerNight' | 'maxGuests'>>
}

const doUpdateRoom = withErrorHandling(
  async ({ id, patch }: RoomEdit): Promise<Room> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return updateRoom(id, patch) // ← swap for httpClient.patch(`/rooms/${id}`)
  },
  'Unable to update this room',
)

/**
 * Books a room for the current guest.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useCreateBookingMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: doCreateBooking,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: roomKeys.all }),
  })
}

/**
 * Updates a room's price/capacity from the admin Rooms module.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useUpdateRoomMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: doUpdateRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomKeys.all })
      queryClient.invalidateQueries({ queryKey: availabilityKeys.all })
    },
  })
}
