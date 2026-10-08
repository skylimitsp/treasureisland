import type { ContentfulStatusCode } from 'hono/utils/http-status'

export type ErrorCode =
  | 'VALIDATION'
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'BOT_CHECK_FAILED'
  | 'INTERNAL'

const STATUS: Record<ErrorCode, ContentfulStatusCode> = {
  VALIDATION: 400,
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  BOT_CHECK_FAILED: 400,
  INTERNAL: 500,
}

// Thrown anywhere in a handler/service; the app error handler renders the envelope.
export class ApiError extends Error {
  readonly status: ContentfulStatusCode

  constructor(
    readonly code: ErrorCode,
    message: string,
    readonly details?: unknown,
  ) {
    super(message)
    this.status = STATUS[code]
  }
}

export const notFound = (what: string) =>
  new ApiError('NOT_FOUND', `${what} not found`)
