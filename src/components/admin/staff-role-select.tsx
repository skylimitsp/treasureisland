import { useState } from 'react'

import { useUpdateStaffMutation } from '#/hooks/mutations/users.mutation'
import { ConfirmDialog } from '#/components/admin/confirm-dialog'
import type { StaffRole } from '#/types'

const ROLES: Array<StaffRole> = ['concierge', 'admin']

interface StaffRoleSelectProps {
  id: string
  name: string
  role: StaffRole
}

// Role changer with a double-confirm (sensitive action).
export function StaffRoleSelect({ id, name, role }: StaffRoleSelectProps) {
  const mutation = useUpdateStaffMutation()
  const [pending, setPending] = useState<StaffRole | null>(null)

  return (
    <>
      <select
        value={role}
        aria-label={`Role for ${name}`}
        disabled={mutation.isPending}
        onChange={(e) => setPending(e.target.value as StaffRole)}
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
        message={
          mutation.isError
            ? mutation.error.message
            : `${name} will be set to “${pending}”. This changes their access immediately.`
        }
        confirmLabel="Change role"
        destructive
        busy={mutation.isPending}
        onConfirm={() =>
          pending &&
          mutation.mutate(
            { id, patch: { role: pending } },
            { onSuccess: () => setPending(null) },
          )
        }
        onCancel={() => {
          mutation.reset()
          setPending(null)
        }}
      />
    </>
  )
}
