export interface AppUser {
  id: string
  name: string
  email: string
  image: string | null
  nickname: string | null
}

/* ─── Component demo types ─── */

export interface Member {
  id: string
  name: string
  initials: string
  hue: number
}

export interface Status {
  id: string
  label: string
  cls: string
}

export interface Priority {
  id: string
  label: string
  bars: number
  cls?: string
}

export interface Task {
  id: string
  title: string
  description: string
  project: string
  assignee: string
  status: string
  priority: string
  due: string
  tags: string[]
}

export interface Comment {
  by: string
  at: string
  text: string
}

export interface AppConfig {
  accent: number
  font: string
  density: 'comfortable' | 'compact'
  sidebar: 'labeled' | 'icon' | 'top'
  theme: 'light' | 'dark'
}
