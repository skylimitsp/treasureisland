import { ApiError } from '#/server/lib/errors'
import type { Bindings } from '#/server/env'

// Skipped when no secret is configured (local dev, or before the widget ships).
export async function verifyTurnstile(
  env: Bindings,
  token: string | undefined,
  ip: string | undefined,
) {
  if (!env.TURNSTILE_SECRET) return
  if (!token)
    throw new ApiError('BOT_CHECK_FAILED', 'Please complete the security check')
  const body = new FormData()
  body.append('secret', env.TURNSTILE_SECRET)
  body.append('response', token)
  if (ip) body.append('remoteip', ip)
  const res = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      body,
    },
  )
  const result: { success: boolean } = await res.json()
  if (!result.success)
    throw new ApiError(
      'BOT_CHECK_FAILED',
      'Security check failed. Please try again.',
    )
}
