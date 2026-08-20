import { queryOptions, useQuery } from '@tanstack/react-query'

import { withErrorHandling } from '#/lib/errors'
import { getUsers } from '#/data/users'
import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from '#/constants'
import type { User } from '#/types'

export const userKeys = {
  all: ['users'] as const,
  list: () => ['users', 'list'] as const,
}

const fetchUsers = withErrorHandling(async (): Promise<Array<User>> => {
  await new Promise((resolve) => setTimeout(resolve, 180))
  return getUsers() // ← swap for httpClient.get('/admin/users')
}, 'Failed to load staff')

export const usersQueryOptions = () =>
  queryOptions({
    queryKey: userKeys.list(),
    queryFn: fetchUsers,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  })

/**
 * Lists staff users for the admin console.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useUsersQuery = () => useQuery(usersQueryOptions())
