import { AUTH_STORAGE_KEY, authStore } from '#/stores/auth.store'
import type { Role, User } from '#/types'

export function getSession(): User | null {
  return authStore.state.user
}

export function getRole(): Role {
  return authStore.state.user?.role ?? 'guest'
}

export function hasRole(...roles: Array<Role>): boolean {
  return roles.includes(getRole())
}

export function signIn(user: User): void {
  authStore.setState(() => ({ user }))
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
  } catch {
    // Storage may be unavailable; ignore.
  }
}

export function signOut(): void {
  authStore.setState(() => ({ user: null }))
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  } catch {
    // Storage may be unavailable; ignore.
  }
}

// Rehydrates the client session from localStorage (mock auth; client-only).
export function hydrateSession(): User | null {
  if (typeof window === 'undefined') return authStore.state.user
  if (authStore.state.user) return authStore.state.user
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (raw) authStore.setState(() => ({ user: JSON.parse(raw) as User }))
  } catch {
    // Corrupt/unavailable storage; treat as signed out.
  }
  return authStore.state.user
}
