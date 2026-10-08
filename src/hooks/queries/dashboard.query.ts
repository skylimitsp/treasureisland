import { queryOptions, useQuery } from '@tanstack/react-query'

import { withErrorHandling } from '#/lib/errors'
import { api } from '#/lib/api-client'
import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from '#/constants'
import type { ActivityItem, DashboardMetrics } from '#/types'

export const dashboardKeys = {
  all: ['dashboard'] as const,
  metrics: () => ['dashboard', 'metrics'] as const,
  activity: () => ['dashboard', 'activity'] as const,
}

const fetchMetrics = withErrorHandling(async (): Promise<DashboardMetrics> => {
  return api.get<DashboardMetrics>('/admin/metrics')
}, 'Failed to load dashboard metrics')

const fetchActivity = withErrorHandling(
  async (): Promise<Array<ActivityItem>> => {
    return api.get<Array<ActivityItem>>('/admin/activity?limit=10')
  },
  'Failed to load recent activity',
)

export const dashboardMetricsQueryOptions = () =>
  queryOptions({
    queryKey: dashboardKeys.metrics(),
    queryFn: fetchMetrics,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  })

export const recentActivityQueryOptions = () =>
  queryOptions({
    queryKey: dashboardKeys.activity(),
    queryFn: fetchActivity,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  })

/**
 * Loads headline KPIs for the admin dashboard.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useDashboardMetricsQuery = () =>
  useQuery(dashboardMetricsQueryOptions())

/**
 * Loads the recent-activity feed for the admin dashboard.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useRecentActivityQuery = () =>
  useQuery(recentActivityQueryOptions())
