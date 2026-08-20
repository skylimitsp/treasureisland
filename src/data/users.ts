import type { Role, User } from '#/types'

// Mock staff records — the API swap seam. Powers the login role-picker and the
// Staff module; going live swaps each accessor body for an httpClient call.
const USERS: Array<User> = [
  {
    id: 'u1',
    name: 'Amara Mensah',
    email: 'amara@treasureisland.example',
    role: 'admin',
    avatar: '/about/host.jpg',
  },
  {
    id: 'u2',
    name: 'Kofi Boateng',
    email: 'kofi@treasureisland.example',
    role: 'concierge',
  },
  {
    id: 'u3',
    name: 'Lena Park',
    email: 'lena@treasureisland.example',
    role: 'concierge',
  },
]

export function getUsers(): Array<User> {
  return USERS
}

export function getUserByRole(role: Role): User | undefined {
  return USERS.find((u) => u.role === role)
}

export function updateUserRole(id: string, role: Role): User {
  const user = USERS.find((u) => u.id === id)
  if (!user) throw new Error('User not found')
  user.role = role
  return user
}
