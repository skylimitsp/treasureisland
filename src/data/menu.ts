/**
 * The restaurant menu (food and drinks) — the API swap seam.
 * @author Joseph Nartey
 * @github devjoemedia
 */
import type { MenuItem, MenuSection } from '#/types'

const SECTIONS: Array<MenuSection> = [
  {
    id: 'breakfast',
    title: 'Breakfast',
    group: 'food',
    order: 1,
  },
  {
    id: 'small-plates',
    title: 'Small plates',
    group: 'food',
    order: 2,
  },
  {
    id: 'from-the-sea',
    title: 'From the sea',
    group: 'food',
    order: 3,
  },
  {
    id: 'grill',
    title: 'Grill',
    group: 'food',
    order: 4,
  },
  {
    id: 'ghanaian-kitchen',
    title: 'Ghanaian kitchen',
    group: 'food',
    order: 5,
  },
  { id: 'sides', title: 'Sides', group: 'food', order: 6 },
  { id: 'desserts', title: 'Desserts', group: 'food', order: 7 },
  {
    id: 'juices',
    title: 'Fresh juices',
    group: 'drinks',
    order: 8,
  },
  {
    id: 'mocktails',
    title: 'Mocktails',
    group: 'drinks',
    order: 9,
  },
  {
    id: 'cocktails',
    title: 'Cocktails',
    group: 'drinks',
    order: 10,
  },
  {
    id: 'wine',
    title: 'Wine',
    group: 'drinks',
    order: 11,
  },
  { id: 'beer', title: 'Beer & cider', group: 'drinks', order: 12 },
  { id: 'soft-drinks', title: 'Soft drinks', group: 'drinks', order: 13 },
]

// No official menu is published yet; drop real dishes in here (same shape) when it is.
const MENU: Array<MenuItem> = []

// Lists every menu item; the page groups them by section.
export function getMenu(): Array<MenuItem> {
  return MENU
}

// Lists the section headings in printed order.
export function getMenuSections(): Array<MenuSection> {
  return [...SECTIONS].sort((a, b) => a.order - b.order)
}
