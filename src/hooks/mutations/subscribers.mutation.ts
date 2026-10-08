import { useMutation, useQueryClient } from '@tanstack/react-query'

import { withErrorHandling } from '#/lib/errors'
import { api } from '#/lib/api-client'
import { subscriberKeys } from '#/hooks/queries/subscribers.query'
import { dashboardKeys } from '#/hooks/queries/dashboard.query'

const doUnsubscribe = withErrorHandling(
  async (id: string): Promise<void> => api.delete(`/admin/subscribers/${id}`),
  'Unable to unsubscribe this address',
)

/**
 * Removes a newsletter subscriber.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useUnsubscribeMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: doUnsubscribe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriberKeys.all })
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
    },
  })
}
