import { useCallback, useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { APP_META, DEFAULT_APP_CONFIG, PAGE_META } from '../lib/app-config'
import { AppContext } from '../lib/app-context'
import { useSession } from '../lib/auth-client'
import { FONT_STACKS } from '../lib/data'
import { useMe } from '../lib/hooks'
import type { AppConfig, AppUser } from '../lib/types'
import CommandPalette from '../overlays/CommandPalette'
import TweaksPanel from '../overlays/TweaksPanel'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

function toAppUser(user: {
  id: string
  name: string
  email: string
  image?: string | null
  nickname?: string | null
}): AppUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image ?? null,
    nickname: user.nickname ?? null,
  }
}

export default function Shell() {
  const location = useLocation()
  const { data: session, isPending: sessionPending } = useSession()
  const sessionUser = session?.user
  const { data: me } = useMe()

  const [config, setConfigState] = useState<AppConfig>(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(APP_META.storageKey) ?? 'null',
      )
      return { ...DEFAULT_APP_CONFIG, ...(saved ?? {}) }
    } catch {
      return DEFAULT_APP_CONFIG
    }
  })

  const currentUser = useMemo(() => {
    if (!sessionUser) return null
    if (me) return toAppUser(me)
    return toAppUser(sessionUser)
  }, [me, sessionUser])

  const userLoading = sessionPending

  const setConfig = useCallback((patch: Partial<AppConfig>) => {
    setConfigState((prev) => {
      const next = { ...prev, ...patch }
      localStorage.setItem(APP_META.storageKey, JSON.stringify(next))
      return next
    })
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = config.theme
    root.dataset.density = config.density
    root.style.setProperty('--accent-h', String(config.accent))
    root.style.setProperty(
      '--font-body',
      FONT_STACKS[config.font] ?? FONT_STACKS.inter,
    )
    root.classList.toggle('dark', config.theme === 'dark')
  }, [config])

  const [paletteOpen, setPaletteOpen] = useState<boolean>(false)
  const [tweaksOpen, setTweaksOpen] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  useEffect(() => {
    setMobileSidebarOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((p) => !p)
      } else if (e.key === 'Escape') {
        if (paletteOpen) setPaletteOpen(false)
        else if (tweaksOpen) setTweaksOpen(false)
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [paletteOpen, tweaksOpen])

  const toggleTheme = useCallback(
    () => setConfig({ theme: config.theme === 'light' ? 'dark' : 'light' }),
    [config.theme, setConfig],
  )

  const toggleDensity = useCallback(
    () =>
      setConfig({
        density: config.density === 'comfortable' ? 'compact' : 'comfortable',
      }),
    [config.density, setConfig],
  )

  const meta = PAGE_META[location.pathname] ?? PAGE_META['/']

  const ctx = useMemo(
    () => ({
      config,
      setConfig,
      currentUser,
      userLoading,
      paletteOpen,
      setPaletteOpen: setPaletteOpen,
      tweaksOpen,
      setTweaksOpen,
      toggleTheme,
      toggleDensity,
      mobileSidebarOpen,
      setMobileSidebarOpen,
    }),
    [
      config,
      setConfig,
      currentUser,
      userLoading,
      paletteOpen,
      tweaksOpen,
      toggleTheme,
      toggleDensity,
      mobileSidebarOpen,
    ],
  )

  return (
    <AppContext.Provider value={ctx}>
      <div
        className={`relative h-screen overflow-hidden ${config.sidebar === 'top' ? 'flex flex-col' : 'flex'} bg-[var(--bg-base)] text-[var(--text-primary)]`}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,217,146,0.14),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(129,140,248,0.08),transparent_24%)]" />
        </div>

        <Sidebar />

        <main className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
          <Topbar crumbs={meta.crumbs} />
          <div className="app-scrollbar flex-1 overflow-auto px-5 py-5 md:px-7 md:py-6">
            <div className="panel-terminal panel-grid mb-6 overflow-hidden">
              <div className="flex flex-col gap-6 p-5 md:flex-row md:items-end md:justify-between md:p-6">
                <div className="max-w-2xl">
                  <div className="terminal-section-label mb-3">
                    {meta.crumbs.join(' / ')}
                  </div>
                  <h1 className="font-display text-[30px] leading-[0.94] font-semibold tracking-[-0.05em] md:text-[38px]">
                    {meta.title}
                  </h1>
                  <p className="mt-3 max-w-xl text-[14px] leading-6 text-[var(--text-secondary)]">
                    {meta.sub}
                  </p>
                </div>
              </div>
            </div>

            <Outlet />
          </div>
        </main>

        {paletteOpen && (
          <CommandPalette onClose={() => setPaletteOpen(false)} />
        )}
        {tweaksOpen && <TweaksPanel onClose={() => setTweaksOpen(false)} />}
      </div>
    </AppContext.Provider>
  )
}
