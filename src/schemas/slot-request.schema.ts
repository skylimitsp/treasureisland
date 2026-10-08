import { z } from 'zod'

import {
  email,
  isoDate,
  personName,
  turnstileToken,
} from '#/schemas/common.schema'

// Mirrors `SlotRequestInput`.
export const slotRequestInputSchema = z.object({
  slug: z.string().min(1),
  date: isoDate,
  slot: z.string().trim().min(1).max(60),
  partySize: z.number().int().min(1).max(100),
  name: personName,
  email,
  note: z.string().trim().max(1000).optional(),
  turnstileToken,
})

export type SlotRequestBody = z.infer<typeof slotRequestInputSchema>
