import { STATUSES } from '../lib/data'

const STATUS_STYLES: Record<string, { cls: string; dot: string }> = {
  todo: {
    cls: 'border-white/10 bg-white/[0.03] text-[var(--text-secondary)]',
    dot: 'bg-[#8b949e]',
  },
  progress: {
    cls: 'border-[rgba(0,217,146,0.18)] bg-[rgba(0,217,146,0.08)] text-[#7ef4c5]',
    dot: 'bg-[#00d992]',
  },
  review: {
    cls: 'border-[rgba(129,140,248,0.2)] bg-[rgba(129,140,248,0.1)] text-[#b9bdfd]',
    dot: 'bg-[#818cf8]',
  },
  blocked: {
    cls: 'border-[rgba(251,86,91,0.2)] bg-[rgba(251,86,91,0.1)] text-[#ffb4b6]',
    dot: 'bg-[#fb565b]',
  },
  done: {
    cls: 'border-[rgba(47,214,161,0.2)] bg-[rgba(47,214,161,0.1)] text-[#b6ffe0]',
    dot: 'bg-[#2fd6a1]',
  },
}

export { STATUS_STYLES }

export default function StatusPill({ status }: { status: string }) {
  const entry = STATUSES.find((item) => item.id === status)
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.todo

  return (
    <span
      className={`inline-flex h-[24px] items-center gap-1.5 rounded-full border px-2.5 font-mono text-[11px] tracking-[0.12em] uppercase ${style.cls}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full shadow-[0_0_14px_currentColor] ${style.dot}`}
      />
      {entry?.label ?? status}
    </span>
  )
}
