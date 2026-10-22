import { createFileRoute } from '@tanstack/react-router'
import { Clock, Mail, Phone } from 'lucide-react'

import { seo } from '#/lib/seo'
import { CONTACT } from '#/constants/site'
import { isRoomType } from '#/constants/room-types'
import type { RoomType } from '#/constants/room-types'
import { PageHero } from '#/components/shared/page-hero'
import { ReservationForm } from '#/components/booking/reservation-form'

export const Route = createFileRoute('/book')({
  validateSearch: (search: Record<string, unknown>): { roomType?: RoomType } =>
    isRoomType(search.roomType) ? { roomType: search.roomType } : {},
  head: () =>
    seo({
      title: 'Book your stay',
      description:
        'Request a stay at Treasure Island Ada, Ada Foah — choose your room ' +
        'type and dates and our reservations team will confirm availability.',
      path: '/book',
    }),
  component: BookPage,
})

function BookPage() {
  const { roomType } = Route.useSearch()

  return (
    <main>
      <PageHero
        image="/rooms/room-5.webp"
        kicker="Reservations"
        title="Book your stay"
        body="Choose your room type and dates, and our reservations team will confirm availability and rates with you."
      />

      <div className="page-wrap grid items-start gap-8 py-16 lg:grid-cols-[1.6fr_1fr]">
        <ReservationForm roomType={roomType} />

        <aside className="island-shell rounded-md p-6">
          <h2 className="display-title text-xl">Prefer to talk?</h2>
          <p className="mt-1 text-sm text-sea-ink-soft">
            Our reservations team is happy to help you choose a room.
          </p>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-lagoon-deep" aria-hidden />
              <a href={CONTACT.phoneHref} className="text-sea-ink">
                {CONTACT.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-lagoon-deep" aria-hidden />
              <a
                href={`mailto:${CONTACT.email}`}
                className="break-all text-sea-ink"
              >
                {CONTACT.email}
              </a>
            </li>
            <li className="flex items-center gap-3 text-sea-ink-soft">
              <Clock size={18} className="text-lagoon-deep" aria-hidden />
              Open {CONTACT.hours}
            </li>
          </ul>
        </aside>
      </div>
    </main>
  )
}
