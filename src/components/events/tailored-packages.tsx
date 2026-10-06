import { ArrowRight } from 'lucide-react'

import { SectionKicker } from '#/components/shared/section-kicker'

// Official About-page line in place of invented tiers; the CTA scrolls to the form.
export function TailoredPackages({ onEnquire }: { onEnquire: () => void }) {
  return (
    <section id="packages" className="page-wrap mt-24">
      <div
        data-reveal
        className="island-shell flex flex-col gap-6 rounded-md p-8 md:flex-row md:items-center md:justify-between md:p-10"
      >
        <div className="max-w-2xl">
          <SectionKicker>Tailored packages</SectionKicker>
          <p className="display-title mt-2 text-2xl text-sea-ink md:text-3xl">
            We have great group rates, and customized packages to suit your
            needs.
          </p>
        </div>
        <button
          type="button"
          onClick={onEnquire}
          className="btn btn-primary inline-flex shrink-0 items-center gap-2"
        >
          Ask about packages
          <ArrowRight size={16} aria-hidden />
        </button>
      </div>
    </section>
  )
}
