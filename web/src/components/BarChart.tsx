interface BarChartProps {
  data: number[]
  labels?: string[]
  activeLastN?: number
  height?: number
  label?: string
}

export default function BarChart({
  data,
  labels,
  activeLastN = 4,
  height = 224,
  label,
}: BarChartProps) {
  const max = Math.max(...data, 0)

  if (data.length === 0) {
    return (
      <div
        className="grid place-items-center text-[12px] text-[var(--text-tertiary)]"
        style={{ height }}
      >
        No chart data
      </div>
    )
  }

  return (
    <div
      className="flex items-end gap-2"
      style={{ height }}
      role={label ? 'img' : undefined}
      aria-label={label}
    >
      {data.map((value, index) => {
        const pct = max > 0 ? (value / max) * 100 : 0
        const active = index >= data.length - activeLastN

        return (
          <div
            key={index}
            className="flex min-w-0 flex-1 flex-col items-center gap-2"
          >
            <div className="flex h-full w-full items-end rounded-t-[14px] border border-white/6 bg-white/[0.02] p-1.5">
              <div
                className={`w-full rounded-[10px] transition-all ${active ? 'bg-[linear-gradient(180deg,rgba(0,217,146,0.92),rgba(0,217,146,0.28))] shadow-[0_0_24px_rgba(0,217,146,0.24)]' : 'bg-white/[0.08]'}`}
                style={{ height: `${pct}%`, minHeight: 10 }}
              />
            </div>
            {labels && (
              <span className="font-mono text-[10px] text-[var(--text-tertiary)]">
                {labels[index]}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
