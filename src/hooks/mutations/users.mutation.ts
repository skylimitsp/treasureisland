import { useMutation, useQueryClient } from '@tanstack/react-query'

import { withErrorHandling } from '#/lib/errors'
import { api } from '#/lib/api-client'
import { userKeys } from '#/hooks/queries/users.query'
import type { StaffMember, StaffRole } from '#/types'

interface StaffChange {
  id: string
  patch: { role?: StaffRole; active?: boolean }
}

const doUpdateStaff = withErrorHandling(
  async ({ id, patch }: StaffChange): Promise<StaffMember> =>
    api.patch(`/admin/users/${id}`, patch),
  'Unable to update this staff member',
)

const doInvite = withErrorHandling(
  async (input: { email: string; role: StaffRole }) =>
    api.post<{ email: string; role: StaffRole; link: string }>(
      '/admin/users/invite',
      input,
    ),
  'Unable to create the invite',
)

const doRevoke = withErrorHandling(
  async (id: string): Promise<void> => api.delete(`/admin/users/invites/${id}`),
  'Unable to revoke the invite',
)

/**
 * Changes a staff member's role or suspends/reactivates them (admin only).
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useUpdateStaffMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: doUpdateStaff,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
  })
}

/**
 * Creates a one-time invite; the link is returned to share (and emailed when set up).
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useInviteStaffMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: doInvite,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: userKeys.invites() }),
  })
}

/**
 * Revokes a pending invite so its link stops working.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useRevokeInviteMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: doRevoke,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: userKeys.invites() }),
  })
}
