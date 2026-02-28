import { useAuth } from '@/hooks/use-auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.toString()

export interface ApiFetchOptions extends RequestInit {
  /**
   * Set to true to skip injecting the Authorization header.
   */
  skipAuth?: boolean
}

const resolveUrl = (input: string | URL): string | URL => {
  if (input instanceof URL) {
    return input
  }
  if (/^https?:/i.test(input)) {
    return new URL(input)
  }

  return `${API_BASE_URL.replace(/\/$/, '')}/${input.replace(/^\//, '')}`
}

export async function apiFetch(
  input: string | URL,
  init: ApiFetchOptions = {},
) {
  const { skipAuth = false, ...requestInit } = init
  const headers = new Headers(requestInit.headers)
  let authHeader: Record<string, string> | undefined

  if (!skipAuth) {
    authHeader = useAuth.getState().getAuthHeader()
  }

  if (authHeader?.Authorization) {
    headers.set('Authorization', authHeader.Authorization)
  }

  const response = await fetch(resolveUrl(input), {
    ...requestInit,
    headers,
    credentials: 'include',
  })

  if (response.status === 401) {
    useAuth.getState().logout()
    throw new Error('Unauthorized')
  }

  return response
}
