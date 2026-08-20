import { useMutation, useQueryClient } from '@tanstack/react-query'

import { withErrorHandling } from '#/lib/errors'
import { updateUserRole } from '#/data/users'
import { userKeys } from '#/hooks/queries/users.query'
import type { Role, User } from '#/types'

interface RoleChange {
  id: string
  role: Role
}

const doUpdateRole = withErrorHandling(
  async ({ id, role }: RoleChange): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return updateUserRole(id, role) // ← swap for httpClient.patch(...)
  },
  'Unable to update this role',
)

/**
 * Changes a staff member's role (admin-only, double-confirmed).
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useUpdateUserRoleMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: doUpdateRole,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
  })
}
