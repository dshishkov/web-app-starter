import type {
  ApiError,
  CurrentUser,
  PublicUser,
  UserResponse,
  UsersResponse,
} from '@repo/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { API_ENDPOINTS } from './app-config'
import { useSession } from './auth-client'

/* ── Query keys (strongly typed tuples) ───────────────── */

const queryKeys = {
  me: ['me'] as const,
  users: ['users'] as const,
} satisfies Record<string, readonly string[]>

/* ── Error parsing ────────────────────────────────────── */

async function parseApiError(response: Response): Promise<Error> {
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

/* ── useUpdateNickname ────────────────────────────────── */

interface UpdateNicknameVars {
  nickname: string | null
}

async function updateNickname({
  nickname,
}: UpdateNicknameVars): Promise<CurrentUser> {
  const response = await fetch(API_ENDPOINTS.nickname, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ nickname }),
  })
  if (!response.ok) throw await parseApiError(response)
  const data = (await response.json()) as UserResponse
  return data.user
}

export function useUpdateNickname() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateNickname,
    onSuccess: (user) => {
      queryClient.setQueryData<CurrentUser>(queryKeys.me, user)
      void queryClient.invalidateQueries({ queryKey: queryKeys.users })
    },
  })
}
