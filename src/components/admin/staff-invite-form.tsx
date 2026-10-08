import { useState } from 'react'
import { MailPlus } from 'lucide-react'

import { useInviteStaffMutation } from '#/hooks/mutations/users.mutation'
import type { StaffRole } from '#/types'

// Sends a 72-hour invite link; the new member sets their own name and password.
export function StaffInviteForm() {
  const invite = useInviteStaffMutation()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<StaffRole>('concierge')

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    invite.mutate(
      { email: email.trim(), role },
      { onSuccess: () => setEmail('') },
    )
  }

  return (
    <form onSubmit={onSubmit} className="island-shell mb-6 rounded-md p-5">
      <h2 className="display-title text-lg text-sea-ink">
        Invite a staff member
      </h2>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => {
              invite.reset()
              setEmail(e.target.value)
            }}
            placeholder="name@treasureislandghana.com"
            className="min-h-11 w-full rounded-md border border-line bg-[color:var(--surface)] px-3 py-2 text-sea-ink outline-none focus:border-lagoon"
          />
        </label>
        <label>
          <span className="sr-only">Role</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as StaffRole)}
            className="min-h-11 w-full rounded-md border border-line bg-[color:var(--surface)] px-3 py-2 text-sea-ink capitalize outline-none focus:border-lagoon sm:w-40"
          >
            <option value="concierge">Concierge</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <button
          type="submit"
          disabled={invite.isPending}
          className="btn btn-primary disabled:opacity-60"
        >
          <MailPlus size={16} aria-hidden />
          {invite.isPending ? 'Sending…' : 'Send invite'}
        </button>
      </div>
      <p aria-live="polite" className="mt-2 min-h-5 text-sm">
        {invite.isSuccess ? (
          <span className="text-palm">
            Invite sent to {invite.data.email}. The link expires in 72 hours.
          </span>
        ) : invite.isError ? (
          <span className="text-destructive">{invite.error.message}</span>
        ) : null}
      </p>
    </form>
  )
}
