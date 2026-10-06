import type { MenuItem } from '#/types'

// Case- and accent-insensitive, so "pina" finds "Piña" and "todays" finds "today’s".
const normalise = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’'`.]/g, '')
    .toLowerCase()

export function matchesQuery(item: MenuItem, query: string): boolean {
  const q = normalise(query.trim())
  return !q || normalise(`${item.name} ${item.description}`).includes(q)
}
