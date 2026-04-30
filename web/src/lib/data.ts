import type { Comment, Member, Priority, Status, Task } from './types'

/* ─── Design system constants ─── */

export const STATUSES: Status[] = [
  { id: 'todo', label: 'To do', cls: 'status-todo' },
  { id: 'progress', label: 'In progress', cls: 'status-progress' },
  { id: 'review', label: 'In review', cls: 'status-review' },
  { id: 'blocked', label: 'Blocked', cls: 'status-blocked' },
  { id: 'done', label: 'Done', cls: 'status-done' },
]

export const PRIORITIES: Priority[] = [
  { id: 'low', label: 'Low', bars: 1 },
  { id: 'med', label: 'Medium', bars: 2 },
  { id: 'high', label: 'High', bars: 3, cls: 'priority-high' },
  { id: 'urgent', label: 'Urgent', bars: 3, cls: 'priority-urgent' },
]

export const FONT_STACKS: Record<string, string> = {
  jakarta: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
  inter: "'Inter', ui-sans-serif, system-ui, sans-serif",
  'ibm-plex': "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif",
  jetbrains: "'JetBrains Mono', ui-monospace, monospace",
}

/* ─── Demo project list (shared by TaskDrawer and TaskModal) ─── */

export const DEMO_PROJECTS = [
  { id: 'platform', name: 'Platform' },
  { id: 'mobile', name: 'Mobile' },
  { id: 'billing', name: 'Billing' },
]

/* ─── Minimal demo data for component catalog ─── */

export const DEMO_MEMBER: Member = {
  id: 'demo',
  name: 'Ada Lovelace',
  initials: 'AL',
  hue: 280,
}

export const DEMO_MEMBERS: Member[] = [DEMO_MEMBER]

export const DEMO_TASK: Task = {
  id: 'FRN-001',
  title: 'Refactor auth session tokens to use rotating keys',
  description:
    'Move from static JWT signing to a rotating-key scheme with KID-based verification.',
  project: 'platform',
  assignee: 'demo',
  status: 'progress',
  priority: 'high',
  due: 'Apr 30',
  tags: ['security', 'backend'],
}

export const DEMO_COMMENTS: Comment[] = [
  {
    by: 'demo',
    at: '2h ago',
    text: 'Started a branch for this. Going with a 3-key sliding window; JWKS refresh every 10m.',
  },
]
