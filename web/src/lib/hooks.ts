import type {
  ApiError,
  CurrentUser,
  PublicUser,
  UserResponse,
  UsersResponse,
} from '@repo/types'
import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryKey,
} from '@tanstack/react-query'

import { API_ENDPOINTS } from './app-config'
import { useSession } from './auth-client'

/* ── Query keys (strongly typed tuples) ───────────────── */

export const queryKeys = {
  me: ['me'] as const,
  users: ['users'] as const,
} satisfies Record<string, readonly string[]>

/* ── Error parsing ────────────────────────────────────── */

export async function parseApiError(response: Response): Promise<Error> {
  try {
    const body = (await response.json()) as ApiError
    return new Error(body.message || `Request failed (${response.status})`)
  } catch {
    return new Error(`Request failed (${response.status})`)
  }
}

/* ── useMe ────────────────────────────────────────────── */

async function fetchMe(): Promise<CurrentUser> {
  const response = await fetch(API_ENDPOINTS.me, { credentials: 'include' })
  if (!response.ok) throw await parseApiError(response)
  const data = (await response.json()) as UserResponse
  return data.user
}

export function useMe() {
  const { data: session } = useSession()
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: fetchMe,
    enabled: !!session?.user,
  })
}

/* ── useUsers ─────────────────────────────────────────── */

async function fetchUsers(): Promise<PublicUser[]> {
  const response = await fetch(API_ENDPOINTS.users, { credentials: 'include' })
  if (!response.ok) throw await parseApiError(response)
  const data = (await response.json()) as UsersResponse
  return data.users
}

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: fetchUsers,
  })
}

/* ── useFormMutation ──────────────────────────────────── */

/**
 * Generic mutation hook for form endpoints.
 *
 * Eliminates the need for per-resource custom mutation hooks.
 * Handles fetch, JSON serialisation, error parsing, cache invalidation,
 * and optional direct cache updates — all from a single call site.
 *
 * @example
 * const updateNickname = useFormMutation<NicknameForm, CurrentUser>({
 *   endpoint: '/api/me/nickname',
 *   method: 'PATCH',
 *   transformResponse: (data) => (data as { user: CurrentUser }).user,
 *   invalidateKeys: [queryKeys.users],
 *   setQueryData: queryKeys.me,
 * })
 */
interface UseFormMutationOptions<TOutput> {
  endpoint: string
  method?: 'POST' | 'PATCH' | 'PUT'
  transformResponse?: (data: unknown) => TOutput
  invalidateKeys?: QueryKey[]
  setQueryData?: QueryKey
}

export function useFormMutation<
  TInput extends Record<string, unknown>,
  TOutput = unknown,
>({
  endpoint,
  method = 'POST',
  transformResponse,
  invalidateKeys,
  setQueryData,
}: UseFormMutationOptions<TOutput>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: TInput) => {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(input),
      })
      if (!response.ok) throw await parseApiError(response)
      const json = (await response.json()) as unknown
      return (transformResponse ? transformResponse(json) : json) as TOutput
    },
    onSuccess: (data) => {
      if (setQueryData) {
        queryClient.setQueryData(setQueryData, data)
      }
      invalidateKeys?.forEach((key) => {
        void queryClient.invalidateQueries({ queryKey: key })
      })
    },
  })
}
