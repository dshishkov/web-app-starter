import { Navigate, Outlet } from 'react-router-dom'

import { APP_ROUTES } from '../lib/app-config'
import { useSession } from '../lib/auth-client'

export default function RequireAuth() {
  const { data: session, isPending } = useSession()

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

  if (!session?.user) {
    return <Navigate to={APP_ROUTES.home} replace />
  }

  return <Outlet />
}
