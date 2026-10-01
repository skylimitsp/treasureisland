import type { ReactNode } from 'react'

export type ColorBlockTone = 'blush' | 'deep' | 'warm'

// Tone classes per surface; `chip` and `link` keep extras legible on each.
export const COLOR_BLOCK_TONES: Record<
  ColorBlockTone,
  {
    panel: string
    badge: string
    title: string
    body: string
    chip: string
    link: string
  }
> = {
  blush: {
    panel: 'panel-blush',
    badge: 'bg-footer text-white',
    title: 'text-sea-ink',
    body: 'text-sea-ink-soft',
    chip: 'border-line text-sea-ink-soft',
    link: 'text-panel-warm hover:text-sea-ink',
  },
  deep: {
    panel: 'bg-footer',
    badge: 'bg-white/15 text-white',
    title: 'text-white',
    body: 'text-white/80',
    chip: 'border-white/25 text-white/85',
    link: 'text-white hover:text-white/80',
  },
  warm: {
    panel: 'bg-panel-warm',
    badge: 'bg-white text-panel-warm',
    title: 'text-white',
    body: 'text-white/90',
    chip: 'border-white/35 text-white',
    link: 'text-white hover:text-white/80',
  },
}

// One square-edged colour-block panel: badge, title, copy, extras, optional visual.
export function ColorBlockPanel({
  badge,
  title,
  body,
  tone,
  extras,
  children,
}: {
  badge: ReactNode
  title: string
  body: string
  tone: ColorBlockTone
  extras?: ReactNode
  children?: ReactNode
}) {
  const t = COLOR_BLOCK_TONES[tone]
  return (
    <li
      data-reveal
      className={`flex flex-col items-center px-6 pt-8 text-center ${children ? 'min-h-[30rem]' : 'pb-10'} ${t.panel}`}
    >
      <span
        className={`flex size-11 items-center justify-center rounded-full text-sm font-bold ${t.badge}`}
      >
        {badge}
      </span>
      <h3 className={`display-title mt-5 text-xl font-semibold ${t.title}`}>
        {title}
      </h3>
      <p className={`mt-3 max-w-[16rem] text-sm leading-relaxed ${t.body}`}>
        {body}
      </p>
      {extras}
      {children ? (
        <div className="mt-auto flex w-full justify-center pb-8 pt-8">
          {children}
        </div>
      ) : null}
    </li>
  )
}
