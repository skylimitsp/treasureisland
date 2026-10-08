import { useMutation, useQueryClient } from '@tanstack/react-query'

import { withErrorHandling } from '#/lib/errors'
import { api } from '#/lib/api-client'
import { enquiryKeys } from '#/hooks/queries/enquiries.query'
import { dashboardKeys } from '#/hooks/queries/dashboard.query'
import type { EnquiryStatus, EventEnquiry } from '#/types'

interface StatusChange {
  id: string
  status: EnquiryStatus
}

const doUpdateStatus = withErrorHandling(
  async ({ id, status }: StatusChange): Promise<EventEnquiry> => {
    return api.post<EventEnquiry>(`/admin/enquiries/${id}/status`, { status })
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
