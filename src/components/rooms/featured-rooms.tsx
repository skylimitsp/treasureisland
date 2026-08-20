import { Link } from '@tanstack/react-router'

import { SectionKicker } from '#/components/shared/section-kicker'
import { RoomCard } from '#/components/rooms/room-card'
import { useRoomsQuery } from '#/hooks/queries/rooms.query'

// Featured rooms band: first three rooms + a link to the full list.
export function FeaturedRooms() {
  const rooms = useRoomsQuery()

  return (
    <section className="page-wrap mt-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionKicker>Stay with us</SectionKicker>
          <h2 className="display-title mt-2 text-3xl md:text-4xl">
            Rooms &amp; suites
          </h2>
        </div>
        <Link to="/rooms" className="btn btn-ghost no-underline">
          View all rooms
        </Link>
      </div>

      {rooms.isPending ? (
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="feature-card rounded-md border border-line p-4"
            >
              <div className="aspect-[4/3] animate-pulse rounded-md bg-black/5" />
              <div className="mt-4 h-5 w-2/3 animate-pulse rounded-md bg-black/5" />
              <div className="mt-2 h-4 w-full animate-pulse rounded-md bg-black/5" />
            </div>
          ))}
        </div>
      ) : rooms.isError ? (
        <div className="island-shell mt-8 rounded-md p-6 text-center">
          <p className="text-sea-ink-soft">{rooms.error.message}</p>
          <button
            className="btn btn-ghost mt-4"
            onClick={() => rooms.refetch()}
          >
            Try again
          </button>
        </div>
      ) : rooms.data.length === 0 ? null : (
        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {rooms.data.slice(0, 3).map((room) => (
            <li key={room.id}>
              <RoomCard room={room} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
