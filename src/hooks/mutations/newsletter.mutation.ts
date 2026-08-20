import { useMutation } from '@tanstack/react-query'

import { withErrorHandling } from '#/lib/errors'
import { subscribeNewsletter } from '#/data/newsletter'
import type { NewsletterSignup, NewsletterSource } from '#/types'

// Subscribes an email to the newsletter (deduped by the mock accessor).
const doSubscribe = withErrorHandling(
  async (input: {
    email: string
    source: NewsletterSource
  }): Promise<NewsletterSignup> => {
    await new Promise((resolve) => setTimeout(resolve, 400))
    return subscribeNewsletter(input) // ← swap for httpClient.post('/newsletter')
  },
  'Unable to subscribe right now',
)

/**
 * Subscribes the visitor to the newsletter.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useSubscribeNewsletterMutation = () =>
  useMutation({ mutationFn: doSubscribe })
