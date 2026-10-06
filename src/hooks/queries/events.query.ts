import { queryOptions, useQuery } from '@tanstack/react-query'

import { withErrorHandling } from '#/lib/errors'
import { getEventTeasers, getEventTypes } from '#/data/events'
import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from '#/constants'
import type { EventTeaser, EventType } from '#/types'

export const eventKeys = {
  all: ['events'] as const,
  teasers: () => ['events', 'teasers'] as const,
  types: () => ['events', 'types'] as const,
  enquiries: () => ['events', 'enquiries'] as const,
}

const fetchTeasers = withErrorHandling(
  async (): Promise<Array<EventTeaser>> => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return getEventTeasers() // ← swap for httpClient.get('/event-types')
  },
  'Failed to load events',
)

const fetchTypes = withErrorHandling(async (): Promise<Array<EventType>> => {
  await new Promise((resolve) => setTimeout(resolve, 250))
  return getEventTypes() // ← swap for httpClient.get('/events')
}, 'Failed to load event types')

export const eventTeasersQueryOptions = () =>
  queryOptions({
    queryKey: eventKeys.teasers(),
    queryFn: fetchTeasers,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  })

export const eventTypesQueryOptions = () =>
  queryOptions({
    queryKey: eventKeys.types(),
    queryFn: fetchTypes,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  })

/**
 * Lists the celebration types teased on the landing page.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useEventTeasersQuery = () => useQuery(eventTeasersQueryOptions())

/**
 * Lists the celebration types shown on the events page.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useEventTypesQuery = () => useQuery(eventTypesQueryOptions())
