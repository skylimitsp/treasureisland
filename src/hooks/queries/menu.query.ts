/**
 * Reads the restaurant menu from the mock-data seam.
 * @author Joseph Nartey
 * @github devjoemedia
 */
import { queryOptions, useQuery } from '@tanstack/react-query'

import { withErrorHandling } from '#/lib/errors'
import { getMenu, getMenuSections } from '#/data/menu'
import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from '#/constants'
import type { MenuItem, MenuSection } from '#/types'

export const menuKeys = {
  all: ['menu'] as const,
  items: () => [...menuKeys.all, 'items'] as const,
  sections: () => [...menuKeys.all, 'sections'] as const,
}

const fetchMenu = withErrorHandling(async (): Promise<Array<MenuItem>> => {
  await new Promise((resolve) => setTimeout(resolve, 250))
  return getMenu() // ← swap for httpClient.get('/menu')
}, 'Failed to load the menu')

const fetchMenuSections = withErrorHandling(
  async (): Promise<Array<MenuSection>> => {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return getMenuSections() // ← swap for httpClient.get('/menu/sections')
  },
  'Failed to load the menu',
)

export const menuQueryOptions = () =>
  queryOptions({
    queryKey: menuKeys.items(),
    queryFn: fetchMenu,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  })

export const menuSectionsQueryOptions = () =>
  queryOptions({
    queryKey: menuKeys.sections(),
    queryFn: fetchMenuSections,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  })

/**
 * Lists every dish and drink on the restaurant menu.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useMenuQuery = () => useQuery(menuQueryOptions())

/**
 * Lists the menu's section headings in printed order.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useMenuSectionsQuery = () => useQuery(menuSectionsQueryOptions())
