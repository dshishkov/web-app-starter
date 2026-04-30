import { Link } from 'react-router-dom'

import { Icons } from '../components/icons'
import { APP_ROUTES } from '../lib/app-config'

export default function NotFound() {
  return (
    <div className="terminal-empty panel-terminal">
      <div className="text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-[20px] border border-[rgba(251,86,91,0.2)] bg-[rgba(251,86,91,0.1)] text-[#ffb4b6]">
          <Icons.empty size={20} />
        </div>

        <div className="font-display mt-5 text-[48px] font-bold tracking-[-0.06em] text-[var(--text-primary)]">
          404
        </div>
        <div className="terminal-section-label mt-2">not found</div>

        <p className="mt-3 text-[14px] text-[var(--text-secondary)]">
          The route you requested does not exist or has been moved.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Link to={APP_ROUTES.home} className="signal-button">
            <Icons.dashboard size={14} />
            Back to catalog
          </Link>
          <Link to={APP_ROUTES.team} className="ghost-button">
            View roster
          </Link>
        </div>
      </div>
    </div>
  )
}
