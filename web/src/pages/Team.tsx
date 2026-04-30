import { Icons } from '../components/icons'
import { useUsers } from '../lib/hooks'
import { gradientFor, hueFor } from '../lib/utils'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function Team() {
  const { data: users, isLoading, isError } = useUsers()

  if (isLoading) {
    return (
      <div className="terminal-empty panel-terminal">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[var(--color-accent)]" />
          <div className="terminal-section-label">loading roster</div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="terminal-empty panel-terminal">
        <div>
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-[20px] border border-[rgba(251,86,91,0.2)] bg-[rgba(251,86,91,0.1)] text-[#ffb4b6]">
            <Icons.team size={20} />
          </div>
          <div className="terminal-section-label mt-5">load failed</div>
          <p className="mt-3 text-[14px] text-[var(--text-secondary)]">
            Could not load the roster. Make sure you are signed in.
          </p>
        </div>
      </div>
    )
  }

  if (!users || users.length === 0) {
    return (
      <div className="panel-terminal panel-grid terminal-empty">
        <div>
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-[20px] border border-[rgba(0,217,146,0.18)] bg-[rgba(0,217,146,0.08)] text-[var(--color-accent)] shadow-[0_0_30px_rgba(0,217,146,0.14)]">
            <Icons.team size={20} />
          </div>
          <div className="terminal-section-label mt-5">empty roster</div>
          <h2 className="font-display mt-3 text-[26px] font-semibold tracking-[-0.05em] text-[var(--text-primary)]">
            No members yet.
          </h2>
          <p className="mt-3 text-[14px] text-[var(--text-secondary)]">
            Be the first to sign in and your profile will appear here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="panel-terminal p-4">
          <div className="terminal-section-label">members</div>
          <div className="mt-3 text-[32px] font-semibold tracking-[-0.05em] text-[var(--color-accent)]">
            {users.length}
          </div>
          <div className="mt-2 text-[12px] text-[var(--text-secondary)]">
            registered operators
          </div>
        </div>
        <div className="panel-terminal p-4">
          <div className="terminal-section-label">source</div>
          <div className="mt-3 text-[32px] font-semibold tracking-[-0.05em] text-[var(--text-primary)]">
            /api/users
          </div>
          <div className="mt-2 text-[12px] text-[var(--text-secondary)]">
            auth-gated endpoint
          </div>
        </div>
        <div className="panel-terminal p-4">
          <div className="terminal-section-label">sync</div>
          <div className="mt-3 text-[32px] font-semibold tracking-[-0.05em] text-[#b6ffe0]">
            live
          </div>
          <div className="mt-2 text-[12px] text-[var(--text-secondary)]">
            fresh on every visit
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {users.map((user) => {
          const hue = hueFor(user.name)

          return (
            <article key={user.id} className="panel-terminal p-5">
              <div className="flex items-start gap-4">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="h-12 w-12 shrink-0 rounded-[16px] border border-white/10 object-cover"
                  />
                ) : (
                  <span
                    className="inline-grid h-12 w-12 shrink-0 place-items-center rounded-[16px] border border-white/10 text-[14px] font-semibold text-white"
                    style={{ background: gradientFor(hue) }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}

                <div className="min-w-0">
                  <div className="truncate text-[14px] font-semibold text-[var(--text-primary)]">
                    {user.nickname || user.name}
                  </div>
                  {user.nickname && (
                    <div className="mt-0.5 truncate text-[12px] text-[var(--text-tertiary)]">
                      {user.name}
                    </div>
                  )}
                  <div className="mt-1 truncate text-[12px] text-[var(--text-secondary)]">
                    Public roster profile
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="panel-terminal-muted p-3">
                  <div className="terminal-section-label">joined</div>
                  <div className="mt-2 font-mono text-[12px] text-[var(--text-primary)]">
                    {formatDate(user.createdAt)}
                  </div>
                </div>
                <div className="panel-terminal-muted p-3">
                  <div className="terminal-section-label">updated</div>
                  <div className="mt-2 font-mono text-[12px] text-[var(--text-primary)]">
                    {formatDate(user.updatedAt)}
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
