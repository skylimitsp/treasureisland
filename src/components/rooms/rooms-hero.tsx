import { PageHero } from '#/components/shared/page-hero'

// Hero atop the Rooms list — sets the shared inner-page hero height.
export function RoomsHero() {
  return (
    <PageHero
      image="/rooms/room-1.webp"
      kicker="Stay with us"
      title={
        <>
          Rooms, suites &amp; <em>penthouses</em>.
        </>
      }
      body="Ten room types, from standard and waterfront rooms to family chalets and penthouses — on a private island near the estuary of the Atlantic Ocean and Volta River."
    />
  )
}
