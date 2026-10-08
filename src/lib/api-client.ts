/**
 * Client for the /api/v1 backend: browser fetch, or an in-process call during SSR.
 * @author Joseph Nartey
 * @github devjoemedia
 */
import { createIsomorphicFn } from '@tanstack/react-start'

const TIMEOUT_MS = 15_000

// Carries the API's error code and field details for forms to show.
export class ApiRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
    readonly details?: Array<{ path: string; message: string }>,
  ) {
    super(message)
  }
}

// SSR calls the Hono app directly (no network hop); the server branch is stripped from client bundles.
const send = createIsomorphicFn()
  .server(async (path: string, init: RequestInit): Promise<Response> => {
    const [{ app }, { env }] = await Promise.all([
      import('#/server/app'),
      import('cloudflare:workers'),
    ])
    return app.request(`http://internal/api/v1${path}`, init, env)
  })
  .client((path: string, init: RequestInit): Promise<Response> =>
    fetch(`/api/v1${path}`, { ...init, credentials: 'same-origin' }),
  )

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  headers: Record<string, string> = {},
): Promise<T> {
  let res: Response
  try {
    res = await send(path, {
      method,
      headers:
        body === undefined
          ? headers
          : { 'content-type': 'application/json', ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
  } catch (error) {
    const timedOut =
      error instanceof DOMException && error.name === 'TimeoutError'
    throw new ApiRequestError(
      timedOut
        ? 'The request took too long. Please try again.'
        : 'Unable to reach the server. Please check your connection.',
      0,
    )
  }
  if (res.status === 204) return undefined as T
  const json = (await res.json().catch(() => null)) as {
    data?: T
    error?: {
      code?: string
      message?: string
      details?: Array<{ path: string; message: string }>
    }
  } | null
  if (!res.ok) {
    throw new ApiRequestError(
      json?.error?.message ?? `Request failed (${res.status})`,
      res.status,
      json?.error?.code,
      json?.error?.details,
    )
  }
  return json?.data as T
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown, headers?: Record<string, string>) =>
    request<T>('POST', path, body ?? {}, headers),
  patch: <T>(path: string, body: unknown) => request<T>('PATCH', path, body),
  put: <T>(path: string, body: unknown) => request<T>('PUT', path, body),
  delete: (path: string) => request<void>('DELETE', path),
}
