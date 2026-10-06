import { Clock, Mail, MessageCircle, Phone } from 'lucide-react'

import { SectionKicker } from '#/components/shared/section-kicker'
import { RequestForm } from '#/components/events/request-form'
import { CONTACT } from '#/constants/site'
import type { EventCategory } from '#/types'

const RECAP = [
  'Send your date, guest count and vision.',
  'Our event consultants get in touch to understand your requirements.',
  'Nothing is booked or charged from this form.',
]

// Conversion band: process + official contact details on the left, the form on the right.
export function EnquirySection({
  defaults,
}: {
  defaults: { eventType?: EventCategory }
}) {
  return (
    <section id="enquire" className="page-wrap mt-24 scroll-mt-28">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1fr]">
        <div data-reveal>
          <SectionKicker>Start the conversation</SectionKicker>
          <h2 className="display-title mt-2 text-3xl md:text-4xl">
            Enquire about your <em>event</em>.
          </h2>
          <p className="mt-3 text-sea-ink-soft">
            Our service philosophy stems from an understanding of your needs and
            our attention to the smallest detail.
          </p>

          <ol className="mt-6 space-y-3">
            {RECAP.map((line, i) => (
              <li key={line} className="flex items-start gap-3 text-sea-ink">
                <span
                  className="flex size-7 shrink-0 items-center justify-center rounded-full bg-lagoon-deep text-sm font-semibold text-white"
                  aria-hidden
                >
                  {i + 1}
                </span>
                {line}
              </li>
            ))}
          </ol>

          <ul className="mt-8 space-y-3 text-sm" aria-label="Contact details">
            <li className="flex items-center gap-3 text-sea-ink">
              <Phone size={18} className="text-lagoon-deep" aria-hidden />
              <span>
                Telephone{' '}
                <a href={CONTACT.phoneHref} className="underline">
                  {CONTACT.phone}
                </a>
              </span>
            </li>
            <li className="flex items-center gap-3 text-sea-ink">
              <MessageCircle
                size={18}
                className="text-lagoon-deep"
                aria-hidden
              />
              <span>
                WhatsApp{' '}
                <a
                  href={CONTACT.whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  {CONTACT.whatsapp}
                </a>
              </span>
            </li>
            <li className="flex items-center gap-3 text-sea-ink">
              <Mail size={18} className="text-lagoon-deep" aria-hidden />
              <a href={`mailto:${CONTACT.email}`} className="underline">
                {CONTACT.email}
              </a>
            </li>
            <li className="flex items-center gap-3 text-sea-ink">
              <Clock size={18} className="text-lagoon-deep" aria-hidden />
              <span>Open {CONTACT.hours}, Monday through Sunday</span>
            </li>
          </ul>
        </div>

        <div data-reveal>
          <RequestForm defaults={defaults} />
        </div>
      </div>
    </section>
  )
}
