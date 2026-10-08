import { useMutation, useQueryClient } from '@tanstack/react-query'

import { withErrorHandling } from '#/lib/errors'
import { api } from '#/lib/api-client'
import { bookingKeys } from '#/hooks/queries/bookings.query'
import { dashboardKeys } from '#/hooks/queries/dashboard.query'
import { roomKeys } from '#/hooks/queries/rooms.query'
import type { Booking, BookingStatus } from '#/types'

interface StatusChange {
  id: string
  status: BookingStatus
}

const doUpdateStatus = withErrorHandling(
  async ({ id, status }: StatusChange): Promise<Booking> => {
    return api.post<Booking>(`/admin/bookings/${id}/status`, { status })
  },
  'Unable to update this booking',
)

/**
 * Changes a reservation's status (confirm, check-in, cancel).
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useUpdateBookingStatusMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: doUpdateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all })
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
      queryClient.invalidateQueries({ queryKey: roomKeys.all })
    },
  })
}
