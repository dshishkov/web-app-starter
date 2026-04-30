import { useQuery } from '@tanstack/react-query'
import { Navigate, Outlet } from 'react-router-dom'

import { APP_ROUTES } from '../lib/app-config'
import { authClient } from '../lib/auth-client'

export default function RequireAuth() {
  const { data, isPending } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data, error } = await authClient.getSession()
      if (error) throw new Error(error.message, { cause: error })
      return data
    },
    staleTime: 60_000,
  })

  if (isPending) {
    return (
      <div className="terminal-empty panel-terminal">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[var(--color-accent)]" />
          <div className="terminal-section-label">auth handshake</div>
        </div>
      </div>
    )
  }

  if (!data?.user) return <Navigate to={APP_ROUTES.home} replace />
  return <Outlet />
}
