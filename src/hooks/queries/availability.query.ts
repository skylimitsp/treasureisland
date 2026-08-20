import { queryOptions, useQuery } from '@tanstack/react-query'

import { withErrorHandling } from '#/lib/errors'
import { getRoomAvailability } from '#/data/rooms'
import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from '#/constants'
import type { RoomAvailability } from '#/types'

export const availabilityKeys = {
  all: ['availability'] as const,
  list: () => ['availability', 'list'] as const,
}

const fetchAvailability = withErrorHandling(
  async (): Promise<Array<RoomAvailability>> => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return getRoomAvailability() // ← swap for httpClient.get('/admin/availability')
  },
  'Failed to load availability',
)

export const availabilityQueryOptions = () =>
  queryOptions({
    queryKey: availabilityKeys.list(),
    queryFn: fetchAvailability,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  })

/**
 * Lists per-room availability and rates for the admin console.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useRoomAvailabilityQuery = () =>
  useQuery(availabilityQueryOptions())
