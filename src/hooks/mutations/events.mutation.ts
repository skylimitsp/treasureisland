import { useMutation, useQueryClient } from '@tanstack/react-query'

import { withErrorHandling } from '#/lib/errors'
import { createEventEnquiry } from '#/data/events'
import { eventKeys } from '#/hooks/queries/events.query'
import type { EventEnquiry, EventEnquiryInput } from '#/types'

// Submits a celebration enquiry — no payment, staff follow up personally.
const submitEnquiry = withErrorHandling(
  async (input: EventEnquiryInput): Promise<EventEnquiry> => {
    await new Promise((resolve) => setTimeout(resolve, 250))
    return createEventEnquiry(input) // ← swap for httpClient.post('/event-enquiries')
  },
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
