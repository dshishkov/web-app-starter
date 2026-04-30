import { useEffect, useState } from 'react'
import { z } from 'zod'

import { Icons } from '../components/icons'
import { useSession } from '../lib/auth-client'
import { useMe, useUpdateNickname } from '../lib/hooks'
import { gradientFor, hueFor } from '../lib/utils'

const nicknameSchema = z.object({
  nickname: z
    .string()
    .min(1, 'Nickname must be at least 1 character')
    .max(100, 'Nickname must be 100 characters or less')
    .nullable(),
})

type NicknameForm = z.infer<typeof nicknameSchema>

export default function Profile() {
  const { data: session } = useSession()
  const { data: profile, isLoading, isError } = useMe()
  const updateNickname = useUpdateNickname()

  const [nickname, setNickname] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {
    if (profile) {
      setNickname(profile.nickname ?? '')
    }
  }, [profile])

  if (isLoading) {
    return (
      <div className="terminal-empty panel-terminal">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[var(--color-accent)]" />
          <div className="terminal-section-label">loading profile</div>
        </div>
      </div>
    )
  }

  if (isError || !profile || !session?.user) {
    return (
      <div className="terminal-empty panel-terminal">
        <div>
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-[20px] border border-[rgba(251,86,91,0.2)] bg-[rgba(251,86,91,0.1)] text-[#ffb4b6]">
            <Icons.team size={20} />
          </div>
          <div className="terminal-section-label mt-5">load failed</div>
          <p className="mt-3 text-[14px] text-[var(--text-secondary)]">
            Could not load your profile. Please try again.
          </p>
        </div>
      </div>
    )
  }

  const hue = hueFor(profile.name)
  const isSaving = updateNickname.isPending
  const isSaved = updateNickname.isSuccess
  const serverError = updateNickname.error?.message ?? null

  const handleSave = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    setValidationError(null)

    const trimmed = nickname.trim()
    const payload: NicknameForm = { nickname: trimmed || null }

    const result = nicknameSchema.safeParse(payload)
    if (!result.success) {
      setValidationError(result.error.errors[0]?.message ?? 'Invalid nickname')
      return
    }

    updateNickname.mutate(result.data)
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="panel-terminal panel-grid overflow-hidden">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            {profile.image ? (
              <img
                src={profile.image}
                alt={profile.name}
                className="h-20 w-20 rounded-[24px] border border-white/10 object-cover"
              />
            ) : (
              <span
                className="inline-grid h-20 w-20 place-items-center rounded-[24px] border border-white/10 text-[28px] font-semibold text-white"
                style={{ background: gradientFor(hue) }}
              >
                {profile.name.charAt(0).toUpperCase()}
              </span>
            )}

            <div>
              <div className="terminal-section-label">operator profile</div>
              <h1 className="font-display mt-2 text-[34px] leading-[0.95] font-semibold tracking-[-0.05em] text-[var(--text-primary)]">
                {profile.nickname || profile.name}
              </h1>
              {profile.nickname && (
                <div className="mt-2 text-[14px] text-[var(--text-secondary)]">
                  {profile.name}
                </div>
              )}
              <div className="mt-2 text-[14px] text-[var(--text-secondary)]">
                {profile.email}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:min-w-[280px]">
            {[
              {
                label: 'joined',
                value: new Date(profile.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                }),
              },
              {
                label: 'last active',
                value: new Date(profile.updatedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                }),
              },
            ].map((item) => (
              <div key={item.label} className="panel-terminal-muted p-3.5">
                <div className="terminal-section-label">{item.label}</div>
                <div className="mt-2 font-mono text-[13px] text-[var(--text-primary)]">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <form onSubmit={handleSave} className="panel-terminal overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-5 py-4">
            <div>
              <div className="terminal-section-label">display handle</div>
              <div className="mt-2 text-[13px] text-[var(--text-secondary)]">
                Choose the name other operators see in the workspace.
              </div>
            </div>
            <span className="terminal-chip-strong">public label</span>
          </div>

          <div className="space-y-4 p-5">
            <label className="block">
              <div className="mb-2 text-[12px] font-medium text-[var(--text-secondary)]">
                Nickname
              </div>
              <input
                type="text"
                value={nickname}
                onChange={(event) => {
                  setNickname(event.target.value)
                  setValidationError(null)
                  updateNickname.reset()
                }}
                placeholder={profile.name}
                className="terminal-input"
              />
              {(validationError || serverError) && (
                <div className="mt-2 text-[12px] text-[#ffb4b6]">
                  {validationError || serverError}
                </div>
              )}
            </label>

            <div className="flex items-center justify-between rounded-[18px] border border-[var(--border-subtle)] bg-white/[0.03] px-4 py-3 text-[12px] text-[var(--text-secondary)]">
              <span>Blank nickname falls back to your real name.</span>
              {isSaved && (
                <span className="terminal-chip-strong h-7 px-2.5">saved</span>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="signal-button disabled:opacity-50"
              >
                <Icons.check size={14} />
                {isSaving ? 'Saving…' : 'Save handle'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setNickname(profile.nickname ?? '')
                  setValidationError(null)
                  updateNickname.reset()
                }}
                className="ghost-button"
              >
                Reset
              </button>
            </div>
          </div>
        </form>

        <section className="panel-terminal overflow-hidden">
          <div className="border-b border-[var(--border-subtle)] px-5 py-4">
            <div className="terminal-section-label">account telemetry</div>
          </div>
          <div className="space-y-3 p-5">
            {[
              { label: 'email', value: profile.email },
              { label: 'user id', value: profile.id },
              {
                label: 'member since',
                value: new Date(profile.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                }),
              },
            ].map((item) => (
              <div key={item.label} className="panel-terminal-muted p-3.5">
                <div className="terminal-section-label">{item.label}</div>
                <div className="mt-2 text-[13px] break-all text-[var(--text-primary)]">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
