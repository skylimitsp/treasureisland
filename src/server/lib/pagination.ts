import { z } from 'zod'

export const pageQuery = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(25),
  cursor: z.coerce.number().int().min(0).default(0),
})

export type PageQuery = z.infer<typeof pageQuery>

// Offset cursor: fetch one extra row to know whether another page exists.
export function toPage<T>(rows: Array<T>, { limit, cursor }: PageQuery) {
  const hasMore = rows.length > limit
  return {
    data: hasMore ? rows.slice(0, limit) : rows,
    page: { cursor: hasMore ? String(cursor + limit) : null, hasMore },
  }
}
