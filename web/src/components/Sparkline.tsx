import { useId } from 'react'

interface SparklineProps {
  data: number[]
  color?: string
  height?: number
  label?: string
}

export default function Sparkline({
  data,
  color = 'var(--color-accent)',
  height = 28,
  label,
}: SparklineProps) {
  const width = 100
  const reactId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const safeData = data.length > 0 ? data : [0]
  const max = Math.max(...safeData)
  const min = Math.min(...safeData)
  const range = max - min || 1
  const fillId = `spark-fill-${reactId}`
  const pts = safeData
    .map((value, index) => {
      const x =
        safeData.length === 1
          ? width / 2
          : (index / (safeData.length - 1)) * width
      const y = height - ((value - min) / range) * (height - 4) - 2
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      preserveAspectRatio="none"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient id={fillId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${pts} ${width},${height}`}
        fill={`url(#${fillId})`}
      />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={{ filter: 'drop-shadow(0 0 10px rgba(0, 217, 146, 0.16))' }}
      />
    </svg>
  )
}
