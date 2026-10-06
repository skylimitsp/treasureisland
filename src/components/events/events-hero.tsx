import { PageHero } from '#/components/shared/page-hero'

// Smooth-scrolls to an in-page anchor (honours reduced motion via the browser).
function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

// Events hero (official copy): shared inner-page hero with enquiry + spaces CTAs.
export function EventsHero() {
  return (
    <PageHero
      image="/photos/infinity-lounge.webp"
      video="/videos/hero-aerial-night"
      mobileVideo="/videos/hero-aerial-night-720"
      kicker="Events & Meetings"
      title={
        <>
          Weddings, parties &amp;{' '}
          <em style={{ color: 'var(--sunset)' }}>meetings</em>.
        </>
      }
      body="Treasure Island Resort offers an environment perfectly designed for successful events."
      actions={
        <>
          <button
            type="button"
            onClick={() => scrollToId('enquire')}
            className="btn btn-primary"
          >
            Send an enquiry
          </button>
          <button
            type="button"
            onClick={() => scrollToId('venues')}
            className="btn btn-ghost !border-white/70 !text-white"
          >
            See our spaces
          </button>
        </>
      }
    />
  )
}
