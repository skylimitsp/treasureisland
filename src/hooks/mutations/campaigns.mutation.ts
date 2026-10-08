import { useMutation, useQueryClient } from '@tanstack/react-query'

import { withErrorHandling } from '#/lib/errors'
import { api } from '#/lib/api-client'
import { campaignKeys } from '#/hooks/queries/campaigns.query'
import type { Campaign, CampaignDraft } from '#/types'

const doCreate = withErrorHandling(
  async (draft: CampaignDraft): Promise<Campaign> =>
    api.post('/admin/campaigns', draft),
  'Unable to create the campaign',
)

const doSave = withErrorHandling(
  async ({
    id,
    draft,
  }: {
    id: string
    draft: CampaignDraft
  }): Promise<Campaign> => api.patch(`/admin/campaigns/${id}`, draft),
  'Unable to save the campaign',
)

const doDelete = withErrorHandling(
  async (id: string): Promise<void> => api.delete(`/admin/campaigns/${id}`),
  'Unable to delete the campaign',
)

const doDuplicate = withErrorHandling(
  async (id: string): Promise<Campaign> =>
    api.post(`/admin/campaigns/${id}/duplicate`),
  'Unable to duplicate the campaign',
)

const doTest = withErrorHandling(
  async (id: string): Promise<{ to: string }> =>
    api.post(`/admin/campaigns/${id}/test`),
  'Unable to send the test email',
)

const doSend = withErrorHandling(
  async (id: string): Promise<Campaign> =>
    api.post(`/admin/campaigns/${id}/send`),
  'Unable to send the campaign',
)

function useInvalidate() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: campaignKeys.all })
}

/**
 * Creates a new draft campaign.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useCreateCampaignMutation = () => {
  const invalidate = useInvalidate()
  return useMutation({ mutationFn: doCreate, onSuccess: invalidate })
}

/**
 * Saves changes to a draft.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useSaveCampaignMutation = () => {
  const invalidate = useInvalidate()
  return useMutation({ mutationFn: doSave, onSuccess: invalidate })
}

/**
 * Deletes a campaign (any status except sending).
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useDeleteCampaignMutation = () => {
  const invalidate = useInvalidate()
  return useMutation({ mutationFn: doDelete, onSuccess: invalidate })
}

/**
 * Copies a campaign into a new draft.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useDuplicateCampaignMutation = () => {
  const invalidate = useInvalidate()
  return useMutation({ mutationFn: doDuplicate, onSuccess: invalidate })
}

/**
 * Emails a [Test] copy to the signed-in admin.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useTestCampaignMutation = () => useMutation({ mutationFn: doTest })

/**
 * Sends the campaign to its audience; delivery continues in the background.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useSendCampaignMutation = () => {
  const invalidate = useInvalidate()
  return useMutation({ mutationFn: doSend, onSuccess: invalidate })
}
