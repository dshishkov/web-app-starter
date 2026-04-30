import { useEffect, useRef } from 'react'

import { Icons } from '../components/icons'
import { useApp } from '../lib/app-context'

interface Props {
  onClose: () => void
}

const ACCENTS = [
  { name: 'signal', h: 160 },
  { name: 'indigo', h: 275 },
  { name: 'violet', h: 305 },
  { name: 'blue', h: 245 },
  { name: 'sky', h: 230 },
  { name: 'copper', h: 55 },
  { name: 'amber', h: 70 },
  { name: 'rose', h: 15 },
]

const FONTS = [
  { id: 'jakarta', label: 'Jakarta Sans' },
  { id: 'inter', label: 'Inter' },
  { id: 'ibm-plex', label: 'IBM Plex Sans' },
  { id: 'jetbrains', label: 'JetBrains Mono' },
]

export default function TweaksPanel({ onClose }: Props) {
  const { config, setConfig } = useApp()
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeButtonRef.current?.focus()
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div
      className="panel-terminal animate-scale-in fixed right-5 bottom-5 z-[80] w-[320px] overflow-hidden"
      role="dialog"
      aria-modal="false"
      aria-label="Design tweaks"
    >
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-3.5">
        <div>
          <div className="terminal-section-label">tweaks</div>
          <div className="mt-1 text-[12px] text-[var(--text-secondary)]">
            Tune the command surface.
          </div>
        </div>
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="icon-button h-8 w-8"
          aria-label="Close tweaks panel"
        >
          <Icons.x size={12} />
        </button>
      </div>

      <div className="space-y-4 p-4">
        <section>
          <div className="terminal-section-label mb-2">accent</div>
          <div className="flex flex-wrap gap-2">
            {ACCENTS.map((accent) => (
              <button
                key={accent.name}
                title={accent.name}
                aria-label={`Set accent to ${accent.name}`}
                onClick={() => setConfig({ accent: accent.h })}
                className={`h-7 w-7 rounded-full transition-all ${
                  config.accent === accent.h
                    ? 'scale-110 ring-2 ring-[var(--text-primary)]'
                    : 'ring-1 ring-white/10'
                }`}
                style={{ background: `oklch(0.68 0.18 ${accent.h})` }}
              />
            ))}
          </div>
        </section>

        <section>
          <div className="terminal-section-label mb-2">font</div>
          <div className="grid grid-cols-2 gap-2">
            {FONTS.map((font) => (
              <button
                key={font.id}
                onClick={() => setConfig({ font: font.id })}
                className={
                  config.font === font.id
                    ? 'terminal-chip-strong !h-10 !justify-center'
                    : 'terminal-chip !h-10 !justify-center'
                }
              >
                {font.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="terminal-section-label mb-2">density</div>
          <div className="grid grid-cols-2 gap-2">
            {(['comfortable', 'compact'] as const).map((density) => (
              <button
                key={density}
                onClick={() => setConfig({ density })}
                className={
                  config.density === density
                    ? 'terminal-chip-strong !h-10 !justify-center capitalize'
                    : 'terminal-chip !h-10 !justify-center capitalize'
                }
              >
                {density}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="terminal-section-label mb-2">layout</div>
          <div className="grid grid-cols-3 gap-2">
            {(['labeled', 'icon', 'top'] as const).map((sidebar) => (
              <button
                key={sidebar}
                onClick={() => setConfig({ sidebar })}
                className={
                  config.sidebar === sidebar
                    ? 'terminal-chip-strong !h-10 !justify-center capitalize'
                    : 'terminal-chip !h-10 !justify-center capitalize'
                }
              >
                {sidebar}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="terminal-section-label mb-2">theme</div>
          <div className="grid grid-cols-2 gap-2">
            {(['light', 'dark'] as const).map((theme) => (
              <button
                key={theme}
                onClick={() => setConfig({ theme })}
                className={
                  config.theme === theme
                    ? 'terminal-chip-strong !h-10 !justify-center capitalize'
                    : 'terminal-chip !h-10 !justify-center capitalize'
                }
              >
                {theme}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
