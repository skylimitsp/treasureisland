import { CalendarCheck, FileText, PartyPopper, Send } from 'lucide-react'

import { SectionKicker } from '#/components/shared/section-kicker'
import { ColorBlockPanel } from '#/components/shared/color-block-panel'
import type { ColorBlockTone } from '#/components/shared/color-block-panel'
import type { LucideIcon } from 'lucide-react'

// Four reassuring steps — this is an enquiry, so we set the tone of a conversation.
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
    copy: 'Send your date, guest count and vision.',
  },
  {
    number: '02',
    icon: FileText,
    tone: 'deep',
    title: 'We propose',
    copy: 'A tailored package and quote within 48h.',
  },
  {
    number: '03',
    icon: CalendarCheck,
    tone: 'warm',
    title: 'Confirm',
    copy: 'Lock the date with a deposit and menu.',
  },
  {
    number: '04',
    icon: PartyPopper,
    tone: 'blush',
    title: 'Celebrate',
    copy: 'Our team runs the day; you enjoy it.',
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
          From first hello to the last dance.
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
