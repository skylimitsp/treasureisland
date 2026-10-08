import { z } from 'zod'

import {
  email,
  isoDate,
  personName,
  phone,
  turnstileToken,
} from '#/schemas/common.schema'

const stay = z
  .object({
    checkIn: isoDate,
    checkOut: isoDate,
    guests: z.coerce.number().int().min(1).max(20),
  })
  .refine((s) => s.checkOut > s.checkIn, {
    path: ['checkOut'],
    message: 'Check-out must be after check-in',
  })

export const quoteQuerySchema = stay

// Mirrors `BookingInput` (+ optional phone and bot token).
export const bookingInputSchema = z
  .object({
    roomSlug: z.string().min(1),
    guestName: personName,
    email,
    phone: phone.optional(),
    checkIn: isoDate,
    checkOut: isoDate,
    guests: z.number().int().min(1).max(20),
    turnstileToken,
  })
  .refine((s) => s.checkOut > s.checkIn, {
    path: ['checkOut'],
    message: 'Check-out must be after check-in',
  })

export type BookingInputBody = z.infer<typeof bookingInputSchema>
