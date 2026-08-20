import { useUpdateEnquiryStatusMutation } from '#/hooks/mutations/enquiries.mutation'
import type { EnquiryStatus } from '#/types'

const STATUSES: Array<EnquiryStatus> = ['new', 'contacted', 'closed']

interface EnquiryStatusSelectProps {
  id: string
  status: EnquiryStatus
}

// Inline pipeline control — advances one enquiry's status.
export function EnquiryStatusSelect({ id, status }: EnquiryStatusSelectProps) {
  const mutation = useUpdateEnquiryStatusMutation()
  return (
    <select
      value={status}
      disabled={mutation.isPending}
      onChange={(e) =>
        mutation.mutate({ id, status: e.target.value as EnquiryStatus })
      }
      className="rounded-md border border-line bg-[color:var(--surface)] px-2.5 py-1.5 text-sm text-sea-ink capitalize outline-none focus:border-lagoon"
    >
      {STATUSES.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}
