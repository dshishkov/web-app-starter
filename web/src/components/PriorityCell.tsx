import { PRIORITIES } from '../lib/data'

export default function PriorityCell({ priority }: { priority: string }) {
  const level = PRIORITIES.find((item) => item.id === priority)
  if (!level) return null

  const activeBar =
    priority === 'urgent'
      ? 'bg-[#fb565b] shadow-[0_0_12px_rgba(251,86,91,0.32)]'
      : priority === 'high'
        ? 'bg-[#ffba00] shadow-[0_0_12px_rgba(255,186,0,0.28)]'
        : 'bg-[var(--color-accent)] shadow-[0_0_12px_rgba(0,217,146,0.24)]'

  const bar = (active: boolean, height: number) => (
    <span
      className={`w-[3px] rounded-full ${active ? activeBar : 'bg-white/12'}`}
      style={{ height }}
    />
  )

  return (
    <span className="inline-flex items-center gap-2 text-[12px] text-[var(--text-secondary)]">
      <span className="inline-flex h-3 items-end gap-[2px]">
        {bar(level.bars >= 1, 5)}
        {bar(level.bars >= 2, 8)}
        {bar(level.bars >= 3, 11)}
      </span>
      <span className="font-medium">{level.label}</span>
    </span>
  )
}
