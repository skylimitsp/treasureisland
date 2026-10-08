import { afterEach, describe, expect, it, vi } from 'vitest'

import { hashPassword, verifyPassword } from '#/server/lib/crypto'
import { nightsBetween } from '#/server/lib/dates'
import { toMajor, toMinor } from '#/server/lib/money'
import { nextReference } from '#/server/lib/references'
import { verifyTurnstile } from '#/server/lib/turnstile'
import { templates } from '#/server/notifications/templates'
import { db } from '#/server/test/helpers'
import type { Bindings } from '#/server/env'

describe('passwords', () => {
  it('verifies the right password and rejects others', async () => {
    const hash = await hashPassword('correct horse battery')
    expect(hash).toMatch(/^pbkdf2\$100000\$/)
    expect(await verifyPassword('correct horse battery', hash)).toBe(true)
    expect(await verifyPassword('wrong', hash)).toBe(false)
    expect(await verifyPassword('x', 'garbage')).toBe(false)
  })

  it('salts each hash', async () => {
    expect(await hashPassword('same')).not.toBe(await hashPassword('same'))
  })
})

describe('dates and money', () => {
  it('counts nights across month and year ends', () => {
    expect(nightsBetween('2026-12-30', '2027-01-02')).toBe(3)
    expect(nightsBetween('2028-02-28', '2028-03-01')).toBe(2)
  })

  it('round-trips minor units without float drift', () => {
    expect(toMinor(19.99)).toBe(1999)
    expect(toMajor(toMinor(0.1 + 0.2))).toBe(0.3)
  })
})

describe('reference codes', () => {
  it('issues unique sequential codes under concurrency', async () => {
    const codes = await Promise.all(
      Array.from({ length: 10 }, () => nextReference(db, 'ENQ')),
    )
    expect(new Set(codes).size).toBe(10)
    expect(codes.every((c) => /^ENQ-\d{4}-\d{4}$/.test(c))).toBe(true)
  })
})

describe('email templates', () => {
  it('escapes guest-supplied text in HTML', () => {
    const email = templates.enquiryReceived({
      id: 'ENQ-1',
      name: '<script>alert(1)</script>',
      eventType: 'weddings',
      date: '2027-01-01',
      guests: 2,
    })
    expect(email.html).not.toContain('<script>')
    expect(email.html).toContain('&lt;script&gt;')
  })
})

describe('turnstile', () => {
  afterEach(() => vi.unstubAllGlobals())
  const env = (secret?: string) =>
    ({ TURNSTILE_SECRET: secret }) as unknown as Bindings

  it('is skipped when no secret is configured', async () => {
    await expect(
      verifyTurnstile(env(), undefined, undefined),
    ).resolves.toBeUndefined()
  })

  it('requires a token and a successful verification when configured', async () => {
    await expect(
      verifyTurnstile(env('s'), undefined, undefined),
    ).rejects.toMatchObject({ code: 'BOT_CHECK_FAILED' })
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json({ success: false })),
    )
    await expect(
      verifyTurnstile(env('s'), 'tok', '1.2.3.4'),
    ).rejects.toMatchObject({ code: 'BOT_CHECK_FAILED' })
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json({ success: true })),
    )
    await expect(
      verifyTurnstile(env('s'), 'tok', '1.2.3.4'),
    ).resolves.toBeUndefined()
  })
})
