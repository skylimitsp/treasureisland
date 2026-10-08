import { queryOptions, useQuery } from '@tanstack/react-query'

import { withErrorHandling } from '#/lib/errors'
import { api } from '#/lib/api-client'
import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from '#/constants'
import type { AdminSettings } from '#/types'

export const settingsKeys = {
  all: ['settings'] as const,
}

const fetchSettings = withErrorHandling(
  async (): Promise<AdminSettings> => api.get('/admin/settings'),
  'Failed to load settings',
)

export const settingsQueryOptions = () =>
  queryOptions({
    queryKey: settingsKeys.all,
    queryFn: fetchSettings,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  })

/**
 * Loads the editable site settings (admin only).
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useSettingsQuery = () => useQuery(settingsQueryOptions())
