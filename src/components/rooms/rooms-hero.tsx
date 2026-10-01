import { PageHero } from '#/components/shared/page-hero'

// Hero atop the Rooms list — sets the shared inner-page hero height.
export function RoomsHero() {
  return (
    <PageHero
      image="/rooms/room-1.webp"
      kicker="Stay with us"
      title={
        <>
          Rooms &amp; villas built around the <em>light</em>.
        </>
      }
      body="Overwater villas, sunset suites, and garden bungalows — each with a private stretch of the island."
    />
  )
}
