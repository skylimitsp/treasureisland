import { SectionKicker } from '#/components/shared/section-kicker'
import { useGsap } from '#/hooks/use-gsap'
import { gsap } from '#/lib/gsap'

// Smooth-scrolls to an in-page anchor (honours reduced motion via the browser).
function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

// Celebratory hero with a fixed-feel beach background and frosted headline panel.
export function EventsHero() {
  const ref = useGsap<HTMLElement>((self) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const items = self.querySelectorAll('[data-hero]')
    gsap.from(items, {
      y: 24,
      opacity: 0,
      duration: 1,
      ease: 'expo.out',
      stagger: 0.12,
    })
  })

  return (
    <section
      ref={ref}
      data-fixed-band
      className="relative flex min-h-[82vh] items-center overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(23,58,64,.62) 0%, rgba(23,58,64,.28) 62%), url('/events/lawn.jpg')",
      }}
    >
      <div className="page-wrap w-full py-28">
        <div className="max-w-2xl">
          <div data-hero>
            <SectionKicker className="!text-white/85">
              Celebrations by the sea
            </SectionKicker>
          </div>
          <h1
            data-hero
            className="display-title mt-4 text-5xl leading-[1.03] text-white [text-shadow:0_2px_24px_rgba(23,58,64,.35)] md:text-7xl"
          >
            Say yes where the <em style={{ color: 'var(--sunset)' }}>ocean</em>{' '}
            begins.
          </h1>
          <p data-hero className="mt-5 max-w-xl text-lg text-white/90">
            Weddings, birthdays and gatherings on a private beachfront —
            barefoot luxury, planned end to end by our island team.
          </p>
          <div data-hero className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => scrollToId('enquire')}
              className="btn btn-primary"
            >
              Request a date
            </button>
            <button
              type="button"
              onClick={() => scrollToId('venues')}
              className="btn btn-ghost !border-white/70 !text-white"
            >
              See venues
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
