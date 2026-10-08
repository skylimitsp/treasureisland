import { waitUntil } from 'cloudflare:workers'

import { sendEmail, staffRecipients } from '#/server/notifications/mailer'
import type { Email } from '#/server/notifications/mailer'
import type { Bindings } from '#/server/env'

// Sends after the response is returned, so a slow mail provider never delays guests.
export function notify(env: Bindings, emails: Array<Email>) {
  waitUntil(Promise.all(emails.map((e) => sendEmail(env, e))))
}

export const toStaff = (env: Bindings) => staffRecipients(env)

export const adminLink = (env: Bindings, path: string) =>
  `${env.APP_URL}${path}`
