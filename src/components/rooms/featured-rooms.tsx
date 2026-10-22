import { Link } from '@tanstack/react-router'

import { SectionKicker } from '#/components/shared/section-kicker'
import { RoomCard } from '#/components/rooms/room-card'
import { RoomCardSkeleton } from '#/components/rooms/room-card-skeleton'
import { RoomsVideoTour } from '#/components/rooms/rooms-video-tour'
import { useRoomsQuery } from '#/hooks/queries/rooms.query'
import { isEnabled } from '#/constants/features'
import { ROOMS_TOUR } from '#/constants/room-videos'

// Featured rooms band: first three rooms + a link to the full list, or the
// room video tour while the `homeRooms` flag is off.
export function FeaturedRooms() {
  const rooms = useRoomsQuery()
  const showRooms = isEnabled('homeRooms')

  return (
    <section className="page-wrap mt-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionKicker>Stay with us</SectionKicker>
          <h2 className="display-title mt-2 text-3xl md:text-4xl">
            Rooms &amp; suites
          </h2>
        </div>
        <Link to="/book" className="btn btn-primary no-underline">
          Book now
        </Link>
      </div>

      {!showRooms ? (
        <RoomsVideoTour videos={[ROOMS_TOUR]} className="mt-8" />
      ) : rooms.isPending ? (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={i === 3 ? 'md:hidden' : undefined}>
              <RoomCardSkeleton />
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
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3">
          {/* Four on two-up phones (no orphan), three from md. */}
          {rooms.data.slice(0, 4).map((room, i) => (
            <li key={room.id} className={i === 3 ? 'md:hidden' : undefined}>
              <RoomCard room={room} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
