import { queryOptions, useQuery } from '@tanstack/react-query'

import { withErrorHandling } from '#/lib/errors'
import {
  getAmenities,
  getAmenityBySlug,
  getRelatedAmenities,
} from '#/data/amenities'
import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from '#/constants'
import type { Amenity } from '#/types'

export const amenityKeys = {
  all: ['amenities'] as const,
  list: () => ['amenities', 'list'] as const,
  detail: (slug: string) => ['amenities', 'detail', slug] as const,
  related: (slug: string) => ['amenities', 'related', slug] as const,
}

const fetchAmenities = withErrorHandling(async (): Promise<Array<Amenity>> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return getAmenities() // ← swap for httpClient.get('/amenities')
}, 'Failed to load amenities')

const fetchAmenity = withErrorHandling(
  async (slug: string): Promise<Amenity> => {
    await new Promise((resolve) => setTimeout(resolve, 180))
    const amenity = getAmenityBySlug(slug)
    if (!amenity) throw new Error('Amenity not found')
    return amenity // ← swap for httpClient.get(`/amenities/${slug}`)
  },
  'Failed to load this amenity',
)

const fetchRelatedAmenities = withErrorHandling(
  async (slug: string): Promise<Array<Amenity>> => {
    await new Promise((resolve) => setTimeout(resolve, 180))
    return getRelatedAmenities(slug) // ← swap for httpClient.get(`/amenities/${slug}/related`)
  },
  'Failed to load related amenities',
)

export const amenitiesQueryOptions = () =>
  queryOptions({
    queryKey: amenityKeys.list(),
    queryFn: fetchAmenities,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  })

export const amenityQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: amenityKeys.detail(slug),
    queryFn: () => fetchAmenity(slug),
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  })

export const relatedAmenitiesQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: amenityKeys.related(slug),
    queryFn: () => fetchRelatedAmenities(slug),
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  })

/**
 * Lists the resort amenities.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useAmenitiesQuery = () => useQuery(amenitiesQueryOptions())

/**
 * Loads a single amenity by slug.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useAmenityQuery = (slug: string) =>
  useQuery(amenityQueryOptions(slug))

/**
 * Loads the other amenities to cross-link from a detail page.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useRelatedAmenitiesQuery = (slug: string) =>
  useQuery(relatedAmenitiesQueryOptions(slug))
