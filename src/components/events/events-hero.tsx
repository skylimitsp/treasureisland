import { PageHero } from '#/components/shared/page-hero'

// Smooth-scrolls to an in-page anchor (honours reduced motion via the browser).
function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

// Celebrations hero: shared inner-page hero with enquiry + venue CTAs.
export function EventsHero() {
  return (
    <PageHero
      image="/photos/infinity-lounge.webp"
      kicker="Celebrations by the sea"
      title={
        <>
          Say yes where the <em style={{ color: 'var(--sunset)' }}>ocean</em>{' '}
          begins.
        </>
      }
      body="Weddings, birthdays and gatherings on a private beachfront — barefoot luxury, planned end to end by our island team."
      actions={
        <>
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
        </>
      }
    />
  )
}
