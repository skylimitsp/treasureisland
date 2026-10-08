import { queryOptions, useQuery } from '@tanstack/react-query'

import { withErrorHandling } from '#/lib/errors'
import { api } from '#/lib/api-client'
import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from '#/constants'
import type { StaffMember } from '#/types'

export const userKeys = {
  all: ['users'] as const,
  list: () => ['users', 'list'] as const,
}

const fetchUsers = withErrorHandling(
  async (): Promise<Array<StaffMember>> => api.get('/admin/users'),
  'Failed to load staff',
)

export const usersQueryOptions = () =>
  queryOptions({
    queryKey: userKeys.list(),
    queryFn: fetchUsers,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  })

/**
 * Lists staff accounts (admin only).
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useUsersQuery = () => useQuery(usersQueryOptions())
