import type { Member } from '../lib/types'
import { gradientFor } from '../lib/utils'

interface AvatarProps {
  member: Member | undefined
  size?: number
  className?: string
}

export default function Avatar({
  member,
  size = 22,
  className = '',
}: AvatarProps) {
  if (!member) return null

  return (
    <span
      className={`inline-grid shrink-0 place-items-center rounded-[12px] border border-white/10 font-semibold text-[#f2f2f2] shadow-[0_10px_30px_rgba(0,0,0,0.2)] ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.34),
        letterSpacing: '-0.04em',
        background: gradientFor(member.hue),
      }}
      title={member.name}
    >
      {member.initials}
    </span>
  )
}
