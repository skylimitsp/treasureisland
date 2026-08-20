import { SectionKicker } from '#/components/shared/section-kicker'

// Short full-bleed band atop the Rooms list (not the tall landing hero).
export function RoomsHero() {
  return (
    <section
      className="relative flex min-h-[42vh] items-center overflow-hidden bg-cover bg-center px-4 pt-24"
      style={{
        backgroundImage:
          "linear-gradient(rgba(23,58,64,.5), rgba(23,58,64,.5)), url('/rooms/room1.jpg')",
      }}
    >
      <div className="page-wrap text-white">
        <SectionKicker className="!text-white/85">Stay with us</SectionKicker>
        <h1 className="display-title mt-3 text-4xl text-white md:text-6xl">
          Rooms &amp; villas built around the <em>light</em>.
        </h1>
        <p className="mt-4 max-w-xl text-white/85">
          Overwater villas, sunset suites, and garden bungalows — each with a
          private stretch of the island.
        </p>
      </div>
    </section>
  )
}
