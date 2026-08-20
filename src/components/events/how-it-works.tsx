import { SectionKicker } from '#/components/shared/section-kicker'
import { StepItem } from '#/components/events/step-item'

// Four reassuring steps — this is an enquiry, so we set the tone of a conversation.
const STEPS = [
  {
    number: '01',
    title: 'Enquire',
    copy: 'Send your date, guest count and vision.',
  },
  {
    number: '02',
    title: 'We propose',
    copy: 'A tailored package and quote within 48h.',
  },
  {
    number: '03',
    title: 'Confirm',
    copy: 'Lock the date with a deposit and menu.',
  },
  {
    number: '04',
    title: 'Celebrate',
    copy: 'Our team runs the day; you enjoy it.',
  },
]

export function HowItWorks() {
  return (
    <section className="page-wrap mt-24">
      <div className="max-w-2xl">
        <SectionKicker>How it works</SectionKicker>
        <h2 className="display-title mt-2 text-3xl md:text-4xl">
          From first hello to the last dance.
        </h2>
      </div>
      <ol className="mt-10 grid gap-8 md:grid-cols-4">
        {STEPS.map((step) => (
          <StepItem
            key={step.number}
            number={step.number}
            title={step.title}
            copy={step.copy}
          />
        ))}
      </ol>
    </section>
  )
}
