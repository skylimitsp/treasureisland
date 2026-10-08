import { queryOptions, useQuery } from '@tanstack/react-query'

import { withErrorHandling } from '#/lib/errors'
import { api } from '#/lib/api-client'
import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from '#/constants'
import type { NewsletterSignup } from '#/types'

export const subscriberKeys = {
  all: ['subscribers'] as const,
  list: () => ['subscribers', 'list'] as const,
}

const fetchSubscribers = withErrorHandling(
  async (): Promise<Array<NewsletterSignup>> => {
    return api.get<Array<NewsletterSignup>>('/admin/subscribers?limit=100')
  },
  'Failed to load subscribers',
)

export const subscribersQueryOptions = () =>
  queryOptions({
    queryKey: subscriberKeys.list(),
    queryFn: fetchSubscribers,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  })

/**
 * Lists newsletter subscribers for the admin console.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useSubscribersQuery = () => useQuery(subscribersQueryOptions())
