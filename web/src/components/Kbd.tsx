export default function Kbd({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <kbd
      className={`inline-flex h-6 items-center rounded-full border border-[var(--border-subtle)] bg-white/[0.04] px-2.5 font-mono text-[10px] tracking-[0.14em] text-[var(--text-tertiary)] uppercase ${className}`}
    >
      {children}
    </kbd>
  )
}
