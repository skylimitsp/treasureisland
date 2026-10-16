import { Link } from '@tanstack/react-router'
import { ArrowUpRight, MessageCircle } from 'lucide-react'

import { AmenityGlyph } from '#/components/amenities/amenity-icon'
import { SectionKicker } from '#/components/shared/section-kicker'
import { useAmenitiesQuery } from '#/hooks/queries/amenities.query'
import { CONTACT } from '#/constants/site'
import { cn } from '#/lib/utils'

// At-a-glance band: every amenity as a linked tile, with rates on request
// instead of a published price list.
export function AmenityOverview() {
  const amenities = useAmenitiesQuery()
  const list = amenities.data ?? []

  if (list.length === 0) return null

  return (
    <section className="page-wrap mt-24">
      <div
        className="island-shell grid gap-10 rounded-md p-8 md:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-14"
        data-reveal
      >
        <div className="flex flex-col">
          <SectionKicker>At a glance</SectionKicker>
          <h2 className="display-title mt-2 text-2xl md:text-3xl">
            Everything on the <em>island</em>.
          </h2>
          <p className="mt-4 text-sea-ink-soft">
            Rates are shared on request — call or WhatsApp us on{' '}
            <a
              href={CONTACT.phoneHref}
              className="font-semibold text-lagoon-deep no-underline hover:underline"
            >
              {CONTACT.phone}
            </a>{' '}
            and we’ll help you plan your day.
          </p>
          <a
            href={CONTACT.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary mt-6 self-start no-underline"
          >
            <MessageCircle size={16} aria-hidden />
            Ask about rates
          </a>
        </div>

        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {list.map((a, i) => (
            // A lone last tile stretches across its row so the grid stays even.
            <li
              key={a.slug}
              className={cn(
                i === list.length - 1 && [
                  list.length % 2 === 1 && 'col-span-2',
                  list.length % 3 === 1 ? 'md:col-span-3' : 'md:col-span-1',
                ],
              )}
            >
              <Link
                to="/amenities/$slug"
                params={{ slug: a.slug }}
                className="feature-card group flex h-full min-h-28 flex-col justify-between rounded-md border border-line p-4 no-underline"
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className="flex size-10 shrink-0 items-center justify-center rounded-full text-lagoon-deep"
                    style={{
                      background:
                        'color-mix(in oklab, var(--lagoon) 18%, white)',
                    }}
                    aria-hidden
                  >
                    <AmenityGlyph icon={a.icon} size={18} />
                  </span>
                  <ArrowUpRight
                    size={16}
                    className="text-sea-ink-soft/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lagoon-deep"
                    aria-hidden
                  />
                </div>
                <div className="mt-4">
                  <p className="island-kicker !text-[0.62rem]">{a.category}</p>
                  <p className="mt-1 font-semibold leading-snug text-sea-ink">
                    {a.name}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
