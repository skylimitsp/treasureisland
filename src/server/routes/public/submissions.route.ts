import { Hono } from 'hono'

import { parse, readJson } from '#/server/lib/validate'
import { verifyTurnstile } from '#/server/lib/turnstile'
import { idempotent } from '#/server/middleware/idempotency'
import { rateLimit } from '#/server/middleware/rate-limit'
import { bookingInputSchema } from '#/schemas/booking.schema'
import { eventEnquiryInputSchema } from '#/schemas/enquiry.schema'
import { slotRequestInputSchema } from '#/schemas/slot-request.schema'
import { newsletterInputSchema, tokenSchema } from '#/schemas/newsletter.schema'
import { getSettings } from '#/server/services/settings.service'
import { createBooking, toBooking } from '#/server/services/bookings.service'
import { createEnquiry, toEnquiry } from '#/server/services/events.service'
import {
  createSlotRequest,
  toSlotRequest,
} from '#/server/services/amenities.service'
import {
  confirm,
  subscribe,
  unsubscribeByToken,
} from '#/server/services/newsletter.service'
import { adminLink, notify, toStaff } from '#/server/notifications/notify'
import { templates } from '#/server/notifications/templates'
import type { AppEnv } from '#/server/env'

// Guest form submissions: bot check, rate limit, then guest + staff emails.
export const submissionRoutes = new Hono<AppEnv>()

submissionRoutes.use('*', async (c, next) => {
  await next()
  c.res.headers.set('cache-control', 'no-store')
})

const ip = (c: { req: { header: (n: string) => string | undefined } }) =>
  c.req.header('cf-connecting-ip')

submissionRoutes.post(
  '/bookings',
  rateLimit('PUBLIC_WRITE_LIMITER'),
  idempotent('bookings'),
  async (c) => {
    const { turnstileToken, ...input } = parse(
      bookingInputSchema,
      await readJson(c.req.raw),
    )
    await verifyTurnstile(c.env, turnstileToken, ip(c))
    const db = c.get('db')
    const booking = toBooking(
      await createBooking(db, input, await getSettings(db)),
    )
    notify(c.env, [
      { to: booking.email, ...templates.bookingReceived(booking as never) },
      {
        to: toStaff(c.env),
        replyTo: booking.email,
        ...templates.staffNewBooking(
          booking,
          adminLink(c.env, '/admin/bookings'),
        ),
      },
    ])
    return c.json({ data: booking }, 201)
  },
)

submissionRoutes.post(
  '/event-enquiries',
  rateLimit('PUBLIC_WRITE_LIMITER'),
  idempotent('enquiries'),
  async (c) => {
    const { turnstileToken, ...input } = parse(
      eventEnquiryInputSchema,
      await readJson(c.req.raw),
    )
    await verifyTurnstile(c.env, turnstileToken, ip(c))
    const enquiry = toEnquiry(await createEnquiry(c.get('db'), input))
    notify(c.env, [
      { to: enquiry.email, ...templates.enquiryReceived(enquiry) },
      {
        to: toStaff(c.env),
        replyTo: enquiry.email,
        ...templates.staffNewEnquiry(
          enquiry,
          adminLink(c.env, '/admin/enquiries'),
        ),
      },
    ])
    return c.json({ data: enquiry }, 201)
  },
)

submissionRoutes.post(
  '/slot-requests',
  rateLimit('PUBLIC_WRITE_LIMITER'),
  idempotent('slot-requests'),
  async (c) => {
    const { turnstileToken, ...input } = parse(
      slotRequestInputSchema,
      await readJson(c.req.raw),
    )
    await verifyTurnstile(c.env, turnstileToken, ip(c))
    const request = toSlotRequest(await createSlotRequest(c.get('db'), input))
    notify(c.env, [
      { to: request.email, ...templates.slotReceived(request) },
      {
        to: toStaff(c.env),
        replyTo: request.email,
        ...templates.staffNewSlot(
          request,
          adminLink(c.env, '/admin/amenities'),
        ),
      },
    ])
    return c.json({ data: request }, 201)
  },
)

// Same response whether new or already subscribed, so emails can't be enumerated.
submissionRoutes.post(
  '/newsletter',
  rateLimit('PUBLIC_WRITE_LIMITER'),
  async (c) => {
    const { email, source, turnstileToken } = parse(
      newsletterInputSchema,
      await readJson(c.req.raw),
    )
    await verifyTurnstile(c.env, turnstileToken, ip(c))
    const { confirmToken } = await subscribe(c.get('db'), email, source)
    if (confirmToken) {
      const url = adminLink(
        c.env,
        `/api/v1/newsletter/confirm?token=${confirmToken}`,
      )
      notify(c.env, [{ to: email, ...templates.newsletterConfirm(url) }])
    }
    return c.json({ data: { email, status: 'pending_confirmation' } }, 202)
  },
)

submissionRoutes.get('/newsletter/confirm', async (c) => {
  const { token } = parse(tokenSchema, c.req.query())
  await confirm(c.get('db'), token)
  return c.redirect('/?newsletter=confirmed', 303)
})

// Supports RFC 8058 one-click (POST from mail clients) and plain link clicks (GET).
submissionRoutes.on(['GET', 'POST'], '/newsletter/unsubscribe', async (c) => {
  const { token } = parse(tokenSchema, c.req.query())
  await unsubscribeByToken(c.get('db'), token)
  return c.req.method === 'GET'
    ? c.redirect('/?newsletter=unsubscribed', 303)
    : c.json({ data: { status: 'unsubscribed' } })
})
