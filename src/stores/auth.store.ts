import { Store } from '@tanstack/store'
import type { User } from '#/types'

export const AUTH_STORAGE_KEY = 'ti-auth'

interface AuthState {
  user: User | null
}

// Light client-side session; persisted to localStorage by `lib/auth`.
export const authStore = new Store<AuthState>({ user: null })
