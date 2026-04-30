import { useEffect, useId, useRef, useState } from 'react'

import { Icons } from '../components/icons'
import { DEMO_MEMBERS, DEMO_PROJECTS, PRIORITIES, STATUSES } from '../lib/data'

interface Props {
  onClose: () => void
}

export default function TaskModal({ onClose }: Props) {
  const titleId = useId()
  const titleInputRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [project, setProject] = useState(DEMO_PROJECTS[0]?.id ?? '')
  const [assignee, setAssignee] = useState(DEMO_MEMBERS[0]?.id ?? '')
  const [status, setStatus] = useState(STATUSES[0]?.id ?? 'todo')
  const [priority, setPriority] = useState(PRIORITIES[1]?.id ?? 'med')
  const [due, setDue] = useState('Apr 30')
  const [tags, setTags] = useState('frontend, prototype')

  const submit = () => {
    if (!title.trim()) return
    // Demo: form values are captured above, close to return to catalog
    onClose()
  }

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

  return (
    <div
      className="terminal-overlay fixed inset-0 z-[70] grid animate-[fadeIn_120ms_ease] place-items-center p-4"
      onClick={onClose}
    >
      <div
        className="panel-terminal w-full max-w-2xl overflow-hidden"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-5 py-4">
          <div>
            <div id={titleId} className="terminal-section-label">
              new task
            </div>
            <div className="mt-2 text-[13px] text-[var(--text-secondary)]">
              Demo form — fill out the fields and submit to close.
            </div>
          </div>
          <button
            onClick={onClose}
            className="icon-button h-8 w-8"
            aria-label="Close task modal"
          >
            <Icons.x size={13} />
          </button>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2">
          <label className="block md:col-span-2">
            <div className="mb-2 text-[12px] font-medium text-[var(--text-secondary)]">
              Title
            </div>
            <input
              ref={titleInputRef}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="terminal-input"
              placeholder="Ship the next high-signal task"
            />
          </label>

          <label className="block md:col-span-2">
            <div className="mb-2 text-[12px] font-medium text-[var(--text-secondary)]">
              Description
            </div>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="terminal-textarea"
              placeholder="Add intent, acceptance criteria, or notes"
            />
          </label>

          <SelectField
            label="Project"
            value={project}
            onChange={setProject}
            options={DEMO_PROJECTS.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
          />
          <SelectField
            label="Assignee"
            value={assignee}
            onChange={setAssignee}
            options={DEMO_MEMBERS.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
          />
          <SelectField
            label="Status"
            value={status}
            onChange={setStatus}
            options={STATUSES.map((item) => ({
              value: item.id,
              label: item.label,
            }))}
          />
          <SelectField
            label="Priority"
            value={priority}
            onChange={setPriority}
            options={PRIORITIES.map((item) => ({
              value: item.id,
              label: item.label,
            }))}
          />

          <label className="block">
            <div className="mb-2 text-[12px] font-medium text-[var(--text-secondary)]">
              Due
            </div>
            <input
              value={due}
              onChange={(event) => setDue(event.target.value)}
              className="terminal-input"
              placeholder="May 02"
            />
          </label>

          <label className="block">
            <div className="mb-2 text-[12px] font-medium text-[var(--text-secondary)]">
              Tags
            </div>
            <input
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              className="terminal-input"
              placeholder="design, api"
            />
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-[var(--border-subtle)] px-5 py-4">
          <button onClick={onClose} className="ghost-button">
            Cancel
          </button>
          <button onClick={submit} className="signal-button">
            <Icons.plus size={14} />
            Create task
          </button>
        </div>
      </div>
    </div>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <label className="block">
      <div className="mb-2 text-[12px] font-medium text-[var(--text-secondary)]">
        {label}
      </div>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="terminal-select"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
