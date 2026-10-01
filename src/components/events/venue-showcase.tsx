import { SectionKicker } from '#/components/shared/section-kicker'

// The three spaces we host in, each with a pinned capacity badge.
const VENUES = [
  {
    name: 'Beachfront lawn',
    setting: 'Open sand-edge lawn to the water.',
    capacity: 'up to 180 seated',
    bestFor: 'Ceremonies, grand parties',
    image: '/photos/aerial-resort.webp',
    speed: '0.85',
  },
  {
    name: 'Ocean terrace',
    setting: 'Covered terrace, sunset-facing.',
    capacity: 'up to 90',
    bestFor: 'Receptions, cocktails',
    image: '/photos/lantern-terrace.webp',
    speed: '1.15',
  },
  {
    name: 'Dining hall',
    setting: 'Indoor, climate-controlled.',
    capacity: 'up to 120',
    bestFor: 'Dinners, meetings, wet-weather',
    image: '/photos/ocean-deck-dining.webp',
    speed: '1.0',
  },
]

export function VenueShowcase() {
  return (
    <section id="venues" className="mt-24 bg-foam/60 py-20">
      <div className="page-wrap--wide">
        <div className="max-w-2xl">
          <SectionKicker>Spaces</SectionKicker>
          <h2 className="display-title mt-2 text-3xl md:text-4xl">
            Three settings, <em>one</em> shoreline.
          </h2>
          <p className="mt-3 text-sea-ink-soft">
            From an open lawn to a climate-controlled hall — every booking has a
            wet-weather plan.
          </p>
        </div>

        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {VENUES.map((venue, i) => (
            <li
              key={venue.name}
              data-reveal
              className={i === 1 ? 'md:mt-10' : i === 2 ? 'md:mt-4' : ''}
            >
              <div className="img-frame relative aspect-[4/5] overflow-hidden rounded-md border border-line">
                <img
                  src={venue.image}
                  alt={`${venue.name} — ${venue.setting}`}
                  loading="lazy"
                  decoding="async"
                  data-speed={venue.speed}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <span className="price-badge absolute left-3 top-3 !bg-white/90">
                  {venue.capacity}
                </span>
              </div>
              <h3 className="display-title mt-4 text-xl">{venue.name}</h3>
              <p className="mt-1 text-sm text-sea-ink-soft">
                Best for {venue.bestFor.toLowerCase()}.
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
