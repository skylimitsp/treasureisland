import { Plus } from 'lucide-react'

import { SectionKicker } from '#/components/shared/section-kicker'

// Native details/summary accordion of celebration questions + a help panel.
const FAQS = [
  {
    q: 'Do you cater in-house?',
    a: 'Yes — our kitchen handles everything from canapés to plated dinners, and we accommodate dietary and cultural menus. External caterers are welcome by arrangement.',
  },
  {
    q: 'What are the guest counts?',
    a: 'Minimums and maximums vary by venue (up to 180 on the lawn, 90 on the terrace, 120 in the hall). Final numbers are confirmed 14 days out.',
  },
  {
    q: 'Can we bring our own vendors?',
    a: 'We keep a preferred list of florists, DJs and celebrants, but external vendors are welcome provided they carry their own insurance.',
  },
  {
    q: 'Are accommodation blocks available?',
    a: 'We hold room blocks and group rates for your guests so everyone can stay on the island. Ask us and we will reserve a block alongside your date.',
  },
  {
    q: 'How do deposits and cancellation work?',
    a: 'A deposit confirms your date, with the balance due before the event. Cancellation is on a sliding scale — the earlier you tell us, the more is refundable.',
  },
  {
    q: 'What happens if it rains?',
    a: 'Every outdoor booking includes a wet-weather plan in the climate-controlled dining hall, so your celebration goes ahead whatever the sky does.',
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
        <div className="mt-6 divide-y divide-[color:var(--line)] border-y border-line">
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

      <aside
        data-reveal
        className="island-shell h-fit rounded-md p-6 md:sticky md:top-28"
      >
        <h3 className="display-title text-xl">Not finding what you need?</h3>
        <p className="mt-2 text-sm text-sea-ink-soft">
          Our events team is happy to answer anything and help shape your day.
        </p>
        <button
          type="button"
          onClick={scrollToEnquire}
          className="btn btn-primary mt-5"
        >
          Send an enquiry
        </button>
      </aside>
    </section>
  )
}
