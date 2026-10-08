import { Hono } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import type { Context } from 'hono'

import { parse, readJson } from '#/server/lib/validate'
import { ApiError } from '#/server/lib/errors'
import { rateLimit } from '#/server/middleware/rate-limit'
import {
  acceptInviteSchema,
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
} from '#/schemas/auth.schema'
import {
  SESSION_COOKIE,
  SESSION_DAYS,
  acceptInvite,
  createPasswordReset,
  login,
  logout,
  resetPassword,
} from '#/server/services/auth.service'
import { adminLink, notify } from '#/server/notifications/notify'
import { templates } from '#/server/notifications/templates'
import type { AppEnv } from '#/server/env'

export const authRoutes = new Hono<AppEnv>()

authRoutes.use('*', async (c, next) => {
  await next()
  c.res.headers.set('cache-control', 'no-store')
})

// Secure cookies need HTTPS; local dev on http://localhost gets a non-secure one.
function setSession(c: Context<AppEnv>, token: string) {
  setCookie(c, SESSION_COOKIE, token, {
    httpOnly: true,
    secure: new URL(c.req.url).protocol === 'https:',
    sameSite: 'Lax',
    path: '/',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  })
}

authRoutes.post('/login', rateLimit('LOGIN_LIMITER'), async (c) => {
  const { email, password } = parse(loginSchema, await readJson(c.req.raw))
  const { token, user } = await login(
    c.get('db'),
    email,
    password,
    c.req.header('user-agent') ?? null,
  )
  setSession(c, token)
  return c.json({ data: user })
})

authRoutes.post('/logout', async (c) => {
  const token = getCookie(c, SESSION_COOKIE)
  if (token) await logout(c.get('db'), token)
  deleteCookie(c, SESSION_COOKIE, { path: '/' })
  return c.body(null, 204)
})

authRoutes.get('/me', (c) => {
  const user = c.get('user')
  if (!user) throw new ApiError('UNAUTHENTICATED', 'Not signed in')
  return c.json({ data: user })
})

// Always 202 so the response never reveals whether an account exists.
authRoutes.post('/password/forgot', rateLimit('LOGIN_LIMITER'), async (c) => {
  const { email } = parse(forgotPasswordSchema, await readJson(c.req.raw))
  const reset = await createPasswordReset(c.get('db'), email)
  if (reset) {
    const url = adminLink(c.env, `/auth/reset?token=${reset.token}`)
    notify(c.env, [{ to: email, ...templates.passwordReset(reset.name, url) }])
  }
  return c.json({ data: { status: 'sent_if_account_exists' } }, 202)
})

authRoutes.post('/password/reset', rateLimit('LOGIN_LIMITER'), async (c) => {
  const { token, password } = parse(
    resetPasswordSchema,
    await readJson(c.req.raw),
  )
  await resetPassword(c.get('db'), token, password)
  return c.body(null, 204)
})

authRoutes.post('/invites/accept', rateLimit('LOGIN_LIMITER'), async (c) => {
  const { token, name, password } = parse(
    acceptInviteSchema,
    await readJson(c.req.raw),
  )
  const session = await acceptInvite(
    c.get('db'),
    token,
    name,
    password,
    c.req.header('user-agent') ?? null,
  )
  setSession(c, session.token)
  return c.json({ data: session.user }, 201)
})
