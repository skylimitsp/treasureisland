import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { Check, ChevronRight, MapPin } from 'lucide-react'

import { seo } from '#/lib/seo'
import { hotelRoomLd } from '#/lib/structured-data'
import {
  roomDetailQueryOptions,
  useRoomQuery,
} from '#/hooks/queries/rooms.query'
import { ROOM_CATEGORY_LABELS } from '#/lib/rooms-filter'
import { useGsap } from '#/hooks/use-gsap'
import { revealStagger } from '#/lib/animations'
import { SectionKicker } from '#/components/shared/section-kicker'
import { RoomGallery } from '#/components/rooms/room-gallery'
import { BookingCard } from '#/components/rooms/booking-card'
import { SimilarRooms } from '#/components/rooms/similar-rooms'
import { bgImage } from '#/lib/media'

const LOCATION = 'Ada Foah, Volta Region, Ghana'

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
  const ref = useGsap<HTMLElement>((self) => revealStagger(self))

  if (!room.data) {
    return (
      <main className="page-wrap pt-32 pb-24 text-center text-sea-ink-soft">
        Loading…
      </main>
    )
  }

  const r = room.data
  const facts = [
    { label: 'Room type', value: ROOM_CATEGORY_LABELS[r.category] },
    { label: 'Bed', value: r.beds },
    { label: 'Occupancy', value: `Up to ${r.maxGuests} guests` },
    { label: 'View', value: r.view ? `${r.view} view` : null },
    { label: 'Bathroom', value: r.bathroom },
  ].filter((f): f is { label: string; value: string } => Boolean(f.value))
  const gallery = [
    r.image,
    '/photos/breakfast.webp',
    '/photos/pool-loungers.webp',
    '/photos/pool-at-night.webp',
    '/photos/aerial-resort.webp',
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
              <MapPin size={15} aria-hidden /> {LOCATION}
            </span>
            <span className="island-kicker">
              {ROOM_CATEGORY_LABELS[r.category]}
            </span>
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
              Room details
            </h2>
            <p className="mt-4 max-w-prose text-sea-ink-soft">
              {r.description}
            </p>
            <dl className="mt-6 grid max-w-xl gap-x-6 gap-y-3 sm:grid-cols-2">
              {facts.map((f) => (
                <div key={f.label} className="border-b border-line pb-2">
                  <dt className="island-kicker">{f.label}</dt>
                  <dd className="mt-1 text-sea-ink">{f.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {r.amenities.length > 0 ? (
            <section className="mt-10">
              <SectionKicker>In the room</SectionKicker>
              <ul className="mt-4 flex flex-wrap gap-2">
                {r.amenities.map((a) => (
                  <li key={a} className="chip" data-reveal>
                    <Check size={15} strokeWidth={1.75} aria-hidden /> {a}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="mt-12">
            <SectionKicker>Where you’ll be</SectionKicker>
            <div
              className="img-frame mt-4 flex aspect-[16/7] items-center justify-center bg-cover bg-center text-white"
              style={{
                backgroundImage: `linear-gradient(rgba(23,58,64,.35),rgba(23,58,64,.35)), ${bgImage('/photos/beach-hero.webp')}`,
              }}
            >
              <span className="chip !border-white/30 !bg-white/15 !text-white">
                <MapPin size={15} aria-hidden /> {LOCATION}
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
