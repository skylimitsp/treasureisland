import { useState } from 'react'

import { formatStayDate } from '#/lib/format'
import { useInvitesQuery } from '#/hooks/queries/users.query'
import { useRevokeInviteMutation } from '#/hooks/mutations/users.mutation'
import { ConfirmDialog } from '#/components/admin/confirm-dialog'
import { CopyLinkField } from '#/components/admin/copy-link-field'
import { StatusBadge } from '#/components/admin/status-badge'
import type { PendingInvite } from '#/types'

// Invites not yet accepted, each with its link to copy or share until it's used or expires.
export function PendingInvites() {
  const invites = useInvitesQuery()
  const revoke = useRevokeInviteMutation()
  const [target, setTarget] = useState<PendingInvite | null>(null)

  if (invites.isPending) {
    return <p className="mb-6 text-sm text-sea-ink-soft">Loading invites…</p>
  }
  if (invites.isError) {
    return (
      <p className="mb-6 text-sm text-destructive">{invites.error.message}</p>
    )
  }

  return (
    <section
      className="island-shell mb-6 rounded-md p-5"
      aria-labelledby="pending-invites"
    >
      <h2 id="pending-invites" className="display-title text-lg text-sea-ink">
        Pending invites
      </h2>
      <p className="mt-1 text-sm text-sea-ink-soft">
        Send each person their link. It works once and expires after 7 days;
        accepted invites move to the staff list below.
      </p>

      {invites.data.length === 0 ? (
        <p className="mt-4 text-sm text-sea-ink-soft">No pending invites.</p>
      ) : (
        <ul className="mt-4 divide-y divide-line">
          {invites.data.map((invite) => (
            <li key={invite.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="truncate font-semibold text-sea-ink">
                    {invite.email}
                  </span>
                  <StatusBadge
                    status={invite.role}
                    tone={invite.role === 'admin' ? 'positive' : 'info'}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-ghost px-3 py-1.5"
                  onClick={() => setTarget(invite)}
                >
                  Revoke
                </button>
              </div>
              <p className="mt-1 text-xs text-sea-ink-soft">
                {invite.invitedBy ? `Invited by ${invite.invitedBy} · ` : ''}
                Expires {formatStayDate(invite.expiresAt)}
              </p>
              <div className="mt-3">
                {invite.link ? (
                  <CopyLinkField
                    link={invite.link}
                    shareText="You're invited to the Treasure Island Ada staff dashboard. Open this link to set your password:"
                  />
                ) : (
                  <p className="text-sm text-sea-ink-soft">
                    This invite was created during setup, so its link isn't
                    stored here. Revoke it and invite again to get a link.
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={target !== null}
        title="Revoke this invite?"
        message={
          revoke.isError
            ? revoke.error.message
            : `The link sent to ${target?.email ?? ''} will stop working immediately.`
        }
        confirmLabel="Revoke"
        destructive
        busy={revoke.isPending}
        onConfirm={() =>
          target &&
          revoke.mutate(target.id, { onSuccess: () => setTarget(null) })
        }
        onCancel={() => {
          revoke.reset()
          setTarget(null)
        }}
      />
    </section>
  )
}
