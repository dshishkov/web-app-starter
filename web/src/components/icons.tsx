/* eslint-disable react-refresh/only-export-components -- Icon registry exports component factories for ergonomic imports. */
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  d?: string
  size?: number
  strokeWidth?: number
  viewBox?: string
}

const Icon = ({
  d,
  size = 16,
  fill,
  strokeWidth = 1.5,
  children,
  viewBox = '0 0 16 16',
  ...rest
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox={viewBox}
    fill={fill || 'none'}
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...rest}
  >
    {d ? <path d={d} /> : children}
  </svg>
)

type IconComponent = (props: IconProps) => React.JSX.Element

export const Icons: Record<string, IconComponent> = {
  dashboard: (p) => (
    <Icon {...p}>
      <rect x="2" y="2" width="5" height="5" rx="1" />
      <rect x="9" y="2" width="5" height="5" rx="1" />
      <rect x="2" y="9" width="5" height="5" rx="1" />
      <rect x="9" y="9" width="5" height="5" rx="1" />
    </Icon>
  ),
  tasks: (p) => (
    <Icon {...p}>
      <path d="M3 3h6M3 7h6M3 11h6M13 3h6M13 7h6M13 11h6" />
      <rect x="1" y="1" width="8" height="2" rx="0.5" fill="none" />
    </Icon>
  ),
  menu: (p) => (
    <Icon {...p}>
      <path d="M3 5h10M3 8h10M3 11h10" />
    </Icon>
  ),
  inbox: (p) => (
    <Icon {...p}>
      <path d="M2 9l2-5h8l2 5v4a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V9z" />
      <path d="M2 9h3l1 2h4l1-2h3" />
    </Icon>
  ),
  projects: (p) => (
    <Icon {...p}>
      <rect x="2" y="3" width="12" height="10" rx="1.5" />
      <path d="M2 6h12" />
    </Icon>
  ),
  team: (p) => (
    <Icon {...p}>
      <circle cx="6" cy="6" r="2.3" />
      <circle cx="11.5" cy="6.5" r="1.8" />
      <path d="M2 13c0-2 1.8-3.5 4-3.5s4 1.5 4 3.5" />
      <path d="M10 13c0-1.5 1.3-2.7 3-2.7" />
    </Icon>
  ),
  settings: (p) => (
    <Icon {...p}>
      <circle cx="8" cy="8" r="2" />
      <path d="M8 1.5v1.6M8 12.9v1.6M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M1.5 8h1.6M12.9 8h1.6M3.4 12.6l1.1-1.1M11.5 4.5l1.1-1.1" />
    </Icon>
  ),
  search: (p) => (
    <Icon {...p}>
      <circle cx="7" cy="7" r="4.2" />
      <path d="M10.3 10.3l3.2 3.2" />
    </Icon>
  ),
  plus: (p) => (
    <Icon {...p} strokeWidth={1.7}>
      <path d="M8 3v10M3 8h10" />
    </Icon>
  ),
  filter: (p) => (
    <Icon {...p}>
      <path d="M2 3h12l-4.5 5.5v4L6.5 14V8.5L2 3z" />
    </Icon>
  ),
  sort: (p) => (
    <Icon {...p}>
      <path d="M4 3v10M4 13l-2-2M4 13l2-2M12 13V3M12 3l-2 2M12 3l2 2" />
    </Icon>
  ),
  chevronRight: (p) => (
    <Icon {...p}>
      <path d="M6 3l4 5-4 5" />
    </Icon>
  ),
  chevronDown: (p) => (
    <Icon {...p}>
      <path d="M3 6l5 4 5-4" />
    </Icon>
  ),
  x: (p) => (
    <Icon {...p}>
      <path d="M4 4l8 8M12 4l-8 8" />
    </Icon>
  ),
  bell: (p) => (
    <Icon {...p}>
      <path d="M4 12V8a4 4 0 1 1 8 0v4l1 1.5H3L4 12z" />
      <path d="M7 14.5a1.5 1.5 0 0 0 2 0" />
    </Icon>
  ),
  sun: (p) => (
    <Icon {...p}>
      <circle cx="8" cy="8" r="2.5" />
      <path d="M8 1.5v1.8M8 12.7v1.8M3.1 3.1l1.3 1.3M11.6 11.6l1.3 1.3M1.5 8h1.8M12.7 8h1.8M3.1 12.9l1.3-1.3M11.6 4.4l1.3-1.3" />
    </Icon>
  ),
  moon: (p) => (
    <Icon {...p}>
      <path d="M13 9.5A5.5 5.5 0 1 1 6.5 3a4.5 4.5 0 0 0 6.5 6.5z" />
    </Icon>
  ),
  calendar: (p) => (
    <Icon {...p}>
      <rect x="2" y="3.5" width="12" height="10.5" rx="1.5" />
      <path d="M2 7h12M5.5 2v3M10.5 2v3" />
    </Icon>
  ),
  flag: (p) => (
    <Icon {...p}>
      <path d="M4 2v12M4 3h8l-1.5 3L12 9H4" />
    </Icon>
  ),
  link: (p) => (
    <Icon {...p}>
      <path d="M9 3l2-2a2.5 2.5 0 1 1 3.5 3.5L12.5 6.5M7 13l-2 2a2.5 2.5 0 1 1-3.5-3.5L3.5 9.5" />
      <path d="M6 10l4-4" />
    </Icon>
  ),
  trash: (p) => (
    <Icon {...p}>
      <path d="M3 4h10M6 4V2.5h4V4M4.5 4l.5 9a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1l.5-9" />
    </Icon>
  ),
  logout: (p) => (
    <Icon {...p}>
      <path d="M6 2.5H4A1.5 1.5 0 0 0 2.5 4v8A1.5 1.5 0 0 0 4 13.5h2" />
      <path d="M9 5l3 3-3 3" />
      <path d="M5.5 8H12" />
    </Icon>
  ),
  user: (p) => (
    <Icon {...p}>
      <circle cx="8" cy="6" r="2.5" />
      <path d="M3 14c0-2.5 2.3-4.5 5-4.5s5 2 5 4.5" />
    </Icon>
  ),
  tag: (p) => (
    <Icon {...p}>
      <path d="M2 2h5.5L14 8.5 8.5 14 2 7.5V2z" />
      <circle cx="5" cy="5" r="0.8" />
    </Icon>
  ),
  check: (p) => (
    <Icon {...p}>
      <path d="M3 8.5L6.5 12l7-8" />
    </Icon>
  ),
  kbd: (p) => (
    <Icon {...p}>
      <rect x="1.5" y="4" width="13" height="8" rx="1.5" />
      <path d="M4 7.5h.01M7 7.5h.01M10 7.5h.01M4 10h7" />
    </Icon>
  ),
  activity: (p) => (
    <Icon {...p}>
      <path d="M1.5 8h3L6 4l2.5 8L10 8h4.5" />
    </Icon>
  ),
  more: (p) => (
    <Icon {...p}>
      <circle cx="4" cy="8" r="1" fill="currentColor" />
      <circle cx="8" cy="8" r="1" fill="currentColor" />
      <circle cx="12" cy="8" r="1" fill="currentColor" />
    </Icon>
  ),
  sliders: (p) => (
    <Icon {...p}>
      <path d="M3 4h10M3 8h10M3 12h10" />
      <circle cx="6" cy="4" r="1.3" fill="var(--bg-elev)" />
      <circle cx="10" cy="8" r="1.3" fill="var(--bg-elev)" />
      <circle cx="5" cy="12" r="1.3" fill="var(--bg-elev)" />
    </Icon>
  ),
}
