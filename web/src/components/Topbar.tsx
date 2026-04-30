import { useApp } from '../lib/app-context'
import { Icons } from './icons'
import Kbd from './Kbd'

export default function Topbar({ crumbs }: { crumbs: string[] }) {
  const {
    config,
    toggleTheme,
    toggleDensity,
    setPaletteOpen,
    setTweaksOpen,
    mobileSidebarOpen,
    setMobileSidebarOpen,
  } = useApp()

  return (
    <header className="shell-topbar relative z-10 flex h-[68px] shrink-0 items-center gap-3 border-b border-[var(--border-strong)] px-5 backdrop-blur-xl md:px-7">
      <div className="hidden min-w-[150px] flex-col md:flex">
        <div className="terminal-section-label">command surface</div>
        <div className="mt-2 flex items-center gap-1.5 text-[12px] text-[var(--text-secondary)]">
          {crumbs.map((crumb, index) => (
            <span key={crumb} className="flex items-center gap-1.5">
              {index > 0 && (
                <Icons.chevronRight
                  size={11}
                  className="text-[var(--text-tertiary)]"
                />
              )}
              <span
                className={
                  index === crumbs.length - 1
                    ? 'text-[var(--text-primary)]'
                    : ''
                }
              >
                {crumb}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="md:hidden">
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="icon-button"
          title="Toggle menu"
          aria-label="Toggle menu"
        >
          {mobileSidebarOpen ? <Icons.x size={16} /> : <Icons.menu size={16} />}
        </button>
      </div>

      <button
        onClick={() => setPaletteOpen(true)}
        className="flex h-11 min-w-0 flex-1 items-center gap-3 rounded-[18px] border border-[var(--border-strong)] bg-[var(--shell-control-bg)] px-4 text-[13px] text-[var(--text-secondary)] transition-all hover:border-[var(--shell-control-border-hover)] hover:bg-[var(--shell-control-bg-hover)] hover:text-[var(--text-primary)]"
        aria-label="Open command palette"
      >
        <Icons.search size={15} className="text-[var(--color-accent)]" />
        <span className="flex-1 truncate text-left">
          Search commands, toggle theme, or open the component catalog
        </span>
        <Kbd className="hidden sm:inline-flex">⌘K</Kbd>
      </button>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setTweaksOpen(true)}
          className="icon-button"
          title="Open tweaks"
          aria-label="Open design tweaks"
        >
          <Icons.sliders size={15} />
        </button>
        <button
          onClick={toggleDensity}
          className="icon-button"
          title={`Density: ${config.density}`}
          aria-label={`Switch density from ${config.density}`}
        >
          <Icons.sort size={15} />
        </button>
        <button
          onClick={toggleTheme}
          className="icon-button"
          title="Toggle theme"
          aria-label={`Switch to ${config.theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {config.theme === 'dark' ? (
            <Icons.sun size={15} />
          ) : (
            <Icons.moon size={15} />
          )}
        </button>
      </div>
    </header>
  )
}
