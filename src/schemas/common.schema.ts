import { z } from 'zod'

export const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use the format YYYY-MM-DD')
  .refine((v) => !Number.isNaN(Date.parse(`${v}T00:00:00Z`)), 'Invalid date')

export const email = z
  .string()
  .trim()
  .toLowerCase()
  .email('Enter a valid email')

export const personName = z.string().trim().min(2, 'Enter your name').max(120)

export const phone = z
  .string()
  .trim()
  .regex(/^[+\d][\d\s()-]{6,20}$/, 'Enter a valid phone number')

// Cloudflare Turnstile token from the form widget; optional until the widget ships.
export const turnstileToken = z.string().max(2048).optional()
