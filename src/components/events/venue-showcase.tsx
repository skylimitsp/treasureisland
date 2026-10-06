import { SectionKicker } from '#/components/shared/section-kicker'
import { ResponsiveImage } from '#/components/shared/responsive-image'

// Spaces named in the official copy only; no capacities until the resort publishes them.
const SPACES = [
  {
    name: 'Indoor & outdoor banquet rooms',
    caption:
      'A wedding at Treasure Island Resort ensures gorgeous choices for indoor and outdoor banquet rooms.',
    image: '/photos/lantern-terrace.webp',
    speed: '0.85',
  },
  {
    name: 'Conference centre',
    caption:
      'Tranquil and aesthetically pleasing surroundings to refresh the mind and focus attention.',
    image: '/photos/conference-hall.webp',
    speed: '1.15',
  },
  {
    name: 'Pool & waterfront cabanas',
    caption:
      'Watch the sun rise or set from the beach front cabanas while sipping on your favorite drinks or just relaxing.',
    image: '/photos/pool-loungers.webp',
    speed: '1.0',
  },
]

export function VenueShowcase() {
  return (
    <section id="venues" className="mt-24 scroll-mt-28 bg-foam/60 py-20">
      <div className="page-wrap--wide">
        <div className="max-w-2xl">
          <SectionKicker>Spaces</SectionKicker>
          <h2 className="display-title mt-2 text-3xl md:text-4xl">
            Indoors, outdoors &amp; by the <em>water</em>.
          </h2>
          <p className="mt-3 text-sea-ink-soft">
            On a private island near the estuary of the Atlantic Ocean &amp;
            Volta River.
          </p>
        </div>

        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {SPACES.map((space, i) => (
            <li
              key={space.name}
              data-reveal
              className={i === 1 ? 'md:mt-10' : i === 2 ? 'md:mt-4' : ''}
            >
              <div className="img-frame relative aspect-[4/5] overflow-hidden rounded-md border border-line">
                <ResponsiveImage
                  src={space.image}
                  alt={space.name}
                  loading="lazy"
                  decoding="async"
                  data-speed={space.speed}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <h3 className="display-title mt-4 text-xl">{space.name}</h3>
              <p className="mt-1 text-sm text-sea-ink-soft">{space.caption}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
