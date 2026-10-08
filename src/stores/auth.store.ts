import { Store } from '@tanstack/store'
import type { User } from '#/types'

interface AuthState {
  user: User | null
  // 'ready' once /auth/me has answered; the HttpOnly cookie itself is unreadable here.
  status: 'unknown' | 'ready'
}

export const authStore = new Store<AuthState>({ user: null, status: 'unknown' })
