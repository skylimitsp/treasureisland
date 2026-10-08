import { useState } from 'react'

import { useUpdateStaffMutation } from '#/hooks/mutations/users.mutation'
import { ConfirmDialog } from '#/components/admin/confirm-dialog'

interface StaffStatusToggleProps {
  id: string
  name: string
  active: boolean
  isSelf: boolean
}

// Suspends (signs out everywhere) or reactivates a staff account.
export function StaffStatusToggle({
  id,
  name,
  active,
  isSelf,
}: StaffStatusToggleProps) {
  const mutation = useUpdateStaffMutation()
  const [open, setOpen] = useState(false)

  if (isSelf) return <span className="text-xs text-sea-ink-soft">You</span>

  return (
    <>
      <button
        type="button"
        className={
          active ? 'btn btn-ghost px-3 py-1.5' : 'btn btn-primary px-3 py-1.5'
        }
        onClick={() => setOpen(true)}
      >
        {active ? 'Suspend' : 'Reactivate'}
      </button>
      <ConfirmDialog
        open={open}
        title={active ? `Suspend ${name}?` : `Reactivate ${name}?`}
        message={
          mutation.isError
            ? mutation.error.message
            : active
              ? 'They will be signed out immediately and cannot sign in until reactivated.'
              : 'They will be able to sign in again with their existing password.'
        }
        confirmLabel={active ? 'Suspend' : 'Reactivate'}
        destructive={active}
        busy={mutation.isPending}
        onConfirm={() =>
          mutation.mutate(
            { id, patch: { active: !active } },
            { onSuccess: () => setOpen(false) },
          )
        }
        onCancel={() => {
          mutation.reset()
          setOpen(false)
        }}
      />
    </>
  )
}
