/**
 * Enhanced HTTP client with comprehensive timeout handling
 * Provides consistent timeout behavior across all frontend requests
 */

export interface RequestConfig {
  timeout?: number
  retries?: number
  retryDelay?: number
  signal?: AbortSignal
}

export interface TimeoutError extends Error {
  name: 'TimeoutError'
  code: 'TIMEOUT'
  timeout: number
}

export interface NetworkError extends Error {
  name: 'NetworkError'
  code: 'NETWORK_ERROR'
  originalError: Error
}

// Default timeout configurations
export const TIMEOUT_CONFIG = {
  DEFAULT: 15000, // 15 seconds for most requests
  FAST: 5000, // 5 seconds for quick operations
  SLOW: 30000, // 30 seconds for uploads/heavy operations
  CRITICAL: 45000, // 45 seconds for critical operations
} as const

/**
 * Creates a timeout error
 */
function createTimeoutError(timeout: number): TimeoutError {
  const error = new Error(
    `Request timed out after ${timeout}ms`,
  ) as TimeoutError
  error.name = 'TimeoutError'
  error.code = 'TIMEOUT'
  error.timeout = timeout
  return error
}

/**
 * Creates a network error
 */
function createNetworkError(originalError: Error): NetworkError {
  const error = new Error(
    `Network error: ${originalError.message}`,
  ) as NetworkError
  error.name = 'NetworkError'
  error.code = 'NETWORK_ERROR'
  error.originalError = originalError
  return error
}

/**
 * Enhanced fetch with timeout and retry logic
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit & RequestConfig = {},
): Promise<Response> {
  const {
    timeout = TIMEOUT_CONFIG.DEFAULT,
    retries = 1,
    retryDelay = 1000,
    signal,
    ...fetchOptions
  } = options

  // Create abort controller for timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    controller.abort()
  }, timeout)

  // Combine signals if external signal provided
  const combinedSignal = signal
    ? combineAbortSignals([signal, controller.signal])
    : controller.signal

  let lastError: Error

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: combinedSignal,
      })

      clearTimeout(timeoutId)
      return response
    } catch (error: any) {
      clearTimeout(timeoutId)

      // Handle different error types
      if (error.name === 'AbortError') {
        if (signal?.aborted) {
          // External cancellation
          throw error
        } else {
          // Timeout
          lastError = createTimeoutError(timeout)
        }
      } else if (
        error instanceof TypeError &&
        error.message.includes('fetch')
      ) {
        // Network error
        lastError = createNetworkError(error)
      } else {
        lastError = error
      }

      // Don't retry on certain errors
      if (error.name === 'AbortError' && signal?.aborted) {
        throw error
      }

      // If this was the last attempt, throw the error
      if (attempt === retries) {
        throw lastError
      }

      // Wait before retry
      if (retryDelay > 0) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay))
      }
    }
  }

  throw lastError!
}

/**
 * Combines multiple AbortSignals into one
 */
function combineAbortSignals(signals: AbortSignal[]): AbortSignal {
  const controller = new AbortController()

  for (const signal of signals) {
    if (signal.aborted) {
      controller.abort()
      break
    }
    signal.addEventListener('abort', () => controller.abort(), { once: true })
  }

  return controller.signal
}

/**
 * HTTP client with built-in timeout handling
 */
export class HttpClient {
  private defaultTimeout: number
  private defaultRetries: number
  private baseHeaders: Record<string, string>

  constructor(
    config: {
      defaultTimeout?: number
      defaultRetries?: number
      baseHeaders?: Record<string, string>
    } = {},
  ) {
    this.defaultTimeout = config.defaultTimeout ?? TIMEOUT_CONFIG.DEFAULT
    this.defaultRetries = config.defaultRetries ?? 1
    this.baseHeaders = config.baseHeaders ?? {}
  }

  async request<T = any>(
    url: string,
    options: RequestInit & RequestConfig = {},
  ): Promise<T> {
    const {
      timeout = this.defaultTimeout,
      retries = this.defaultRetries,
      headers = {},
      ...restOptions
    } = options

    const mergedHeaders = {
      'Content-Type': 'application/json',
      ...this.baseHeaders,
      ...headers,
    }

    try {
      const response = await fetchWithTimeout(url, {
        ...restOptions,
        headers: mergedHeaders,
        timeout,
        retries,
      })

      if (!response.ok) {
        const errorData = await this.parseErrorResponse(response)
        const error = new Error(
          errorData.message ||
            `HTTP ${response.status}: ${response.statusText}`,
        ) as any
        error.status = response.status
        error.statusCode = response.status
        error.response = response
        error.data = errorData
        throw error
      }

      return await this.parseSuccessResponse<T>(response)
    } catch (error: any) {
      // Add request context to error
      error.url = url
      error.method = options.method || 'GET'
      error.timeout = timeout

      throw error
    }
  }

  private async parseErrorResponse(response: Response): Promise<any> {
    const contentType = response.headers.get('content-type')

    try {
      if (contentType?.includes('application/json')) {
        const text = await response.text()

        try {
          return JSON.parse(text)
        } catch (jsonError) {
          console.error('[HTTP Client] Error response is not valid JSON:', {
            url: response.url,
            status: response.status,
            responsePreview: text.substring(0, 200),
          })

          // Return the text as the error message
          return {
            message: `Server returned invalid JSON (${response.status}): ${text.substring(0, 100)}`,
            rawResponse: text.substring(0, 500),
          }
        }
      } else {
        const text = await response.text()
        return {
          message: text || `HTTP ${response.status}`,
          rawResponse: text.substring(0, 500),
        }
      }
    } catch (error: any) {
      console.error('[HTTP Client] Failed to parse error response:', error)
      return { message: `HTTP ${response.status}: ${response.statusText}` }
    }
  }

  private async parseSuccessResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type')
    const contentLength = response.headers.get('content-length')

    // Handle empty responses
    if (contentLength === '0' || response.status === 204) {
      return {} as T
    }

    try {
      if (contentType?.includes('application/json')) {
        const text = await response.text()

        // Log the raw response for debugging
        if (!text || text.trim().length === 0) {
          console.warn('[HTTP Client] Empty response body received')
          return {} as T
        }

        try {
          return JSON.parse(text)
        } catch (jsonError: any) {
          console.error('[HTTP Client] JSON Parse Error:', {
            url: response.url,
            status: response.status,
            contentType,
            responsePreview: text.substring(0, 200),
            error: jsonError.message,
          })

          // Throw a more descriptive error
          throw new Error(
            `Invalid JSON response from ${response.url}: ${jsonError.message}. Response starts with: ${text.substring(0, 100)}`,
          )
        }
      } else {
        return (await response.text()) as T
      }
    } catch (error: any) {
      console.error('[HTTP Client] Response parsing failed:', {
        url: response.url,
        error: error.message,
      })
      throw error
    }
  }

  // Convenience methods
  async get<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'GET' })
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    })
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: 'PUT',
      body: data instanceof FormData ? data : JSON.stringify(data),
    })
  }

  async delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'DELETE' })
  }
}

/**
 * Default HTTP client instance
 */
export const httpClient = new HttpClient()

/**
 * Utility function to check if error is a timeout error
 */
export function isTimeoutError(error: any): error is TimeoutError {
  return error?.name === 'TimeoutError' || error?.code === 'TIMEOUT'
}

/**
 * Utility function to check if error is a network error
 */
export function isNetworkError(error: any): error is NetworkError {
  return error?.name === 'NetworkError' || error?.code === 'NETWORK_ERROR'
}

/**
 * Utility function to get appropriate timeout for operation type
 */
export function getTimeoutForOperation(
  operation: 'fast' | 'default' | 'slow' | 'critical',
): number {
  switch (operation) {
    case 'fast':
      return TIMEOUT_CONFIG.FAST
    case 'slow':
      return TIMEOUT_CONFIG.SLOW
    case 'critical':
      return TIMEOUT_CONFIG.CRITICAL
    default:
      return TIMEOUT_CONFIG.DEFAULT
  }
}
