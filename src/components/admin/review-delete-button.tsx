import { useState } from 'react'
import { Trash2 } from 'lucide-react'

import { useDeleteReviewMutation } from '#/hooks/mutations/reviews.mutation'
import { ConfirmDialog } from '#/components/admin/confirm-dialog'

// Row action: permanently deletes a review after confirmation.
export function ReviewDeleteButton({ id, name }: { id: string; name: string }) {
  const remove = useDeleteReviewMutation()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        aria-label={`Delete review by ${name}`}
        className="flex size-9 items-center justify-center rounded-full text-sea-ink-soft hover:bg-red-500/10 hover:text-red-600"
        onClick={() => setOpen(true)}
      >
        <Trash2 size={16} aria-hidden />
      </button>
      <ConfirmDialog
        open={open}
        title="Delete this review?"
        message={
          remove.isError
            ? remove.error.message
            : `The review by ${name} will be removed from the dashboard and the website. This can't be undone.`
        }
        confirmLabel="Delete"
        destructive
        busy={remove.isPending}
        onConfirm={() => remove.mutate(id, { onSuccess: () => setOpen(false) })}
        onCancel={() => {
          remove.reset()
          setOpen(false)
        }}
      />
    </>
  )
}
