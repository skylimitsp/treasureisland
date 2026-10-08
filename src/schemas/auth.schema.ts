import { z } from 'zod'

import { email, personName } from '#/schemas/common.schema'

export const password = z
  .string()
  .min(10, 'Use at least 10 characters')
  .max(200)

export const loginSchema = z.object({
  email,
  password: z.string().min(1).max(200),
})

export const forgotPasswordSchema = z.object({ email })

export const resetPasswordSchema = z.object({
  token: z.string().min(16).max(128),
  password,
})

export const acceptInviteSchema = z.object({
  token: z.string().min(16).max(128),
  name: personName,
  password,
})

export const staffRole = z.enum(['admin', 'concierge'])

export const inviteSchema = z.object({ email, role: staffRole })

export const updateUserSchema = z
  .object({ role: staffRole, active: z.boolean() })
  .partial()
  .refine((v) => Object.keys(v).length > 0, 'Nothing to update')
