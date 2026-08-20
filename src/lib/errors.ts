import { isNetworkError, isTimeoutError } from '#/lib/http-client'

type ServerErrorShape = { data?: { message?: string } }

// Normalizes any thrown value into a user-safe Error for the UI to show.
export function sanitizeError(error: unknown, defaultMessage: string): Error {
  const err = error instanceof Error ? error : new Error(defaultMessage)

  if (isTimeoutError(err)) {
    err.message = 'The request took too long. Please try again.'
    return err
  }

  if (isNetworkError(err)) {
    err.message = 'Unable to reach the server. Please try again later.'
    return err
  }

  const serverMessage = (err as ServerErrorShape).data?.message
  err.message = serverMessage || err.message || defaultMessage
  return err
}

// Wraps an async function so every rejection is sanitized before it bubbles up.
export const withErrorHandling = <
  T extends (...args: Array<any>) => Promise<any>,
>(
  fn: T,
  defaultMessage: string,
): ((...input: Parameters<T>) => Promise<Awaited<ReturnType<T>>>) => {
  return async (...input: Parameters<T>) => {
    try {
      return await fn(...input)
    } catch (error) {
      throw sanitizeError(error, defaultMessage)
    }
  }
}
