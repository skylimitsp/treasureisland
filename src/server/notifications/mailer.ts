/**
 * Email transport: Resend in staging/production, console output in local dev.
 * @author Joseph Nartey
 * @github devjoemedia
 */
import type { Bindings } from '#/server/env'

export interface Email {
  to: string | Array<string>
  subject: string
  html: string
  text: string
  replyTo?: string
  headers?: Record<string, string>
}

// Retries transient Resend failures (5xx/429) with backoff; never throws to the caller.
export async function sendEmail(env: Bindings, email: Email): Promise<boolean> {
  if (!env.RESEND_API_KEY) {
    // Full text (it may hold invite/reset links) is only logged on a local dev copy.
    const local = emailMode(env) === 'simulated'
    console.info(
      local ? '[mail:dev]' : '[mail:not-sent] email is not set up',
      JSON.stringify({
        to: email.to,
        subject: email.subject,
        ...(local && { text: email.text }),
      }),
    )
    return local
  }
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.MAIL_FROM,
        to: email.to,
        subject: email.subject,
        html: email.html,
        text: email.text,
        reply_to: email.replyTo,
      }),
    }).catch(() => null)
    if (res?.ok) return true
    if (res && res.status < 500 && res.status !== 429) {
      console.error('[mail] rejected', res.status, await res.text())
      return false
    }
    await new Promise((r) => setTimeout(r, 500 * 2 ** attempt))
  }
  console.error('[mail] failed after retries', email.subject)
  return false
}

export function staffRecipients(env: Bindings): Array<string> {
  return env.STAFF_ALERT_EMAILS.split(',')
    .map((e) => e.trim())
    .filter(Boolean)
}

// Real delivery needs Resend; locally (APP_URL on localhost) sending is simulated in the log.
export function emailMode(env: Bindings): 'live' | 'simulated' | 'off' {
  if (env.RESEND_API_KEY) return 'live'
  return /^http:\/\/(localhost|127\.0\.0\.1)/.test(env.APP_URL)
    ? 'simulated'
    : 'off'
}

// Sends up to 100 emails in one Resend call; the whole batch succeeds or fails together.
export async function sendBatch(
  env: Bindings,
  emails: Array<Email>,
): Promise<{ ok: boolean; error?: string }> {
  if (emailMode(env) === 'simulated') {
    for (const e of emails)
      console.info(
        '[mail:dev:batch]',
        JSON.stringify({ to: e.to, subject: e.subject }),
      )
    return { ok: true }
  }
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch('https://api.resend.com/emails/batch', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        emails.map((e) => ({
          from: env.MAIL_FROM,
          to: e.to,
          subject: e.subject,
          html: e.html,
          text: e.text,
          reply_to: e.replyTo,
          headers: e.headers,
        })),
      ),
    }).catch(() => null)
    if (res?.ok) return { ok: true }
    if (res && res.status < 500 && res.status !== 429) {
      return {
        ok: false,
        error: `Rejected by email provider (${res.status}): ${(await res.text()).slice(0, 200)}`,
      }
    }
    await new Promise((r) => setTimeout(r, 500 * 2 ** attempt))
  }
  return { ok: false, error: 'Email provider unavailable, try again later' }
}
