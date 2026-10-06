import { Phone, Plus } from 'lucide-react'

import { SectionKicker } from '#/components/shared/section-kicker'
import { useFaqsQuery } from '#/hooks/queries/content.query'
import { CONTACT } from '#/constants/site'

// FAQ accordion (native details/summary) beside a "need help?" panel.
export function Faq() {
  const faqs = useFaqsQuery()

  return (
    <section className="page-wrap mt-28 grid gap-10 md:grid-cols-[1.4fr_0.8fr]">
      <div>
        <SectionKicker>Good to know</SectionKicker>
        <h2 className="display-title mt-2 text-3xl md:text-4xl">
          Frequently asked questions
        </h2>
        <div className="mt-6 divide-y divide-line border-y border-line">
          {(faqs.data ?? []).map((faq) => (
            <details key={faq.q} data-reveal className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-sea-ink">
                <span className="display-title text-lg">{faq.q}</span>
                <Plus
                  size={18}
                  className="shrink-0 transition-transform group-open:rotate-45"
                  aria-hidden
                />
              </summary>
              <p className="mt-3 max-w-prose text-sea-ink-soft">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>

      <div
        data-reveal
        className="island-shell h-fit rounded-md p-6 md:sticky md:top-28"
      >
        <h3 className="display-title text-xl">Not finding what you need?</h3>
        <p className="mt-2 text-sm text-sea-ink-soft">
          We are open {CONTACT.hours.toLowerCase()} — call, WhatsApp or email
          our reservations team.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href={CONTACT.phoneHref} className="btn btn-primary no-underline">
            <Phone size={16} aria-hidden /> Call us
          </a>
          <a
            href={`mailto:${CONTACT.email}`}
            className="btn btn-ghost no-underline"
          >
            Email
          </a>
        </div>
      </div>
    </section>
  )
}
