import { useState } from 'react'

import Avatar from '../components/Avatar'
import BarChart from '../components/BarChart'
import { Icons } from '../components/icons'
import Kbd from '../components/Kbd'
import PriorityCell from '../components/PriorityCell'
import ProgressBar from '../components/ProgressBar'
import Sparkline from '../components/Sparkline'
import StatusPill from '../components/StatusPill'
import { useApp } from '../lib/app-context'
import { DEMO_MEMBER, DEMO_TASK, PRIORITIES, STATUSES } from '../lib/data'
import TaskDrawer from '../overlays/TaskDrawer'
import TaskModal from '../overlays/TaskModal'

const SPARK_DATA = [12, 18, 14, 22, 19, 8, 6]
const BAR_DATA = [22, 25, 28, 24, 31, 29, 34, 38, 36, 42, 40, 45]
const BAR_LABELS = [
  'W1',
  'W2',
  'W3',
  'W4',
  'W5',
  'W6',
  'W7',
  'W8',
  'W9',
  'W10',
  'W11',
  'W12',
]

export default function Home() {
  const { setPaletteOpen, setTweaksOpen, toggleTheme, toggleDensity, config } =
    useApp()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="max-w-[1380px] space-y-8">
      {/* ── 1. Typography ─────────────────────────────────── */}
      <section className="panel-terminal overflow-hidden">
        <div className="border-b border-[var(--border-subtle)] px-5 py-4">
          <div className="terminal-section-label">typography</div>
          <div className="mt-2 text-[13px] text-[var(--text-secondary)]">
            Heading levels, body text, mono, and section labels.
          </div>
        </div>
        <div className="space-y-5 p-6">
          <div>
            <div className="terminal-section-label mb-2">display heading</div>
            <h2 className="font-display text-[42px] leading-[0.95] font-semibold tracking-[-0.055em]">
              The quick brown fox
            </h2>
          </div>
          <div>
            <div className="terminal-section-label mb-2">body</div>
            <p className="text-[14px] leading-7 text-[var(--text-secondary)]">
              Carbon-black surfaces, compressed typography, live code cues, and
              just enough electric green to make the interface feel powered on.
            </p>
          </div>
          <div>
            <div className="terminal-section-label mb-2">mono</div>
            <div className="font-mono text-[12.5px] leading-7 text-[var(--text-secondary)]">
              <div>// source = /api/users</div>
              <div>// mode = roster sync</div>
              <div>// uptime = stable</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Buttons & Chips ────────────────────────────── */}
      <section className="panel-terminal overflow-hidden">
        <div className="border-b border-[var(--border-subtle)] px-5 py-4">
          <div className="terminal-section-label">buttons & chips</div>
          <div className="mt-2 text-[13px] text-[var(--text-secondary)]">
            Four button variants and two chip types.
          </div>
        </div>
        <div className="space-y-4 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <button className="signal-button">
              <Icons.plus size={14} />
              Signal button
            </button>
            <button className="ghost-button">Ghost button</button>
            <button className="icon-button" title="Icon button">
              <Icons.bell size={15} />
            </button>
            <button className="icon-button" title="Another icon">
              <Icons.sliders size={15} />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="terminal-chip-strong">emerald chip</span>
            <span className="terminal-chip">standard chip</span>
            <span className="terminal-chip-strong">
              <Icons.search size={12} />
              With icon
            </span>
            <span className="terminal-chip">
              <Icons.tag size={12} />
              #tagged
            </span>
          </div>
        </div>
      </section>

      {/* ── 3. Form Inputs ────────────────────────────────── */}
      <section className="panel-terminal overflow-hidden">
        <div className="border-b border-[var(--border-subtle)] px-5 py-4">
          <div className="terminal-section-label">form inputs</div>
          <div className="mt-2 text-[13px] text-[var(--text-secondary)]">
            terminal-input, terminal-select, and terminal-textarea.
          </div>
        </div>
        <div className="grid gap-4 p-6 md:grid-cols-2">
          <div>
            <div className="terminal-section-label mb-2">input</div>
            <input
              readOnly
              value="Editable text field"
              className="terminal-input"
            />
          </div>
          <div>
            <div className="terminal-section-label mb-2">select</div>
            <select className="terminal-select">
              {STATUSES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <div className="terminal-section-label mb-2">textarea</div>
            <textarea
              readOnly
              value="Multi-line text area for longer content. The terminal-textarea class applies the design system styling."
              className="terminal-textarea"
            />
          </div>
        </div>
      </section>

      {/* ── 4. Key Components ─────────────────────────────── */}
      <section className="panel-terminal overflow-hidden">
        <div className="border-b border-[var(--border-subtle)] px-5 py-4">
          <div className="terminal-section-label">key components</div>
          <div className="mt-2 text-[13px] text-[var(--text-secondary)]">
            Avatar, Kbd, Sparkline, StatusPill, PriorityCell, BarChart,
            ProgressBar.
          </div>
        </div>
        <div className="space-y-6 p-6">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="terminal-section-label w-20">Avatar</div>
              <Avatar member={DEMO_MEMBER} size={36} />
              <Avatar member={{ ...DEMO_MEMBER, hue: 30 }} size={28} />
              <Avatar member={{ ...DEMO_MEMBER, hue: 210 }} size={22} />
            </div>
            <div className="flex items-center gap-3">
              <div className="terminal-section-label w-20">Kbd</div>
              <Kbd>⌘K</Kbd>
              <Kbd>Esc</Kbd>
              <Kbd>↵</Kbd>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="terminal-section-label w-20">Sparkline</div>
              <div className="w-32">
                <Sparkline data={SPARK_DATA} />
              </div>
              <div className="w-32">
                <Sparkline data={[2, 4, 3, 5, 6, 4, 7]} color="#b9bdfd" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="terminal-section-label w-20">Status</div>
              {STATUSES.map((s) => (
                <StatusPill key={s.id} status={s.id} />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="terminal-section-label w-20">Priority</div>
              {PRIORITIES.map((p) => (
                <PriorityCell key={p.id} priority={p.id} />
              ))}
            </div>
          </div>

          <div>
            <div className="terminal-section-label mb-3">BarChart</div>
            <div className="panel-terminal-muted p-4">
              <BarChart
                data={BAR_DATA}
                labels={BAR_LABELS}
                activeLastN={4}
                height={180}
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <ProgressBar
              label="Platform v2.4"
              max={14}
              value={9}
              color="oklch(0.72 0.17 275)"
            />
            <ProgressBar
              label="Mobile Onboarding"
              max={8}
              value={5}
              color="oklch(0.72 0.17 155)"
            />
            <ProgressBar
              label="Billing Rework"
              max={12}
              value={3}
              color="oklch(0.72 0.17 30)"
            />
            <ProgressBar
              label="Design System"
              max={20}
              value={18}
              color="oklch(0.72 0.17 210)"
            />
          </div>
        </div>
      </section>

      {/* ── 5. Cards & Panels ──────────────────────────────── */}
      <section className="panel-terminal overflow-hidden">
        <div className="border-b border-[var(--border-subtle)] px-5 py-4">
          <div className="terminal-section-label">cards & panels</div>
          <div className="mt-2 text-[13px] text-[var(--text-secondary)]">
            Stat cards with sparklines, progress panels, and activity rows.
          </div>
        </div>
        <div className="space-y-6 p-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: 'open queue',
                value: 14,
                detail: '6 actively moving',
                spark: [12, 18, 14, 22, 19, 8, 6],
                tone: 'text-[var(--color-accent)]',
              },
              {
                label: 'review load',
                value: 4,
                detail: '1 blocked',
                spark: [1, 2, 1, 3, 2, 3, 4],
                tone: 'text-[#b9bdfd]',
              },
              {
                label: 'completion rate',
                value: '64%',
                detail: '9 done',
                spark: [2, 4, 3, 5, 6, 4, 7],
                tone: 'text-[#b6ffe0]',
              },
              {
                label: 'team online',
                value: 6,
                detail: 'operators synced',
                spark: [4, 5, 5, 6, 6, 5, 6],
                tone: 'text-[var(--text-primary)]',
              },
            ].map((card) => (
              <div key={card.label} className="panel-terminal p-4">
                <div className="terminal-section-label">{card.label}</div>
                <div
                  className={`mt-3 text-[30px] leading-none font-semibold tracking-[-0.05em] ${card.tone}`}
                >
                  {card.value}
                </div>
                <div className="mt-2 text-[12px] text-[var(--text-secondary)]">
                  {card.detail}
                </div>
                <div className="mt-4 h-8">
                  <Sparkline data={card.spark} />
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="panel-terminal-muted p-4">
              <div className="flex items-start gap-3">
                <Avatar member={DEMO_MEMBER} size={28} />
                <div className="min-w-0 flex-1 text-[13px] leading-6">
                  <span className="font-medium text-[var(--text-primary)]">
                    {DEMO_MEMBER.name}
                  </span>{' '}
                  <span className="text-[var(--text-secondary)]">
                    merged pull request #5890 into main
                  </span>
                </div>
                <span className="font-mono text-[11px] text-[var(--text-tertiary)]">
                  12m
                </span>
              </div>
            </div>
            <div className="panel-terminal-muted p-4">
              <div className="flex items-start gap-3">
                <Avatar
                  member={{ ...DEMO_MEMBER, hue: 30, initials: 'MO' }}
                  size={28}
                />
                <div className="min-w-0 flex-1 text-[13px] leading-6">
                  <span className="font-medium text-[var(--text-primary)]">
                    Miguel Ortiz
                  </span>{' '}
                  <span className="text-[var(--text-secondary)]">
                    opened FRN-283 with priority Urgent
                  </span>
                </div>
                <span className="font-mono text-[11px] text-[var(--text-tertiary)]">
                  2h
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Overlay Triggers ────────────────────────────── */}
      <section className="panel-terminal overflow-hidden">
        <div className="border-b border-[var(--border-subtle)] px-5 py-4">
          <div className="terminal-section-label">overlays</div>
          <div className="mt-2 text-[13px] text-[var(--text-secondary)]">
            Click to open each overlay. Press Esc to close.
          </div>
        </div>
        <div className="flex flex-wrap gap-3 p-5">
          <button
            onClick={() => setPaletteOpen(true)}
            className="signal-button"
          >
            <Icons.search size={14} />
            Command Palette <Kbd>⌘K</Kbd>
          </button>
          <button onClick={() => setDrawerOpen(true)} className="ghost-button">
            <Icons.tasks size={14} />
            Task Drawer
          </button>
          <button onClick={() => setModalOpen(true)} className="ghost-button">
            <Icons.plus size={14} />
            Task Modal
          </button>
          <button onClick={() => setTweaksOpen(true)} className="ghost-button">
            <Icons.sliders size={14} />
            Tweaks Panel
          </button>
          <button onClick={toggleTheme} className="ghost-button">
            {config.theme === 'dark' ? (
              <Icons.sun size={14} />
            ) : (
              <Icons.moon size={14} />
            )}{' '}
            Toggle theme
          </button>
          <button onClick={toggleDensity} className="ghost-button">
            <Icons.sort size={14} />
            Toggle density
          </button>
        </div>
      </section>

      {/* ── 7. Loading & Empty States ─────────────────────── */}
      <section className="panel-terminal overflow-hidden">
        <div className="border-b border-[var(--border-subtle)] px-5 py-4">
          <div className="terminal-section-label">loading & empty states</div>
          <div className="mt-2 text-[13px] text-[var(--text-secondary)]">
            Spinner and empty state patterns.
          </div>
        </div>
        <div className="grid gap-4 p-6 md:grid-cols-2">
          <div className="terminal-empty panel-terminal-muted min-h-[200px]">
            <div className="flex flex-col items-center gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[var(--color-accent)]" />
              <div className="terminal-section-label">syncing data</div>
            </div>
          </div>
          <div className="terminal-empty panel-terminal-muted min-h-[200px]">
            <div>
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-[20px] border border-[rgba(0,217,146,0.18)] bg-[rgba(0,217,146,0.08)] text-[var(--color-accent)] shadow-[0_0_30px_rgba(0,217,146,0.14)]">
                <Icons.inbox size={20} />
              </div>
              <div className="terminal-section-label mt-5">no results</div>
              <h3 className="font-display mt-3 text-[24px] font-semibold tracking-[-0.05em] text-[var(--text-primary)]">
                Nothing here yet.
              </h3>
              <p className="mt-3 text-[14px] text-[var(--text-secondary)]">
                This empty state panel is ready for a real feature when you want
                to build it out.
              </p>
            </div>
          </div>
        </div>
      </section>

      {drawerOpen && (
        <TaskDrawer task={DEMO_TASK} onClose={() => setDrawerOpen(false)} />
      )}
      {modalOpen && <TaskModal onClose={() => setModalOpen(false)} />}
    </div>
  )
}
