import { z } from 'zod'

const httpUrl = z
  .string()
  .trim()
  .regex(/^https?:\/\/\S+$/, 'Use a full link starting with https://')
  .max(500)

// A draft can be saved half-finished; sending checks it is complete (see `isSendable`).
export const campaignDraftSchema = z
  .object({
    subject: z.string().trim().max(150),
    preheader: z.string().trim().max(150),
    body: z.string().max(20_000),
    ctaLabel: z.string().trim().max(40).nullable(),
    ctaUrl: httpUrl.nullable(),
    audience: z.enum(['all', 'selected']),
    selectedIds: z.array(z.string().min(1)).max(5000),
  })
  .partial()

export type CampaignDraftBody = z.infer<typeof campaignDraftSchema>

export const campaignTestSchema = z.object({
  email: z.string().trim().toLowerCase().email().optional(),
})
