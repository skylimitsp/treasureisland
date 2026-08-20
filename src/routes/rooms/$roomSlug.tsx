import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { Check, ChevronRight, MapPin, Star } from 'lucide-react'

import { seo } from '#/lib/seo'
import { hotelRoomLd } from '#/lib/structured-data'
import {
  roomDetailQueryOptions,
  useResortStatsQuery,
  useRoomQuery,
} from '#/hooks/queries/rooms.query'
import { useTestimonialsQuery } from '#/hooks/queries/content.query'
import { useGsap } from '#/hooks/use-gsap'
import { revealStagger } from '#/lib/animations'
import { SectionKicker } from '#/components/shared/section-kicker'
import { RoomGallery } from '#/components/rooms/room-gallery'
import { BookingCard } from '#/components/rooms/booking-card'
import { TestimonialCard } from '#/components/shared/testimonial-card'
import { SimilarRooms } from '#/components/rooms/similar-rooms'

const RATING_BARS = ['Comfort', 'Cleanliness', 'Location', 'Service', 'Value']

export const Route = createFileRoute('/rooms/$roomSlug')({
  loader: async ({ context, params }) => {
    try {
      const room = await context.queryClient.ensureQueryData(
        roomDetailQueryOptions(params.roomSlug),
      )
      return { room }
    } catch {
      throw notFound()
    }
  },
  head: ({ loaderData }) =>
    loaderData
      ? seo({
          title: loaderData.room.name,
          description: loaderData.room.description,
          image: loaderData.room.image,
          path: `/rooms/${loaderData.room.slug}`,
          type: 'article',
          breadcrumbs: [
            { name: 'Home', path: '/' },
            { name: 'Rooms', path: '/rooms' },
            {
              name: loaderData.room.name,
              path: `/rooms/${loaderData.room.slug}`,
            },
          ],
          jsonLd: hotelRoomLd(loaderData.room, {
            path: `/rooms/${loaderData.room.slug}`,
          }),
        })
      : seo({ title: 'Room', noindex: true }),
  notFoundComponent: () => (
    <main className="page-wrap pt-32 pb-24 text-center">
      <h1 className="display-title text-4xl">Room not found</h1>
      <Link to="/rooms" className="btn btn-primary mt-6 no-underline">
        Back to rooms
      </Link>
    </main>
  ),
  component: RoomDetailPage,
})

function RoomDetailPage() {
  const { roomSlug } = Route.useParams()
  const room = useRoomQuery(roomSlug)
  const stats = useResortStatsQuery()
  const testimonials = useTestimonialsQuery()
  const ref = useGsap<HTMLElement>((self) => revealStagger(self))

  if (!room.data) {
    return (
      <main className="page-wrap pt-32 pb-24 text-center text-sea-ink-soft">
        Loading…
      </main>
    )
  }

  const r = room.data
  const rating = stats.data?.averageRating ?? 4.9
  const gallery = [
    r.image,
    '/amenities/restaurant.webp',
    '/amenities/jacuzzi.webp',
    '/heroes/reserve.jpg',
    '/heroes/escape.jpg',
  ]

  return (
    <main ref={ref} className="page-wrap pt-28 pb-8">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-sm text-sea-ink-soft"
      >
        <Link to="/" className="no-underline hover:text-sea-ink">
          Home
        </Link>
        <ChevronRight size={14} aria-hidden />
        <Link to="/rooms" className="no-underline hover:text-sea-ink">
          Rooms
        </Link>
        <ChevronRight size={14} aria-hidden />
        <span aria-current="page" className="text-sea-ink">
          {r.name}
        </span>
      </nav>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="display-title text-4xl md:text-5xl">{r.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-sea-ink-soft">
            <span className="inline-flex items-center gap-1">
              <Star
                size={15}
                className="text-gold"
                fill="currentColor"
                strokeWidth={0}
                aria-hidden
              />
              {rating} · 100+ reviews
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin size={15} aria-hidden /> Treasure Island, Indian Ocean
            </span>
            <span className="island-kicker">{r.category}</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <RoomGallery images={gallery} name={r.name} />
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <section>
            <SectionKicker>About this stay</SectionKicker>
            <h2 className="display-title mt-2 text-2xl md:text-3xl">
              Your private corner of the island
            </h2>
            <p className="mt-4 max-w-prose text-sea-ink-soft">
              {r.description}
            </p>
            <p className="mt-3 max-w-prose text-sea-ink-soft">
              Sleeps up to {r.maxGuests} across {r.sizeSqm} m², with {r.beds}.
              Every detail is designed to be barefoot — wide shutters, sea
              breeze, and steps to the water.
            </p>
          </section>

          <section className="mt-10">
            <SectionKicker>Everything you need</SectionKicker>
            <ul className="mt-4 flex flex-wrap gap-2">
              {r.amenities.map((a) => (
                <li key={a} className="chip" data-reveal>
                  <Check size={15} strokeWidth={1.75} aria-hidden /> {a}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-12">
            <SectionKicker>Guest reviews</SectionKicker>
            <div className="mt-4 flex items-center gap-4">
              <span className="display-title text-4xl text-sea-ink">
                {rating}
              </span>
              <div>
                <div className="flex text-gold" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill="currentColor"
                      strokeWidth={0}
                    />
                  ))}
                </div>
                <p className="text-sm text-sea-ink-soft">
                  Based on 100+ reviews
                </p>
              </div>
            </div>
            <dl className="mt-5 max-w-md space-y-2">
              {RATING_BARS.map((label, i) => {
                const val = 4.7 + (i % 3) * 0.1
                return (
                  <div key={label} className="flex items-center gap-3 text-sm">
                    <dt className="w-28 text-sea-ink-soft">{label}</dt>
                    <dd className="flex-1">
                      <div className="h-1.5 rounded-full bg-black/10">
                        <div
                          className="h-1.5 rounded-full bg-lagoon-deep"
                          style={{ width: `${(val / 5) * 100}%` }}
                        />
                      </div>
                    </dd>
                    <span className="w-8 text-right text-sea-ink-soft">
                      {val.toFixed(1)}
                    </span>
                  </div>
                )
              })}
            </dl>
            <ul className="mt-8 grid gap-6 md:grid-cols-2">
              {(testimonials.data ?? []).slice(0, 2).map((t) => (
                <li key={t.id}>
                  <TestimonialCard item={t} />
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-12">
            <SectionKicker>Where you’ll be</SectionKicker>
            <div
              className="img-frame mt-4 flex aspect-[16/7] items-center justify-center bg-cover bg-center text-white"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(23,58,64,.35),rgba(23,58,64,.35)), url('/heroes/escape.jpg')",
              }}
            >
              <span className="chip !border-white/30 !bg-white/15 !text-white">
                <MapPin size={15} aria-hidden /> Treasure Island, Indian Ocean
              </span>
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BookingCard room={r} />
        </aside>
      </div>

      <SimilarRooms currentSlug={r.slug} />
    </main>
  )
}
