import { describe, expect, it } from 'vitest'

import { createPasswordReset } from '#/server/services/auth.service'
import { call, db, seedRoom, signIn, uid } from '#/server/test/helpers'

describe('sessions', () => {
  it('requires a session for admin endpoints', async () => {
    const res = await call('GET', '/admin/metrics')
    expect(res.status).toBe(401)
  })

  it('gives the same error for unknown emails and wrong passwords', async () => {
    const admin = await signIn('admin')
    const wrong = await call('POST', '/auth/login', {
      body: { email: admin.email, password: 'nope-nope-nope' },
    })
    const unknown = await call('POST', '/auth/login', {
      body: { email: `x-${uid()}@a.test`, password: 'nope' },
    })
    expect(wrong.status).toBe(401)
    expect(unknown.json).toEqual(wrong.json)
  })

  it('sets an HttpOnly, SameSite=Lax session cookie', async () => {
    const admin = await signIn('admin')
    const res = await call('POST', '/auth/login', {
      body: { email: admin.email, password: admin.password },
    })
    const cookie = res.headers.get('set-cookie') ?? ''
    expect(cookie).toMatch(/ti_session=/)
    expect(cookie).toMatch(/HttpOnly/i)
    expect(cookie).toMatch(/SameSite=Lax/i)
  })

  it('returns the signed-in user and revokes the session on logout', async () => {
    const admin = await signIn('admin')
    const me = await call('GET', '/auth/me', { cookie: admin.cookie })
    expect(me.json.data).toMatchObject({ email: admin.email, role: 'admin' })
    expect(me.json.data.passwordHash).toBeUndefined()
    await call('POST', '/auth/logout', { cookie: admin.cookie })
    expect(
      (await call('GET', '/auth/me', { cookie: admin.cookie })).status,
    ).toBe(401)
  })

  it('blocks cross-site state-changing requests', async () => {
    const res = await call('POST', '/auth/logout', {
      headers: { origin: 'https://evil.example' },
    })
    expect(res.status).toBe(403)
  })
})

describe('roles', () => {
  it('lets concierge run operations but not admin-only areas', async () => {
    const concierge = await signIn('concierge')
    const room = await seedRoom()
    expect(
      (await call('GET', '/admin/bookings', { cookie: concierge.cookie }))
        .status,
    ).toBe(200)
    for (const [method, path] of [
      ['GET', '/admin/users'],
      ['GET', '/admin/settings'],
      ['GET', '/admin/subscribers'],
      ['GET', '/admin/audit-log'],
      ['POST', '/admin/calendar/token'],
    ] as const) {
      expect(
        (await call(method, path, { cookie: concierge.cookie })).status,
        path,
      ).toBe(403)
    }
    const priceEdit = await call('PATCH', `/admin/rooms/${room.id}`, {
      cookie: concierge.cookie,
      body: { pricePerNight: 1 },
    })
    expect(priceEdit.status).toBe(403)
  })

  it('keeps at least one active admin', async () => {
    const admin = await signIn('admin')
    const me = await call('GET', '/auth/me', { cookie: admin.cookie })
    // Demote every other admin first so this one is the last.
    const users = await call('GET', '/admin/users', { cookie: admin.cookie })
    for (const u of users.json.data) {
      if (u.role === 'admin' && u.id !== me.json.data.id) {
        await call('PATCH', `/admin/users/${u.id}`, {
          cookie: admin.cookie,
          body: { role: 'concierge' },
        })
      }
    }
    const self = await call('PATCH', `/admin/users/${me.json.data.id}`, {
      cookie: admin.cookie,
      body: { role: 'concierge' },
    })
    expect(self.status).toBe(409)
  })

  it('signs a deactivated user out everywhere', async () => {
    const admin = await signIn('admin')
    const concierge = await signIn('concierge')
    const me = await call('GET', '/auth/me', { cookie: concierge.cookie })
    await call('PATCH', `/admin/users/${me.json.data.id}`, {
      cookie: admin.cookie,
      body: { active: false },
    })
    expect(
      (await call('GET', '/auth/me', { cookie: concierge.cookie })).status,
    ).toBe(401)
  })
})

describe('invites and password reset', () => {
  it('turns a one-time invite into a staff account', async () => {
    const admin = await signIn('admin')
    const email = `invitee-${uid()}@localhost.test`
    const invite = await call('POST', '/admin/users/invite', {
      cookie: admin.cookie,
      body: { email, role: 'concierge' },
    })
    expect(invite.status).toBe(201)
    // The raw token only exists in the email; mint a fresh one through the service.
    const { createInvite } = await import('#/server/services/auth.service')
    const token = await createInvite(db, email, 'concierge', 'test')
    const accepted = await call('POST', '/auth/invites/accept', {
      body: { token, name: 'New Staff', password: 'a-strong-password' },
    })
    expect(accepted.status).toBe(201)
    expect(accepted.json.data).toMatchObject({ email, role: 'concierge' })
    const reused = await call('POST', '/auth/invites/accept', {
      body: { token, name: 'New Staff', password: 'a-strong-password' },
    })
    expect(reused.status).toBe(400)
  })

  it('resets a password once and signs out old sessions', async () => {
    const admin = await signIn('admin')
    const reset = await createPasswordReset(db, admin.email)
    expect(reset).not.toBeNull()
    const res = await call('POST', '/auth/password/reset', {
      body: { token: reset?.token, password: 'brand-new-password' },
    })
    expect(res.status).toBe(204)
    expect(
      (await call('GET', '/auth/me', { cookie: admin.cookie })).status,
    ).toBe(401)
    const login = await call('POST', '/auth/login', {
      body: { email: admin.email, password: 'brand-new-password' },
    })
    expect(login.status).toBe(200)
  })

  it('does not reveal whether an email has an account', async () => {
    const res = await call('POST', '/auth/password/forgot', {
      body: { email: `ghost-${uid()}@a.test` },
    })
    expect(res.status).toBe(202)
  })
})

describe('invite links (shared by hand while email is off)', () => {
  const tokenFrom = (link: string) =>
    new URL(link).searchParams.get('token') ?? ''

  it('returns a copyable link and lists it while pending', async () => {
    const admin = await signIn('admin')
    const email = `link-${uid()}@localhost.test`
    const res = await call('POST', '/admin/users/invite', {
      cookie: admin.cookie,
      body: { email, role: 'concierge' },
    })
    expect(res.json.data.link).toMatch(/\/auth\/invite\?token=[0-9a-f]{64}$/)
    const list = await call('GET', '/admin/users/invites', {
      cookie: admin.cookie,
    })
    const row = list.json.data.find((i: { email: string }) => i.email === email)
    expect(row).toMatchObject({ role: 'concierge', link: res.json.data.link })
    expect(row.invitedBy).toBe('Test admin')
  })

  it('drops the invite from the list once it is accepted', async () => {
    const admin = await signIn('admin')
    const email = `accept-${uid()}@localhost.test`
    const { json } = await call('POST', '/admin/users/invite', {
      cookie: admin.cookie,
      body: { email, role: 'concierge' },
    })
    const accepted = await call('POST', '/auth/invites/accept', {
      body: {
        token: tokenFrom(json.data.link),
        name: 'New Person',
        password: 'a-strong-password',
      },
    })
    expect(accepted.status).toBe(201)
    const list = await call('GET', '/admin/users/invites', {
      cookie: admin.cookie,
    })
    expect(list.json.data.map((i: { email: string }) => i.email)).not.toContain(
      email,
    )
  })

  it('replaces the old link when the same person is invited again', async () => {
    const admin = await signIn('admin')
    const email = `again-${uid()}@localhost.test`
    const first = await call('POST', '/admin/users/invite', {
      cookie: admin.cookie,
      body: { email, role: 'concierge' },
    })
    await call('POST', '/admin/users/invite', {
      cookie: admin.cookie,
      body: { email, role: 'admin' },
    })
    const list = await call('GET', '/admin/users/invites', {
      cookie: admin.cookie,
    })
    expect(
      list.json.data.filter((i: { email: string }) => i.email === email),
    ).toHaveLength(1)
    const old = await call('POST', '/auth/invites/accept', {
      body: {
        token: tokenFrom(first.json.data.link),
        name: 'Old Link',
        password: 'a-strong-password',
      },
    })
    expect(old.status).toBe(400)
  })

  it('revokes an invite so its link stops working', async () => {
    const admin = await signIn('admin')
    const email = `revoke-${uid()}@localhost.test`
    const { json } = await call('POST', '/admin/users/invite', {
      cookie: admin.cookie,
      body: { email, role: 'concierge' },
    })
    const list = await call('GET', '/admin/users/invites', {
      cookie: admin.cookie,
    })
    const id = list.json.data.find(
      (i: { email: string }) => i.email === email,
    ).id
    expect(
      (
        await call('DELETE', `/admin/users/invites/${id}`, {
          cookie: admin.cookie,
        })
      ).status,
    ).toBe(204)
    const res = await call('POST', '/auth/invites/accept', {
      body: {
        token: tokenFrom(json.data.link),
        name: 'Too Late',
        password: 'a-strong-password',
      },
    })
    expect(res.status).toBe(400)
  })

  it('accepts a link only once, even with simultaneous clicks', async () => {
    const admin = await signIn('admin')
    const { json } = await call('POST', '/admin/users/invite', {
      cookie: admin.cookie,
      body: { email: `race-${uid()}@localhost.test`, role: 'concierge' },
    })
    const body = {
      token: tokenFrom(json.data.link),
      name: 'Racer',
      password: 'a-strong-password',
    }
    const results = await Promise.all(
      [1, 2, 3].map(() => call('POST', '/auth/invites/accept', { body })),
    )
    expect(results.filter((r) => r.status === 201)).toHaveLength(1)
  })

  it('keeps invite links admin-only', async () => {
    const concierge = await signIn('concierge')
    expect(
      (await call('GET', '/admin/users/invites', { cookie: concierge.cookie }))
        .status,
    ).toBe(403)
  })
})
