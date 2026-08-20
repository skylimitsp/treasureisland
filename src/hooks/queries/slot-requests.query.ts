import { queryOptions, useQuery } from '@tanstack/react-query'

import { withErrorHandling } from '#/lib/errors'
import { getSlotRequests } from '#/data/amenities'
import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from '#/constants'
import type { SlotRequest } from '#/types'

export const slotRequestKeys = {
  all: ['slot-requests'] as const,
  list: () => ['slot-requests', 'list'] as const,
}

const fetchSlotRequests = withErrorHandling(
  async (): Promise<Array<SlotRequest>> => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return getSlotRequests() // ← swap for httpClient.get('/admin/slot-requests')
  },
  'Failed to load slot requests',
)

export const slotRequestsQueryOptions = () =>
  queryOptions({
    queryKey: slotRequestKeys.list(),
    queryFn: fetchSlotRequests,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  })

/**
 * Lists amenity slot requests for the admin console.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useSlotRequestsQuery = () => useQuery(slotRequestsQueryOptions())
