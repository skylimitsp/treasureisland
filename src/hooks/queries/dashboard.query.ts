import { queryOptions, useQuery } from '@tanstack/react-query'

import { withErrorHandling } from '#/lib/errors'
import { getDashboardMetrics, getRecentActivity } from '#/data/admin'
import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from '#/constants'
import type { ActivityItem, DashboardMetrics } from '#/types'

export const dashboardKeys = {
  all: ['dashboard'] as const,
  metrics: () => ['dashboard', 'metrics'] as const,
  activity: () => ['dashboard', 'activity'] as const,
}

const fetchMetrics = withErrorHandling(async (): Promise<DashboardMetrics> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return getDashboardMetrics() // ← swap for httpClient.get('/admin/metrics')
}, 'Failed to load dashboard metrics')

const fetchActivity = withErrorHandling(
  async (): Promise<Array<ActivityItem>> => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return getRecentActivity() // ← swap for httpClient.get('/admin/activity')
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
