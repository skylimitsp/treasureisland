import { useMutation } from '@tanstack/react-query'

import { withErrorHandling } from '#/lib/errors'
import { api } from '#/lib/api-client'
import type { NewsletterSource } from '#/types'

// Subscribes an email; the API sends a confirmation email (double opt-in).
const doSubscribe = withErrorHandling(
  async (input: {
    email: string
    source: NewsletterSource
  }): Promise<{ email: string; status: string }> =>
    api.post('/newsletter', input),
  'Unable to subscribe right now',
)

/**
 * Subscribes the visitor to the newsletter.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useSubscribeNewsletterMutation = () =>
  useMutation({ mutationFn: doSubscribe })
