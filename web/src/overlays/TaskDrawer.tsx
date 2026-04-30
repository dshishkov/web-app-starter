import { useEffect, useId, useMemo, useRef, useState } from 'react'

import Avatar from '../components/Avatar'
import { Icons } from '../components/icons'
import Kbd from '../components/Kbd'
import PriorityCell from '../components/PriorityCell'
import StatusPill from '../components/StatusPill'
import {
  DEMO_COMMENTS,
  DEMO_MEMBER,
  DEMO_PROJECTS,
  PRIORITIES,
  STATUSES,
} from '../lib/data'
import type { Task } from '../lib/types'

interface Props {
  task: Task
  onClose: () => void
}

export default function TaskDrawer({ task, onClose }: Props) {
  const titleId = useId()
  const titleInputRef = useRef<HTMLInputElement>(null)
  const [draft, setDraft] = useState(task)
  const [tagsInput, setTagsInput] = useState(task.tags.join(', '))
  const [newComment, setNewComment] = useState('')
  const [localComments, setLocalComments] = useState(DEMO_COMMENTS)

  useEffect(() => {
    setDraft(task)
    setTagsInput(task.tags.join(', '))
    setLocalComments(DEMO_COMMENTS)
  }, [task])

  useEffect(() => {
    titleInputRef.current?.focus()
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const project = DEMO_PROJECTS.find((p) => p.id === draft.project)

  const parsedTags = useMemo(
    () =>
      tagsInput
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
    [tagsInput],
  )

  const submitComment = () => {
    if (!newComment.trim()) return
    setLocalComments((current) => [
      ...current,
      { by: 'demo', at: 'just now', text: newComment.trim() },
    ])
    setNewComment('')
  }

  return (
    <>
      <div
        className="terminal-overlay fixed inset-0 z-40 animate-[fadeIn_120ms_ease]"
        onClick={onClose}
      />
      <aside
        className="panel-terminal app-scrollbar fixed top-3 right-3 bottom-3 z-50 flex w-[620px] max-w-[calc(100vw-24px)] animate-[slideIn_220ms_cubic-bezier(0.2,0.7,0.2,1)] flex-col overflow-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="sticky top-0 z-10 border-b border-[var(--border-subtle)] bg-[rgba(8,8,10,0.9)] px-5 py-4 backdrop-blur-xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span id={titleId} className="terminal-chip-strong">
                  {task.id}
                </span>
                {project && (
                  <span className="terminal-chip">{project.name}</span>
                )}
                <StatusPill status={draft.status} />
              </div>
              <div className="mt-3 text-[13px] text-[var(--text-secondary)]">
                Demo task drawer — edit fields, change status, add comments.
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="icon-button h-8 w-8"
                aria-label="Close task drawer"
              >
                <Icons.x size={13} />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-5 p-5">
          <section className="panel-terminal-muted p-4">
            <div className="terminal-section-label mb-2">title</div>
            <input
              ref={titleInputRef}
              value={draft.title}
              onChange={(event) =>
                setDraft((d) => ({ ...d, title: event.target.value }))
              }
              aria-label="Task title"
              className="terminal-input"
            />
            <div className="mt-4">
              <div className="terminal-section-label mb-2">description</div>
              <textarea
                value={draft.description}
                onChange={(event) =>
                  setDraft((d) => ({ ...d, description: event.target.value }))
                }
                placeholder="Add implementation notes, references, or acceptance criteria"
                aria-label="Task description"
                className="terminal-textarea"
              />
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <MetaField label="status">
              <select
                value={draft.status}
                aria-label="Task status"
                onChange={(event) =>
                  setDraft((d) => ({ ...d, status: event.target.value }))
                }
                className="terminal-select"
              >
                {STATUSES.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.label}
                  </option>
                ))}
              </select>
            </MetaField>
            <MetaField label="priority">
              <select
                value={draft.priority}
                aria-label="Task priority"
                onChange={(event) =>
                  setDraft((d) => ({ ...d, priority: event.target.value }))
                }
                className="terminal-select"
              >
                {PRIORITIES.map((priority) => (
                  <option key={priority.id} value={priority.id}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </MetaField>
            <MetaField label="assignee">
              <select
                value={draft.assignee}
                aria-label="Task assignee"
                onChange={(event) =>
                  setDraft((d) => ({ ...d, assignee: event.target.value }))
                }
                className="terminal-select"
              >
                <option value="demo">{DEMO_MEMBER.name}</option>
              </select>
            </MetaField>
            <MetaField label="project">
              <select
                value={draft.project}
                aria-label="Task project"
                onChange={(event) =>
                  setDraft((d) => ({ ...d, project: event.target.value }))
                }
                className="terminal-select"
              >
                {DEMO_PROJECTS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </MetaField>
            <MetaField label="due">
              <input
                value={draft.due}
                aria-label="Task due date"
                onChange={(event) =>
                  setDraft((d) => ({ ...d, due: event.target.value }))
                }
                className="terminal-input"
              />
            </MetaField>
            <MetaField label="summary">
              <div className="panel-terminal-muted flex h-[42px] items-center justify-between px-3">
                <PriorityCell priority={draft.priority} />
                <Avatar member={DEMO_MEMBER} size={24} />
              </div>
            </MetaField>
          </section>

          <section className="panel-terminal-muted p-4">
            <div className="terminal-section-label mb-2">tags</div>
            <input
              value={tagsInput}
              aria-label="Task tags"
              onChange={(event) => setTagsInput(event.target.value)}
              onBlur={() => setDraft((d) => ({ ...d, tags: parsedTags }))}
              placeholder="security, backend, api"
              className="terminal-input"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {parsedTags.map((tag) => (
                <span
                  key={tag}
                  className="terminal-chip h-7 px-2.5 text-[10px]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </section>

          <section className="panel-terminal overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-3.5">
              <div className="terminal-section-label">comments</div>
              <Kbd>Esc</Kbd>
            </div>
            <div className="space-y-3 p-4">
              {localComments.length === 0 && (
                <div className="panel-terminal-muted p-4 text-[13px] text-[var(--text-tertiary)]">
                  No comments yet.
                </div>
              )}
              {localComments.map((comment, index) => (
                <div
                  key={`${comment.at}-${index}`}
                  className="panel-terminal-muted p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar member={DEMO_MEMBER} size={24} />
                      <div className="text-[12px] font-medium text-[var(--text-primary)]">
                        {DEMO_MEMBER.name}
                      </div>
                    </div>
                    <span className="font-mono text-[11px] text-[var(--text-tertiary)]">
                      {comment.at}
                    </span>
                  </div>
                  <p className="mt-3 text-[13px] leading-6 text-[var(--text-secondary)]">
                    {comment.text}
                  </p>
                </div>
              ))}

              <div className="space-y-3">
                <textarea
                  value={newComment}
                  aria-label="New comment"
                  onChange={(event) => setNewComment(event.target.value)}
                  placeholder="Add a note to the thread"
                  className="terminal-textarea"
                />
                <div className="flex justify-end">
                  <button onClick={submitComment} className="signal-button">
                    <Icons.plus size={13} />
                    Add comment
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </aside>
    </>
  )
}

function MetaField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="panel-terminal-muted p-4">
      <div className="terminal-section-label mb-2">{label}</div>
      {children}
    </div>
  )
}
