import { useMutation } from '@tanstack/react-query'

import { withErrorHandling } from '#/lib/errors'
import { createSlotRequest } from '#/data/amenities'
import type { SlotRequest, SlotRequestInput } from '#/types'

// Requests an amenity slot — a light request, not live inventory or payment.
const submitSlotRequest = withErrorHandling(
  async (input: SlotRequestInput): Promise<SlotRequest> => {
    await new Promise((resolve) => setTimeout(resolve, 350))
    return createSlotRequest(input) // ← swap for httpClient.post('/slot-requests', input)
  },
  'Unable to send your request',
)

/**
 * Submits a reserve-a-slot request for a bookable amenity.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useSlotRequestMutation = () =>
  useMutation({ mutationFn: submitSlotRequest })
