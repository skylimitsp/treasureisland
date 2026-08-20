import { useMutation, useQueryClient } from '@tanstack/react-query'

import { withErrorHandling } from '#/lib/errors'
import { updateEnquiryStatus } from '#/data/events'
import { enquiryKeys } from '#/hooks/queries/enquiries.query'
import { dashboardKeys } from '#/hooks/queries/dashboard.query'
import type { EnquiryStatus, EventEnquiry } from '#/types'

interface StatusChange {
  id: string
  status: EnquiryStatus
}

const doUpdateStatus = withErrorHandling(
  async ({ id, status }: StatusChange): Promise<EventEnquiry> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return updateEnquiryStatus(id, status) // ← swap for httpClient.patch(...)
  },
  'Unable to update this enquiry',
)

/**
 * Advances an enquiry through the new → contacted → closed pipeline.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useUpdateEnquiryStatusMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: doUpdateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enquiryKeys.all })
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
    },
  })
}
