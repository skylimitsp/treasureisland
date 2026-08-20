import { queryOptions, useQuery } from '@tanstack/react-query'

import { withErrorHandling } from '#/lib/errors'
import { getResortStats, getRoomBySlug, getRooms } from '#/data/rooms'
import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from '#/constants'
import type { ResortStats, Room } from '#/types'

export const roomKeys = {
  all: ['rooms'] as const,
  list: () => ['rooms', 'list'] as const,
  detail: (slug: string) => ['rooms', 'detail', slug] as const,
  stats: () => ['rooms', 'stats'] as const,
}

const fetchRooms = withErrorHandling(async (): Promise<Array<Room>> => {
  await new Promise((resolve) => setTimeout(resolve, 250))
  return getRooms() // ← swap for httpClient.get('/rooms')
}, 'Failed to load rooms')

const fetchRoom = withErrorHandling(async (slug: string): Promise<Room> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const room = getRoomBySlug(slug)
  if (!room) throw new Error('Room not found')
  return room
}, 'Failed to load this room')

const fetchStats = withErrorHandling(async (): Promise<ResortStats> => {
  await new Promise((resolve) => setTimeout(resolve, 150))
  return getResortStats()
}, 'Failed to load resort stats')

// Shared query options so route loaders can prefetch (SSR) and hooks reuse them.
export const roomsQueryOptions = () =>
  queryOptions({
    queryKey: roomKeys.list(),
    queryFn: fetchRooms,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  })

export const resortStatsQueryOptions = () =>
  queryOptions({
    queryKey: roomKeys.stats(),
    queryFn: fetchStats,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  })

export const roomDetailQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: roomKeys.detail(slug),
    queryFn: () => fetchRoom(slug),
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  })

/**
 * Lists the resort's rooms, villas, and suites.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useRoomsQuery = () =>
  useQuery({
    queryKey: roomKeys.list(),
    queryFn: fetchRooms,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  })

/**
 * Loads a single room by slug.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useRoomQuery = (slug: string) =>
  useQuery({
    queryKey: roomKeys.detail(slug),
    queryFn: () => fetchRoom(slug),
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  })

/**
 * Loads headline resort stats for the trust strip.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useResortStatsQuery = () =>
  useQuery({
    queryKey: roomKeys.stats(),
    queryFn: fetchStats,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  })
