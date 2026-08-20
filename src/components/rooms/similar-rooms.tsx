import { SectionKicker } from '#/components/shared/section-kicker'
import { RoomCard } from '#/components/rooms/room-card'
import { useRoomsQuery } from '#/hooks/queries/rooms.query'

// Other rooms (excludes the current slug); reuses the rooms list query.
export function SimilarRooms({ currentSlug }: { currentSlug: string }) {
  const rooms = useRoomsQuery()
  const others = (rooms.data ?? [])
    .filter((room) => room.slug !== currentSlug)
    .slice(0, 3)
  if (others.length === 0) return null

  return (
    <section className="page-wrap mt-24 pb-24">
      <SectionKicker>Also on the island</SectionKicker>
      <h2 className="display-title mt-2 text-3xl">You might also like</h2>
      <ul className="mt-8 grid gap-6 md:grid-cols-3">
        {others.map((room) => (
          <li key={room.id}>
            <RoomCard room={room} reveal={false} />
          </li>
        ))}
      </ul>
    </section>
  )
}
