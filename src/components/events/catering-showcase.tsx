import { Check } from 'lucide-react'

import { FacilityChip } from '#/components/shared/facility-chip'
import { ResponsiveImage } from '#/components/shared/responsive-image'
import { SectionKicker } from '#/components/shared/section-kicker'
import { cn } from '#/lib/utils'

const PHOTOS = [
  {
    src: '/events/catering-01.webp',
    alt: 'A buffet station under palm-thatched shades by the water',
  },
  {
    src: '/events/catering-02.webp',
    alt: 'A white-canopied banquet table set beside the lagoon',
  },
  {
    src: '/events/catering-04.webp',
    alt: 'A canopied banquet terrace along the water at sunset',
  },
]

const POINTS = [
  'Menus for each ceremony',
  'Indoor & outdoor banquets',
  'Waterfront buffets',
]

// Catering & banquets: official copy beside three staggered set-up photos.
export function CateringShowcase() {
  return (
    <section className="page-wrap mt-24 grid items-center gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-16">
      <div data-reveal>
        <SectionKicker>Catering &amp; Banquets</SectionKicker>
        <h2 className="display-title mt-2 text-3xl md:text-4xl">
          Set by the <em>water</em>.
        </h2>
        <p className="mt-4 max-w-prose text-sea-ink-soft">
          Every celebration comes with unique menus designed for each ceremony,
          a choice of indoor and outdoor banquet rooms, and an expert catering
          team that thrives on making every detail of the event extravagant,
          elegant and lively.
        </p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {POINTS.map((point) => (
            <li key={point}>
              <FacilityChip icon={Check}>{point}</FacilityChip>
            </li>
          ))}
        </ul>
        <a href="#enquire" className="btn btn-primary mt-8 no-underline">
          Plan your menu
        </a>
      </div>

      <div className="grid grid-cols-3 items-start gap-3 sm:gap-4">
        {PHOTOS.map((photo, i) => (
          <figure
            key={photo.src}
            data-reveal
            data-speed={i === 1 ? '1.15' : undefined}
            className={cn(
              'img-frame overflow-hidden rounded-md',
              i === 1 && 'mt-10 md:mt-16',
            )}
          >
            <ResponsiveImage
              src={photo.src}
              alt={photo.alt}
              sizes="(min-width: 768px) 18vw, 33vw"
              loading="lazy"
              decoding="async"
              className="aspect-[3/4] h-full w-full object-cover"
            />
          </figure>
        ))}
      </div>
    </section>
  )
}
