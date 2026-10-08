import { useMutation, useQueryClient } from '@tanstack/react-query'

import { withErrorHandling } from '#/lib/errors'
import { api } from '#/lib/api-client'
import { eventKeys } from '#/hooks/queries/events.query'
import type { EventEnquiry, EventEnquiryInput } from '#/types'

// Saves an enquiry for the events team; the key stops a double-click sending it twice.
const submitEnquiry = withErrorHandling(
  async (input: EventEnquiryInput): Promise<EventEnquiry> =>
    api.post<EventEnquiry>('/event-enquiries', input, {
      'idempotency-key': crypto.randomUUID(),
    }),
  'Failed to submit your enquiry',
)

/**
 * Creates an event enquiry and invalidates the admin enquiries key.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useCreateEventEnquiryMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: submitEnquiry,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: eventKeys.enquiries() }),
  })
}
