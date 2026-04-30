interface ProgressBarProps {
  label: string
  value: number
  max: number
  color?: string
  showCount?: boolean
}

export default function ProgressBar({
  label,
  value,
  max,
  color,
  showCount = true,
}: ProgressBarProps) {
  const safeMax = Math.max(0, max)
  const rawPct = max > 0 ? Math.round((value / max) * 100) : 0
  const pct = Math.min(100, Math.max(0, rawPct))
  const safeValue = Math.min(safeMax, Math.max(0, value))

  return (
    <div className="panel-terminal-muted p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {color && (
            <span
              className="h-2.5 w-2.5 rounded-full shadow-[0_0_18px_currentColor]"
              style={{ color, background: color }}
            />
          )}
          <span className="text-[13px] font-medium text-[var(--text-primary)]">
            {label}
          </span>
        </div>
        {showCount && (
          <span className="font-mono text-[11px] text-[var(--text-tertiary)]">
            {value}/{max}
          </span>
        )}
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,rgba(0,217,146,0.85),rgba(47,214,161,0.55))] shadow-[0_0_20px_rgba(0,217,146,0.22)]"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={safeMax}
          aria-valuenow={safeValue}
        />
      </div>
    </div>
  )
}
