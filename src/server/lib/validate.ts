import type { z } from 'zod'

import { ApiError } from '#/server/lib/errors'

// Parses with a shared zod schema and maps failures to a 400 with field paths.
export function parse<T extends z.ZodType>(
  schema: T,
  data: unknown,
): z.infer<T> {
  const result = schema.safeParse(data)
  if (result.success) return result.data
  throw new ApiError(
    'VALIDATION',
    'Some fields are missing or invalid',
    result.error.issues.map((i) => ({
      path: i.path.join('.'),
      message: i.message,
    })),
  )
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json()
  } catch {
    throw new ApiError('VALIDATION', 'Request body must be valid JSON')
  }
}
