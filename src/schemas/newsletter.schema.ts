import { z } from 'zod'

import { email, turnstileToken } from '#/schemas/common.schema'

export const newsletterSource = z.enum(['footer', 'home', 'about', 'events'])

export const newsletterInputSchema = z.object({
  email,
  source: newsletterSource,
  turnstileToken,
})

export const tokenSchema = z.object({ token: z.string().min(16).max(128) })
