import { useMemo } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { seo } from '#/lib/seo'
import { roomsQueryOptions, useRoomsQuery } from '#/hooks/queries/rooms.query'
import { ROOM_VIEWS, filterRooms } from '#/lib/rooms-filter'
import { roomListLd } from '#/lib/structured-data'
import { getRooms } from '#/data/rooms'
import { RoomsHero } from '#/components/rooms/rooms-hero'
import { RoomFiltersBar } from '#/components/rooms/room-filters'
import { RoomCard } from '#/components/rooms/room-card'
import { RoomCardSkeleton } from '#/components/rooms/room-card-skeleton'
import type { RoomCategory, RoomView } from '#/types'

interface RoomsSearch {
  category?: RoomCategory | 'all'
  guests?: number
  view?: RoomView
  priceMin?: number
  priceMax?: number
  sort?: 'asc' | 'desc' | 'rec'
  page?: number
  checkIn?: string
  checkOut?: string
}

const PAGE_SIZE = 6

export const Route = createFileRoute('/rooms/')({
  validateSearch: (search: Record<string, unknown>): RoomsSearch => ({
    category: (search.category as RoomsSearch['category']) || undefined,
    guests: search.guests ? Number(search.guests) : undefined,
    view: ROOM_VIEWS.includes(search.view as RoomView)
      ? (search.view as RoomView)
      : undefined,
    priceMin: search.priceMin ? Number(search.priceMin) : undefined,
    priceMax: search.priceMax ? Number(search.priceMax) : undefined,
    sort: (search.sort as RoomsSearch['sort']) || undefined,
    page: search.page ? Number(search.page) : undefined,
    checkIn: typeof search.checkIn === 'string' ? search.checkIn : undefined,
    checkOut: typeof search.checkOut === 'string' ? search.checkOut : undefined,
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(roomsQueryOptions()),
  head: () =>
    seo({
      title: 'Rooms & Suites',
      description:
        'Ten room types at Treasure Island Ada, Ada Foah — from standard and ' +
        'waterfront rooms to family chalets and penthouses. Book your stay.',
      path: '/rooms',
      jsonLd: roomListLd(getRooms()),
    }),
  component: RoomsPage,
})

function RoomsPage() {
  const rooms = useRoomsQuery()
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  // Changing a filter resets to page 1; paging keeps the filters.
  const setFilters = (partial: Partial<RoomsSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...partial, page: undefined }) })

  const setPage = (page: number) =>
    navigate({
      search: (prev) => ({ ...prev, page: page === 1 ? undefined : page }),
    })

  const clear = () =>
    navigate({
      search: (prev) => ({ checkIn: prev.checkIn, checkOut: prev.checkOut }),
    })

  const visible = useMemo(
    () => (rooms.data ? filterRooms(rooms.data, search) : []),
    [rooms.data, search],
  )

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE))
  const page = Math.min(Math.max(1, search.page ?? 1), pageCount)
  const paged = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <main>
      <RoomsHero />
      <div className="page-wrap">
        <RoomFiltersBar
          value={search}
          count={visible.length}
          onChange={setFilters}
          onClear={clear}
        />

        {rooms.isPending ? (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <RoomCardSkeleton key={i} />
            ))}
          </div>
        ) : rooms.isError ? (
          <div className="island-shell mt-8 rounded-md p-8 text-center">
            <p className="text-sea-ink-soft">{rooms.error.message}</p>
            <button
              className="btn btn-ghost mt-4"
              onClick={() => rooms.refetch()}
            >
              Retry
            </button>
          </div>
        ) : rooms.data.length === 0 ? (
          <div className="island-shell mt-8 rounded-md p-8 text-center">
            <p className="text-sea-ink-soft">No rooms available right now.</p>
          </div>
        ) : (
          <>
            <p className="mt-6 text-sm text-sea-ink-soft" aria-live="polite">
              Showing {paged.length} of {visible.length}{' '}
              {visible.length === 1 ? 'stay' : 'stays'}
            </p>
            {visible.length === 0 ? (
              <div className="island-shell mt-4 rounded-md p-8 text-center">
                <p className="text-sea-ink-soft">
                  No stays match these filters.
                </p>
                <button className="btn btn-ghost mt-4" onClick={clear}>
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <h2 className="sr-only">Rooms & suites</h2>
                <ul className="mt-4 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
                  {paged.map((room) => (
                    <li key={room.id}>
                      <RoomCard room={room} reveal={false} />
                    </li>
                  ))}
                </ul>

                {pageCount > 1 ? (
                  <nav
                    className="mt-10 flex items-center justify-center gap-2 pb-24"
                    aria-label="Rooms pagination"
                  >
                    <button
                      type="button"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="flex size-10 items-center justify-center rounded-md border border-line text-sea-ink-soft disabled:opacity-40"
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={18} aria-hidden />
                    </button>
                    {Array.from({ length: pageCount }, (_, i) => i + 1).map(
                      (p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPage(p)}
                          aria-current={p === page ? 'page' : undefined}
                          className={`flex size-10 items-center justify-center rounded-md text-sm font-semibold ${
                            p === page
                              ? 'bg-lagoon-deep text-white'
                              : 'border border-line text-sea-ink-soft hover:text-sea-ink'
                          }`}
                        >
                          {p}
                        </button>
                      ),
                    )}
                    <button
                      type="button"
                      onClick={() => setPage(page + 1)}
                      disabled={page === pageCount}
                      className="flex size-10 items-center justify-center rounded-md border border-line text-sea-ink-soft disabled:opacity-40"
                      aria-label="Next page"
                    >
                      <ChevronRight size={18} aria-hidden />
                    </button>
                  </nav>
                ) : (
                  <div className="pb-24" />
                )}
              </>
            )}
          </>
        )}
      </div>
    </main>
  )
}
