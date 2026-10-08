/**
 * Staff session on the client, backed by the API's HttpOnly session cookie.
 * @author Joseph Nartey
 * @github devjoemedia
 */
import { authStore } from '#/stores/auth.store'
import { ApiRequestError, api } from '#/lib/api-client'
import type { Role, User } from '#/types'

let inflight: Promise<User | null> | null = null

// Asks the API who is signed in (once per page load unless forced).
export async function loadSession(force = false): Promise<User | null> {
  if (!force && authStore.state.status === 'ready') return authStore.state.user
  inflight ??= api
    .get<User>('/auth/me')
    .catch((error: unknown) => {
      if (error instanceof ApiRequestError && error.status === 401) return null
      throw error
    })
    .then((user) => {
      authStore.setState(() => ({ user, status: 'ready' }))
      return user
    })
    .finally(() => {
      inflight = null
    })
  return inflight
}

export function getSession(): User | null {
  return authStore.state.user
}

export function getRole(): Role {
  return authStore.state.user?.role ?? 'guest'
}

export function hasRole(...roles: Array<Role>): boolean {
  return roles.includes(getRole())
}

export async function login(email: string, password: string): Promise<User> {
  const user = await api.post<User>('/auth/login', { email, password })
  authStore.setState(() => ({ user, status: 'ready' }))
  return user
}

export async function acceptInvite(
  token: string,
  name: string,
  password: string,
) {
  const user = await api.post<User>('/auth/invites/accept', {
    token,
    name,
    password,
  })
  authStore.setState(() => ({ user, status: 'ready' }))
  return user
}

export async function signOut(): Promise<void> {
  try {
    await api.post('/auth/logout')
  } finally {
    authStore.setState(() => ({ user: null, status: 'ready' }))
  }
}
