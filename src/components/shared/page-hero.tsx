import type { ReactNode } from 'react'

import { SectionKicker } from '#/components/shared/section-kicker'
import { useGsap } from '#/hooks/use-gsap'
import { gsap } from '#/lib/gsap'
import { bgImage } from '#/lib/media'

// Shared inner-page hero: one height (42vh, grows with content), copy straight
// on the photo over a directional scrim — no panel behind the text.
export function PageHero({
  image,
  kicker,
  title,
  body,
  actions,
}: {
  image: string
  kicker: string
  title: ReactNode
  body: string
  actions?: ReactNode
}) {
  const ref = useGsap<HTMLElement>((self) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.from(self.querySelectorAll('[data-hero]'), {
      y: 20,
      opacity: 0,
      duration: 0.9,
      ease: 'expo.out',
      stagger: 0.1,
    })
  })

  return (
    <section
      ref={ref}
      className="relative flex min-h-[42vh] items-center overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(23,58,64,.45) 0%, rgba(23,58,64,0) 32%), linear-gradient(90deg, rgba(23,58,64,.78) 0%, rgba(23,58,64,.5) 55%, rgba(23,58,64,.3) 100%), ${bgImage(image)}`,
      }}
    >
      <div className="page-wrap w-full pb-14 pt-32">
        <div className="max-w-2xl text-white">
          <div data-hero>
            <SectionKicker className="!text-white/85">{kicker}</SectionKicker>
          </div>
          <h1
            data-hero
            className="display-title mt-3 text-4xl text-white [text-shadow:0_2px_24px_rgba(23,58,64,.35)] md:text-6xl"
          >
            {title}
          </h1>
          <p data-hero className="mt-4 max-w-xl text-white/90 md:text-lg">
            {body}
          </p>
          {actions ? (
            <div data-hero className="mt-7 flex flex-wrap gap-3">
              {actions}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
