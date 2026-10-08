import { Mail, MessageCircle, Phone } from 'lucide-react'

import { formatStayDate } from '#/lib/format'
import { EntityDrawer } from '#/components/admin/entity-drawer'
import { EnquiryStatusSelect } from '#/components/admin/enquiry-status-select'
import type { EventEnquiry } from '#/types'

const TYPE_LABELS: Record<string, string> = {
  weddings: 'Wedding',
  birthdays: 'Birthday party',
  family: 'Family party',
  meetings: 'Meetings & Events',
}

// wa.me needs international digits; local Ghana numbers (0XX…) are assumed +233.
function waNumber(phone: string) {
  const digits = phone.replace(/\D/g, '')
  return phone.trim().startsWith('0') ? `233${digits.slice(1)}` : digits
}

// Everything staff need to follow up on one enquiry, with one-tap contact actions.
export function EnquiryDetailDrawer({
  enquiry,
  onClose,
}: {
  enquiry: EventEnquiry | null
  onClose: () => void
}) {
  if (!enquiry) return null
  const greeting = `Hello ${enquiry.name.split(' ')[0]}, thank you for your enquiry (${enquiry.id}) with Treasure Island Ada.`
  return (
    <EntityDrawer
      open
      title={enquiry.name}
      description={`${enquiry.id} · received ${formatStayDate(enquiry.createdAt)}`}
      onClose={onClose}
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-sea-ink-soft">Status</span>
          <EnquiryStatusSelect id={enquiry.id} status={enquiry.status} />
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <a
            href={`mailto:${enquiry.email}?subject=${encodeURIComponent(`Your enquiry ${enquiry.id}`)}`}
            className="btn btn-ghost"
          >
            <Mail size={16} aria-hidden /> Email
          </a>
          <a
            href={`tel:${enquiry.phone.replace(/[^\d+]/g, '')}`}
            className="btn btn-ghost"
          >
            <Phone size={16} aria-hidden /> Call
          </a>
          <a
            href={`https://wa.me/${waNumber(enquiry.phone)}?text=${encodeURIComponent(greeting)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            <MessageCircle size={16} aria-hidden /> WhatsApp
          </a>
        </div>

        <dl className="space-y-3 text-sm">
          {[
            ['Event', TYPE_LABELS[enquiry.eventType] ?? enquiry.eventType],
            [
              'Preferred date',
              `${formatStayDate(enquiry.date)}${enquiry.flexibleDates ? ' (flexible)' : ''}`,
            ],
            ['Guests', String(enquiry.guests)],
            ['Budget', enquiry.budget ?? 'Not given'],
            ['Email', enquiry.email],
            ['Phone', enquiry.phone],
          ].map(([label, value]) => (
            <div key={label} className="flex items-start justify-between gap-4">
              <dt className="text-sea-ink-soft">{label}</dt>
              <dd className="text-right font-medium break-all text-sea-ink">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <div>
          <p className="island-kicker">Their message</p>
          <p className="mt-2 rounded-md border border-line p-3 text-sm whitespace-pre-wrap text-sea-ink">
            {enquiry.message || 'No message left.'}
          </p>
        </div>
      </div>
    </EntityDrawer>
  )
}
