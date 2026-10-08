import { z } from 'zod'

import {
  email,
  isoDate,
  personName,
  phone,
  turnstileToken,
} from '#/schemas/common.schema'

export const eventCategory = z.enum([
  'weddings',
  'birthdays',
  'family',
  'meetings',
])

// Mirrors `EventEnquiryInput`.
export const eventEnquiryInputSchema = z.object({
  eventType: eventCategory,
  date: isoDate,
  flexibleDates: z.boolean(),
  guests: z.number().int().min(1).max(2000),
  name: personName,
  email,
  phone,
  budget: z.string().max(60).nullable(),
  message: z.string().trim().max(4000),
  consent: z.boolean(),
  turnstileToken,
})

export type EventEnquiryBody = z.infer<typeof eventEnquiryInputSchema>
