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
    api.post<{ email: string; role: StaffRole }>('/admin/users/invite', input),
  'Unable to send the invite',
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
 * Emails a one-time invite link to a new staff member.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useInviteStaffMutation = () =>
  useMutation({ mutationFn: doInvite })
