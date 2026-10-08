import { useQuery } from '@tanstack/react-query'

import { withErrorHandling } from '#/lib/errors'
import { api } from '#/lib/api-client'
import { DEFAULT_GC_TIME } from '#/constants'
import type { Campaign, CampaignDetail } from '#/types'

export const campaignKeys = {
  all: ['campaigns'] as const,
  list: () => ['campaigns', 'list'] as const,
  detail: (id: string) => ['campaigns', 'detail', id] as const,
  emailStatus: () => ['campaigns', 'email-status'] as const,
}

const fetchCampaigns = withErrorHandling(
  async (): Promise<Array<Campaign>> => api.get('/admin/campaigns'),
  'Failed to load campaigns',
)

const fetchCampaign = withErrorHandling(
  async (id: string): Promise<CampaignDetail> =>
    api.get(`/admin/campaigns/${id}`),
  'Failed to load this campaign',
)

const fetchEmailStatus = withErrorHandling(
  async (): Promise<{ mode: 'live' | 'simulated' | 'off' }> =>
    api.get('/admin/campaigns/email-status'),
  'Failed to check email setup',
)

/**
 * Lists all campaigns, newest first; refreshes while any is sending.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useCampaignsQuery = () =>
  useQuery({
    queryKey: campaignKeys.list(),
    queryFn: fetchCampaigns,
    gcTime: DEFAULT_GC_TIME,
    refetchInterval: (q) =>
      q.state.data?.some((c) => c.status === 'sending') ? 2000 : false,
  })

/**
 * Loads one campaign with its recipients; polls every 2s while it is sending.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useCampaignQuery = (id: string) =>
  useQuery({
    queryKey: campaignKeys.detail(id),
    queryFn: () => fetchCampaign(id),
    gcTime: DEFAULT_GC_TIME,
    refetchInterval: (q) => (q.state.data?.status === 'sending' ? 2000 : false),
  })

/**
 * Whether email can actually be delivered (live), is simulated locally, or is off.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useEmailStatusQuery = () =>
  useQuery({
    queryKey: campaignKeys.emailStatus(),
    queryFn: fetchEmailStatus,
    staleTime: 60_000,
  })
