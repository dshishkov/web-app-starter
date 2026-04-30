import { useQueryClient } from '@tanstack/react-query'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate } from 'react-router-dom'

import { APP_META, APP_NAV_ITEMS, AUTH_UI } from '../lib/app-config'
import { useApp } from '../lib/app-context'
import { authClient, signOut, useSession } from '../lib/auth-client'
import { gradientFor, hueFor, initialsFor } from '../lib/utils'
import { Icons } from './icons'

const MENU_GAP = 12
const MENU_EXIT_MS = 220
const MENU_MIN_WIDTH = 236
const MENU_ICON_WIDTH = 208

export default function Sidebar() {
  const {
    config,
    currentUser,
    userLoading,
    mobileSidebarOpen,
    setMobileSidebarOpen,
  } = useApp()
  const { data: session } = useSession()
  const sessionUserData = session?.user
  const queryClient = useQueryClient()
  const location = useLocation()
  const navigate = useNavigate()
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuMounted, setMenuMounted] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [menuPosition, setMenuPosition] = useState<{
    bottom: number
    left: number
    width: number
  } | null>(null)

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (menuOpen) {
      setMenuMounted(true)
      return
    }

    const timeout = window.setTimeout(() => {
      setMenuMounted(false)
    }, MENU_EXIT_MS)

    return () => window.clearTimeout(timeout)
  }, [menuOpen])

  const go = (path: string) => {
    void navigate(path)
  }
  const signIn = () => {
    void authClient.signIn.social({
      provider: AUTH_UI.provider,
      callbackURL: AUTH_UI.callbackURL,
    })
  }

  const handleSignOut = async () => {
    try {
      setSigningOut(true)
      await signOut()
      queryClient.clear()
      setMenuOpen(false)
      void navigate(AUTH_UI.postSignOutPath)
    } finally {
      setSigningOut(false)
    }
  }

  const sessionUser = useMemo(() => {
    if (!sessionUserData) return null

    return {
      id: sessionUserData.id,
      name: sessionUserData.name,
      email: sessionUserData.email,
      image: sessionUserData.image ?? null,
      nickname: sessionUserData.nickname ?? null,
    }
  }, [sessionUserData])

  const displayUser = currentUser ?? sessionUser
  const userName =
    displayUser?.nickname || displayUser?.name || 'Workspace user'
  const userSecondary = displayUser?.nickname
    ? displayUser.name
    : displayUser?.email || 'Synced from backend auth'
  const userHue = displayUser ? hueFor(displayUser.name) : 160
  const userInitials = displayUser ? initialsFor(displayUser.name) : 'U'

  const isTop = config.sidebar === 'top'
  const isIcon = config.sidebar === 'icon'

  const updateMenuPosition = useCallback(() => {
    if (typeof window === 'undefined' || !triggerRef.current) return

    const rect = triggerRef.current.getBoundingClientRect()
    const width = isIcon
      ? MENU_ICON_WIDTH
      : Math.max(MENU_MIN_WIDTH, rect.width)
    const unclampedLeft = isIcon
      ? rect.left + rect.width / 2 - width / 2
      : rect.right - width
    const left = Math.min(
      window.innerWidth - width - MENU_GAP,
      Math.max(MENU_GAP, unclampedLeft),
    )
    const bottom = Math.max(MENU_GAP, window.innerHeight - rect.top + MENU_GAP)

    setMenuPosition({ bottom, left, width })
  }, [isIcon])

  useLayoutEffect(() => {
    if (!menuMounted) return
    updateMenuPosition()
  }, [menuMounted, updateMenuPosition])

  useEffect(() => {
    if (!menuMounted) return

    const syncPosition = () => updateMenuPosition()

    window.addEventListener('resize', syncPosition)
    window.addEventListener('scroll', syncPosition, true)

    return () => {
      window.removeEventListener('resize', syncPosition)
      window.removeEventListener('scroll', syncPosition, true)
    }
  }, [menuMounted, updateMenuPosition])

  const userMenu =
    displayUser && menuMounted && menuPosition
      ? createPortal(
          <>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close user menu"
              className={`fixed inset-0 z-[70] bg-transparent transition-opacity duration-200 ${
                menuOpen
                  ? 'pointer-events-auto opacity-100'
                  : 'pointer-events-none opacity-0'
              }`}
            />
            <div
              style={{
                bottom: `${menuPosition.bottom}px`,
                left: `${menuPosition.left}px`,
                width: `${menuPosition.width}px`,
                transformOrigin: isIcon ? 'bottom center' : 'bottom right',
              }}
              className={`panel-terminal fixed z-[80] transform-gpu overflow-hidden p-2 transition-[opacity,transform] duration-220 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                menuOpen
                  ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                  : 'pointer-events-none translate-y-2 scale-[0.98] opacity-0'
              }`}
              role="menu"
              aria-label="User menu"
            >
              <button
                onClick={() => {
                  setMenuOpen(false)
                  void navigate(AUTH_UI.profilePath)
                }}
                className="flex w-full items-center gap-2 rounded-[14px] px-3 py-2 text-left text-[13px] text-[var(--text-secondary)] transition hover:bg-white/[0.05] hover:text-[var(--text-primary)]"
                role="menuitem"
              >
                <Icons.user size={14} />
                Profile settings
              </button>
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="mt-1 flex w-full items-center gap-2 rounded-[14px] px-3 py-2 text-left text-[13px] text-[var(--color-danger-text)] transition hover:bg-[var(--color-danger-soft)] disabled:opacity-50"
                role="menuitem"
              >
                <Icons.logout size={14} />
                {signingOut ? AUTH_UI.signingOutLabel : AUTH_UI.signOutLabel}
              </button>
            </div>
          </>,
          document.body,
        )
      : null

  if (isTop) {
    return (
      <header className="shell-topbar relative z-10 flex h-16 shrink-0 items-center gap-6 border-b border-[var(--border-strong)] px-5 backdrop-blur-xl md:px-7">
        <div className="flex items-center gap-3">
          <span className="font-display grid h-9 w-9 place-items-center rounded-[14px] border border-[rgba(0,217,146,0.3)] bg-[linear-gradient(135deg,rgba(0,217,146,0.18),rgba(0,217,146,0.04))] text-[13px] font-semibold text-[var(--text-primary)] shadow-[0_0_28px_rgba(0,217,146,0.12)]">
            {APP_META.logoMark}
          </span>
          <div>
            <div className="font-display text-[14px] font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
              {APP_META.name}
            </div>
            <div className="terminal-section-label mt-1">
              {APP_META.tagline}
            </div>
          </div>
        </div>

        <nav className="app-scrollbar flex flex-1 items-center gap-2 overflow-x-auto">
          {APP_NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path
            const I = Icons[item.icon]
            return (
              <button
                key={item.id}
                onClick={() => go(item.path)}
                aria-current={active ? 'page' : undefined}
                className={`relative inline-flex items-center gap-2 rounded-[14px] border px-3 py-2 text-[12.5px] font-medium transition-all ${
                  active ? 'nav-button-active' : 'nav-button-idle'
                }`}
              >
                <I size={15} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {userMenu}
      </header>
    )
  }

  return (
    <>
      <aside
        className={`shell-sidebar relative z-10 hidden flex-col border-r border-[var(--border-strong)] backdrop-blur-xl transition-[width] duration-200 ease-out md:flex ${isIcon ? 'w-[78px]' : 'w-[290px]'}`}
      >
        <div
          className={`border-b border-[var(--border-subtle)] ${isIcon ? 'px-0 py-5' : 'px-5 py-5'}`}
        >
          <div
            className={`flex items-center gap-3 ${isIcon ? 'justify-center' : ''}`}
          >
            <span className="font-display grid h-11 w-11 place-items-center rounded-[16px] border border-[rgba(0,217,146,0.3)] bg-[linear-gradient(135deg,rgba(0,217,146,0.2),rgba(0,217,146,0.05))] text-[15px] font-semibold text-[var(--text-primary)] shadow-[0_0_32px_rgba(0,217,146,0.14)]">
              {APP_META.logoMark}
            </span>
            {!isIcon && (
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display text-[17px] font-semibold tracking-[-0.05em] text-[var(--text-primary)]">
                    {APP_META.name}
                  </span>
                  <span className="signal-dot" />
                </div>
                <div className="terminal-section-label mt-2">
                  {APP_META.tagline}
                </div>
              </div>
            )}
          </div>
        </div>

        {!isIcon && (
          <div className="px-5 pt-5">
            <div className="terminal-section-label">navigation</div>
          </div>
        )}

        <nav
          className={`flex flex-col gap-2 ${isIcon ? 'px-3 py-4' : 'px-4 py-4'}`}
        >
          {APP_NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path
            const I = Icons[item.icon]
            return (
              <button
                key={item.id}
                onClick={() => go(item.path)}
                title={isIcon ? item.label : undefined}
                aria-label={isIcon ? item.label : undefined}
                aria-current={active ? 'page' : undefined}
                className={`group relative flex items-center gap-3 overflow-hidden rounded-[18px] border text-[13px] transition-all ${
                  isIcon ? 'h-12 justify-center px-0' : 'px-3 py-3'
                } ${active ? 'nav-button-active' : 'nav-button-idle'}`}
              >
                {active && !isIcon && (
                  <span className="absolute top-2 bottom-2 left-0 w-[2px] rounded-r-full bg-[var(--color-accent)]" />
                )}
                <I size={16} />
                {!isIcon && (
                  <span className="flex-1 text-left font-medium">
                    {item.label}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <div
          className={`mt-auto border-t border-[var(--border-subtle)] ${isIcon ? 'p-3' : 'p-4'}`}
        >
          {displayUser ? (
            <button
              ref={triggerRef}
              onClick={() => setMenuOpen((open) => !open)}
              title={userName}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              className={`relative z-30 w-full rounded-[20px] border border-[var(--border-subtle)] bg-[var(--shell-control-bg)] transition hover:border-[var(--shell-control-border-hover)] hover:bg-[var(--shell-control-bg-hover)] ${
                isIcon
                  ? 'flex justify-center p-2.5'
                  : 'flex items-center gap-3 p-3'
              }`}
            >
              {displayUser.image ? (
                <img
                  src={displayUser.image}
                  alt={userName}
                  referrerPolicy="no-referrer"
                  className="h-10 w-10 rounded-[14px] border border-white/10 object-cover"
                />
              ) : (
                <span
                  className="inline-grid h-10 w-10 place-items-center rounded-[14px] border border-white/10 text-[12px] font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
                  style={{
                    background: gradientFor(userHue),
                  }}
                >
                  {userInitials}
                </span>
              )}
              {!isIcon && (
                <>
                  <div className="min-w-0 flex-1 text-left">
                    <div className="truncate text-[13px] font-medium text-[var(--text-primary)]">
                      {userName}
                    </div>
                    <div className="mt-1 truncate text-[11px] text-[var(--text-tertiary)]">
                      {userSecondary}
                    </div>
                  </div>
                  <Icons.chevronRight
                    size={14}
                    className={`shrink-0 text-[var(--text-tertiary)] transition-transform duration-300 ${
                      menuOpen ? '-rotate-90' : 'rotate-90'
                    }`}
                  />
                </>
              )}
            </button>
          ) : (
            <div
              className={`rounded-[20px] border border-[var(--border-subtle)] bg-[var(--shell-control-bg)] ${
                isIcon ? 'flex justify-center p-2.5' : 'p-3'
              }`}
            >
              {isIcon ? (
                <button
                  onClick={signIn}
                  className="icon-button h-10 w-10 rounded-[16px]"
                  title={
                    userLoading
                      ? AUTH_UI.checkingSessionLabel
                      : AUTH_UI.signInLabel
                  }
                  disabled={userLoading}
                >
                  <Icons.user size={16} />
                </button>
              ) : (
                <>
                  <div className="mb-3 flex items-center gap-3">
                    <span className="inline-grid h-10 w-10 place-items-center rounded-[14px] border border-[var(--border-subtle)] bg-[var(--shell-control-bg-hover)] text-[var(--text-secondary)]">
                      <Icons.user size={16} />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[13px] font-medium text-[var(--text-primary)]">
                        {userLoading
                          ? AUTH_UI.checkingSessionTitle
                          : AUTH_UI.signedOutTitle}
                      </div>
                      <div className="mt-1 text-[11px] text-[var(--text-tertiary)]">
                        {AUTH_UI.signedOutDescription}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={signIn}
                    className="signal-button w-full"
                    disabled={userLoading}
                  >
                    <Icons.user size={15} />
                    {AUTH_UI.signInLabel}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {userMenu}
      </aside>

      {mobileSidebarOpen && (
        <>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            aria-label="Close sidebar"
          />
          <aside
            className={`shell-sidebar fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[var(--border-strong)] backdrop-blur-xl transition-transform duration-200 ease-out md:hidden ${isIcon ? 'w-[78px]' : 'w-[290px]'}`}
          >
            <div
              className={`border-b border-[var(--border-subtle)] ${isIcon ? 'px-0 py-5' : 'px-5 py-5'}`}
            >
              <div
                className={`flex items-center gap-3 ${isIcon ? 'justify-center' : ''}`}
              >
                <span className="font-display grid h-11 w-11 place-items-center rounded-[16px] border border-[rgba(0,217,146,0.3)] bg-[linear-gradient(135deg,rgba(0,217,146,0.2),rgba(0,217,146,0.05))] text-[15px] font-semibold text-[var(--text-primary)] shadow-[0_0_32px_rgba(0,217,146,0.14)]">
                  {APP_META.logoMark}
                </span>
                {!isIcon && (
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-[17px] font-semibold tracking-[-0.05em] text-[var(--text-primary)]">
                        {APP_META.name}
                      </span>
                      <span className="signal-dot" />
                    </div>
                    <div className="terminal-section-label mt-2">
                      {APP_META.tagline}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="px-5 pt-5">
              <div className="terminal-section-label">navigation</div>
            </div>

            <nav className="flex flex-col gap-2 px-4 py-4">
              {APP_NAV_ITEMS.map((item) => {
                const active = location.pathname === item.path
                const I = Icons[item.icon]
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      go(item.path)
                      setMobileSidebarOpen(false)
                    }}
                    aria-current={active ? 'page' : undefined}
                    className={`group relative flex items-center gap-3 overflow-hidden rounded-[18px] border px-3 py-3 text-[13px] transition-all ${active ? 'nav-button-active' : 'nav-button-idle'}`}
                  >
                    {active && (
                      <span className="absolute top-2 bottom-2 left-0 w-[2px] rounded-r-full bg-[var(--color-accent)]" />
                    )}
                    <I size={16} />
                    <span className="flex-1 text-left font-medium">
                      {item.label}
                    </span>
                  </button>
                )
              })}
            </nav>

            <div className="mt-auto border-t border-[var(--border-subtle)] p-4">
              {displayUser ? (
                <button
                  onClick={() => {
                    setMobileSidebarOpen(false)
                    void navigate(AUTH_UI.profilePath)
                  }}
                  className="flex w-full items-center gap-3 rounded-[20px] border border-[var(--border-subtle)] bg-[var(--shell-control-bg)] p-3 transition hover:border-[var(--shell-control-border-hover)] hover:bg-[var(--shell-control-bg-hover)]"
                >
                  {displayUser.image ? (
                    <img
                      src={displayUser.image}
                      alt={userName}
                      referrerPolicy="no-referrer"
                      className="h-10 w-10 rounded-[14px] border border-white/10 object-cover"
                    />
                  ) : (
                    <span
                      className="inline-grid h-10 w-10 place-items-center rounded-[14px] border border-white/10 text-[12px] font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
                      style={{ background: gradientFor(userHue) }}
                    >
                      {userInitials}
                    </span>
                  )}
                  <div className="min-w-0 flex-1 text-left">
                    <div className="truncate text-[13px] font-medium text-[var(--text-primary)]">
                      {userName}
                    </div>
                    <div className="mt-1 truncate text-[11px] text-[var(--text-tertiary)]">
                      {userSecondary}
                    </div>
                  </div>
                </button>
              ) : (
                <div className="rounded-[20px] border border-[var(--border-subtle)] bg-[var(--shell-control-bg)] p-3">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="inline-grid h-10 w-10 place-items-center rounded-[14px] border border-[var(--border-subtle)] bg-[var(--shell-control-bg-hover)] text-[var(--text-secondary)]">
                      <Icons.user size={16} />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[13px] font-medium text-[var(--text-primary)]">
                        {userLoading
                          ? AUTH_UI.checkingSessionTitle
                          : AUTH_UI.signedOutTitle}
                      </div>
                      <div className="mt-1 text-[11px] text-[var(--text-tertiary)]">
                        {AUTH_UI.signedOutDescription}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={signIn}
                    className="signal-button w-full"
                    disabled={userLoading}
                  >
                    <Icons.user size={15} />
                    {AUTH_UI.signInLabel}
                  </button>
                </div>
              )}
            </div>
          </aside>
        </>
      )}
    </>
  )
}
