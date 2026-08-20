import { queryOptions, useQuery } from '@tanstack/react-query'

import { withErrorHandling } from '#/lib/errors'
import { getBookings } from '#/data/rooms'
import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from '#/constants'
import type { Booking } from '#/types'

export const bookingKeys = {
  all: ['bookings'] as const,
  list: () => ['bookings', 'list'] as const,
}

const fetchBookings = withErrorHandling(async (): Promise<Array<Booking>> => {
  await new Promise((resolve) => setTimeout(resolve, 220))
  return getBookings() // ← swap for httpClient.get('/admin/bookings')
}, 'Failed to load bookings')

export const bookingsQueryOptions = () =>
  queryOptions({
    queryKey: bookingKeys.list(),
    queryFn: fetchBookings,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  })

/**
 * Lists every reservation for the admin console.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useBookingsQuery = () => useQuery(bookingsQueryOptions())
