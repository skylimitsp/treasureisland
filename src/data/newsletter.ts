import type { NewsletterSignup, NewsletterSource } from '#/types'

// In-memory subscribers so the mock write path behaves end-to-end.
const signups: Array<NewsletterSignup> = [
  {
    id: 'nl_1',
    email: 'grace.owusu@example.com',
    source: 'footer',
    status: 'subscribed',
    createdAt: '2026-07-11T09:30:00.000Z',
  },
  {
    id: 'nl_2',
    email: 'liam.becker@example.com',
    source: 'home',
    status: 'subscribed',
    createdAt: '2026-07-24T16:12:00.000Z',
  },
  {
    id: 'nl_3',
    email: 'yuki.tanaka@example.com',
    source: 'about',
    status: 'subscribed',
    createdAt: '2026-08-01T11:45:00.000Z',
  },
  {
    id: 'nl_4',
    email: 'fatima.saleh@example.com',
    source: 'events',
    status: 'subscribed',
    createdAt: '2026-08-09T14:03:00.000Z',
  },
  {
    id: 'nl_5',
    email: 'noah.martins@example.com',
    source: 'footer',
    status: 'subscribed',
    createdAt: '2026-08-15T19:22:00.000Z',
  },
]

export function subscribeNewsletter(input: {
  email: string
  source: NewsletterSource
}): NewsletterSignup {
  const email = input.email.trim().toLowerCase()
  const existing = signups.find((s) => s.email === email)
  if (existing) throw new Error('You are already subscribed.')
  const signup: NewsletterSignup = {
    id: `nl_${signups.length + 1}`,
    email,
    source: input.source,
    status: 'subscribed',
    createdAt: new Date().toISOString(),
  }
  signups.push(signup)
  return signup
}

export function getSubscribers(): Array<NewsletterSignup> {
  return signups
}

export function unsubscribe(email: string): void {
  const target = email.trim().toLowerCase()
  const index = signups.findIndex((s) => s.email === target)
  if (index === -1) throw new Error('Subscriber not found')
  signups.splice(index, 1)
}
