import { PageHero } from '#/components/shared/page-hero'

// Gallery hero: the night → day aerial loop behind a short intro.
export function GalleryHero() {
  return (
    <PageHero
      className="min-h-[62vh]"
      image="/photos/aerial-resort.webp"
      video="/videos/hero-home"
      mobileVideo="/videos/hero-home-720"
      kicker="Gallery"
      title={
        <>
          Moments on the <em style={{ color: 'var(--sunset)' }}>island</em>.
        </>
      }
      body="Weddings, parties, sunsets and slow days by the water — photos and films from around Treasure Island Ada."
    />
  )
}
