import { Plus } from 'lucide-react'

import { SectionKicker } from '#/components/shared/section-kicker'
import { CONTACT } from '#/constants/site'

// Only answers backed by the official site (contact, hours, location, getting here).
const FAQS = [
  {
    q: 'How do I enquire about an event?',
    a: `Call us on ${CONTACT.phone}, message us on WhatsApp at ${CONTACT.whatsapp} or email ${CONTACT.email} — or use the enquiry form on this page.`,
  },
  {
    q: 'Do you offer group rates?',
    a: 'We have great group rates, and customized packages to suit your needs.',
  },
  {
    q: 'When are you open?',
    a: 'Visit us any day. Monday through Sunday 24/7 to experience our various types of services and amenities. A warm welcome awaits you.',
  },
  {
    q: 'Where is Treasure Island?',
    a: 'Ada Foah, Volta Region, Ghana — on a private island near the estuary of the Atlantic Ocean & Volta River.',
  },
  {
    q: 'How do we get there?',
    a: 'By road from Accra it is roughly 100 km, about 2 hours. Tro-tros (shared minibuses) run from major stations including Accra’s Tema Station; taxis or private cars offer direct routes. The resort is on an island in the Volta River, so the journey involves crossing the river: local ferries depart from points along the Volta, and chartered motorboats suit groups.',
  },
]

function scrollToEnquire() {
  document.getElementById('enquire')?.scrollIntoView({ behavior: 'smooth' })
}

export function EventsFaq() {
  return (
    <section className="page-wrap mt-24 grid gap-10 md:grid-cols-[1.4fr_0.8fr]">
      <div>
        <SectionKicker>Good to know</SectionKicker>
        <h2 className="display-title mt-2 text-3xl md:text-4xl">
          Questions, answered.
        </h2>
        <div className="mt-6 divide-y divide-line border-y border-line">
          {FAQS.map((faq) => (
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
          Specially dedicated event consultants will understand your
          requirements.
        </p>
        <button
          type="button"
          onClick={scrollToEnquire}
          className="btn btn-primary mt-5"
        >
          Send an enquiry
        </button>
      </div>
    </section>
  )
}
