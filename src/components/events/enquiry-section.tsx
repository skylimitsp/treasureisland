import { Clock, Mail, Phone } from 'lucide-react'

import { SectionKicker } from '#/components/shared/section-kicker'
import { RequestForm } from '#/components/events/request-form'
import type { EventCategory } from '#/types'

const RECAP = [
  'Send your date, guest count and vision.',
  'We reply within 48 hours with a tailored proposal.',
  'Confirm with a deposit — no payment is taken here.',
]

// Conversion band: reassurance on the left, the enquiry form on the right.
export function EnquirySection({
  defaults,
}: {
  defaults: { eventType?: EventCategory; packageName?: string }
}) {
  return (
    <section id="enquire" className="page-wrap mt-24 scroll-mt-28">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1fr]">
        <div data-reveal>
          <SectionKicker>Start the conversation</SectionKicker>
          <h2 className="display-title mt-2 text-3xl md:text-4xl">
            Enquire about your <em>celebration</em>.
          </h2>
          <p className="mt-3 text-sea-ink-soft">
            Tell us a little about your day and our events team will craft a
            proposal — nothing is booked or charged from this form.
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

          <dl className="mt-8 space-y-3 text-sm">
            <div className="flex items-center gap-3 text-sea-ink">
              <Clock size={18} className="text-lagoon-deep" aria-hidden />
              <span>Replies within 48 hours</span>
            </div>
            <div className="flex items-center gap-3 text-sea-ink">
              <Mail size={18} className="text-lagoon-deep" aria-hidden />
              <a
                href="mailto:events@treasureisland.example"
                className="underline"
              >
                events@treasureisland.example
              </a>
            </div>
            <div className="flex items-center gap-3 text-sea-ink">
              <Phone size={18} className="text-lagoon-deep" aria-hidden />
              <a href="tel:+10000000000" className="underline">
                +1 (000) 000-0000
              </a>
            </div>
          </dl>
        </div>

        <div data-reveal>
          <RequestForm defaults={defaults} />
        </div>
      </div>
    </section>
  )
}
