import { CalendarCheck, MessagesSquare, PartyPopper, Send } from 'lucide-react'

import { SectionKicker } from '#/components/shared/section-kicker'
import { ColorBlockPanel } from '#/components/shared/color-block-panel'
import type { ColorBlockTone } from '#/components/shared/color-block-panel'
import type { LucideIcon } from 'lucide-react'

// Generic enquiry flow; steps 02–04 quote the official Events & Meetings copy.
const STEPS: Array<{
  number: string
  icon: LucideIcon
  title: string
  copy: string
  tone: ColorBlockTone
}> = [
  {
    number: '01',
    icon: Send,
    tone: 'blush',
    title: 'Enquire',
    copy: 'Send us your date, guest count and vision.',
  },
  {
    number: '02',
    icon: MessagesSquare,
    tone: 'deep',
    title: 'We get in touch',
    copy: 'Specially dedicated event consultants will understand your requirements.',
  },
  {
    number: '03',
    icon: CalendarCheck,
    tone: 'warm',
    title: 'Plan',
    copy: 'We help you choose the most suitable destination and plan the event to the smallest detail.',
  },
  {
    number: '04',
    icon: PartyPopper,
    tone: 'blush',
    title: 'Celebrate',
    copy: 'Our warm and friendly staff will make every effort to ensure your event is memorable and successful.',
  },
]

// Oversized faded numeral fills the panel's visual slot (tone-aware ink).
const NUMERAL_INK: Record<ColorBlockTone, string> = {
  blush: 'text-footer/15',
  deep: 'text-white/15',
  warm: 'text-white/25',
}

export function HowItWorks() {
  return (
    <section className="page-wrap mt-24">
      <div className="max-w-2xl">
        <SectionKicker>How it works</SectionKicker>
        <h2 className="display-title mt-2 text-3xl md:text-4xl">
          From enquiry to the <em>day</em> itself.
        </h2>
      </div>
      <ol className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(({ number, icon: Icon, tone, title, copy }) => (
          <ColorBlockPanel
            key={number}
            tone={tone}
            badge={<Icon size={18} aria-hidden />}
            title={title}
            body={copy}
          >
            <span
              aria-hidden
              className={`display-title select-none text-[8rem] leading-none ${NUMERAL_INK[tone]}`}
            >
              {number}
            </span>
          </ColorBlockPanel>
        ))}
      </ol>
    </section>
  )
}
