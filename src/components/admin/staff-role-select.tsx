import { useState } from 'react'

import { useUpdateUserRoleMutation } from '#/hooks/mutations/users.mutation'
import { ConfirmDialog } from '#/components/admin/confirm-dialog'
import type { Role } from '#/types'

const ROLES: Array<Role> = ['guest', 'concierge', 'admin']

interface StaffRoleSelectProps {
  id: string
  name: string
  role: Role
}

// Role changer with a double-confirm (sensitive action).
export function StaffRoleSelect({ id, name, role }: StaffRoleSelectProps) {
  const mutation = useUpdateUserRoleMutation()
  const [pending, setPending] = useState<Role | null>(null)

  return (
    <>
      <select
        value={role}
        disabled={mutation.isPending}
        onChange={(e) => setPending(e.target.value as Role)}
        className="rounded-md border border-line bg-[color:var(--surface)] px-2.5 py-1.5 text-sm text-sea-ink capitalize outline-none focus:border-lagoon"
      >
        {ROLES.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ConfirmDialog
        open={pending !== null}
        title="Change this role?"
        message={`${name} will be set to “${pending}”. This changes their access immediately.`}
        confirmLabel="Change role"
        destructive
        busy={mutation.isPending}
        onConfirm={() =>
          pending &&
          mutation.mutate(
            { id, role: pending },
            { onSuccess: () => setPending(null) },
          )
        }
        onCancel={() => setPending(null)}
      />
    </>
  )
}
