import { queryOptions, useQuery } from '@tanstack/react-query'

import { withErrorHandling } from '#/lib/errors'
import { getEventEnquiries } from '#/data/events'
import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from '#/constants'
import type { EventEnquiry } from '#/types'

export const enquiryKeys = {
  all: ['enquiries'] as const,
  list: () => ['enquiries', 'list'] as const,
}

const fetchEnquiries = withErrorHandling(
  async (): Promise<Array<EventEnquiry>> => {
    await new Promise((resolve) => setTimeout(resolve, 220))
    return getEventEnquiries() // ← swap for httpClient.get('/admin/enquiries')
  },
  'Failed to load enquiries',
)

export const enquiriesQueryOptions = () =>
  queryOptions({
    queryKey: enquiryKeys.list(),
    queryFn: fetchEnquiries,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  })

/**
 * Lists event enquiries for the admin pipeline.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useEnquiriesQuery = () => useQuery(enquiriesQueryOptions())
