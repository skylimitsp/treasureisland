import { useMutation, useQueryClient } from '@tanstack/react-query'

import { withErrorHandling } from '#/lib/errors'
import { unsubscribe } from '#/data/newsletter'
import { subscriberKeys } from '#/hooks/queries/subscribers.query'
import { dashboardKeys } from '#/hooks/queries/dashboard.query'

const doUnsubscribe = withErrorHandling(
  async (email: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    unsubscribe(email) // ← swap for httpClient.delete(`/admin/subscribers/${email}`)
  },
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
