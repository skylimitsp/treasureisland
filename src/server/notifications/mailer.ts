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
}

// Retries transient Resend failures (5xx/429) with backoff; never throws to the caller.
export async function sendEmail(env: Bindings, email: Email): Promise<boolean> {
  if (!env.RESEND_API_KEY) {
    console.info(
      '[mail:dev]',
      JSON.stringify({
        to: email.to,
        subject: email.subject,
        text: email.text,
      }),
    )
    return true
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
