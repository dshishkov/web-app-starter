import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Icons } from '../components/icons'
import Kbd from '../components/Kbd'
import { APP_NAV_ITEMS } from '../lib/app-config'
import { useApp } from '../lib/app-context'

interface Props {
  onClose: () => void
}

interface CommandItem {
  group: string
  id: string
  label: string
  icon: typeof Icons.search
  shortcut?: string
  run: () => void
}

export default function CommandPalette({ onClose }: Props) {
  const { toggleTheme } = useApp()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 20)
  }, [])

  const commands = useMemo<CommandItem[]>(
    () => [
      {
        group: 'Actions',
        id: 'toggle-theme',
        label: 'Toggle theme',
        icon: Icons.moon,
        run: () => {
          toggleTheme()
          onClose()
        },
      },
      ...APP_NAV_ITEMS.map((item) => ({
        group: 'Navigate',
        id: item.id,
        label: item.commandLabel,
        icon: Icons[item.icon],
        shortcut: item.shortcut,
        run: () => {
          void navigate(item.path)
          onClose()
        },
      })),
    ],
    [navigate, onClose, toggleTheme],
  )

  const filtered = useMemo(() => {
    if (!query.trim()) return commands
    const lowered = query.toLowerCase()
    return commands.filter((command) =>
      command.label.toLowerCase().includes(lowered),
    )
  }, [commands, query])

  useEffect(() => setActive(0), [query])

  const groups = useMemo(() => {
    const map = new Map<string, CommandItem[]>()
    filtered.forEach((command) => {
      const current = map.get(command.group) ?? []
      current.push(command)
      map.set(command.group, current)
    })
    return [...map.entries()]
  }, [filtered])

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActive((current) => Math.min(current + 1, filtered.length - 1))
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((current) => Math.max(current - 1, 0))
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      filtered[active]?.run()
      return
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
    }
  }

  let flatIndex = -1

  return (
    <div
      className="terminal-overlay fixed inset-0 z-[60] grid animate-[fadeIn_100ms_ease] place-items-start justify-items-center px-4 pt-[10vh]"
      onClick={onClose}
    >
      <div
        className="panel-terminal w-[720px] max-w-full overflow-hidden"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={onKeyDown}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] px-5 py-4">
          <Icons.search size={15} className="text-[var(--color-accent)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search commands or routes"
            aria-label="Search commands or routes"
            className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-[var(--text-tertiary)]"
          />
          <Kbd>Esc</Kbd>
        </div>

        <div className="app-scrollbar max-h-[460px] overflow-auto p-3">
          {groups.length === 0 && (
            <div className="terminal-empty panel-terminal-muted min-h-[220px]">
              <div className="text-[13px] text-[var(--text-tertiary)]">
                No matching commands.
              </div>
            </div>
          )}

          {groups.map(([group, items]) => (
            <div key={group} className="mb-4 last:mb-0">
              <div className="terminal-section-label px-2 pb-2">{group}</div>
              <div className="space-y-1">
                {items.map((command) => {
                  flatIndex += 1
                  const isActive = flatIndex === active
                  const Icon = command.icon
                  const currentIndex = flatIndex

                  return (
                    <button
                      key={command.id}
                      onMouseEnter={() => setActive(currentIndex)}
                      onClick={() => command.run()}
                      className={`flex w-full items-center gap-3 rounded-[16px] border px-3 py-3 text-left transition-all ${
                        isActive
                          ? 'border-[rgba(0,217,146,0.24)] bg-[rgba(0,217,146,0.08)] text-[var(--text-primary)]'
                          : 'border-transparent text-[var(--text-secondary)] hover:border-[var(--border-subtle)] hover:bg-white/[0.04]'
                      }`}
                    >
                      <span className="grid h-9 w-9 place-items-center rounded-[12px] border border-white/8 bg-white/[0.03]">
                        <Icon size={15} />
                      </span>
                      <span className="flex-1 truncate text-[13px]">
                        {command.label}
                      </span>
                      {command.shortcut && <Kbd>{command.shortcut}</Kbd>}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 border-t border-[var(--border-subtle)] px-5 py-3 font-mono text-[11px] text-[var(--text-tertiary)]">
          <span>↑↓ navigate</span>
          <span>↵ run</span>
          <span>Esc close</span>
        </div>
      </div>
    </div>
  )
}
