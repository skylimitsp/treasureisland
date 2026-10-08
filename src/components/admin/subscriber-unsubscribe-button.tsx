import { useState } from 'react'

import { useUnsubscribeMutation } from '#/hooks/mutations/subscribers.mutation'
import { ConfirmDialog } from '#/components/admin/confirm-dialog'

// Row action: unsubscribes an address after confirmation.
export function SubscriberUnsubscribeButton({
  id,
  email,
}: {
  id: string
  email: string
}) {
  const mutation = useUnsubscribeMutation()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        className="btn btn-ghost px-3 py-1.5"
        onClick={() => setOpen(true)}
      >
        Unsubscribe
      </button>
      <ConfirmDialog
        open={open}
        title="Unsubscribe this address?"
        message={`${email} will be removed from the newsletter list.`}
        confirmLabel="Unsubscribe"
        destructive
        busy={mutation.isPending}
        onConfirm={() =>
          mutation.mutate(id, { onSuccess: () => setOpen(false) })
        }
        onCancel={() => setOpen(false)}
      />
    </>
  )
}
