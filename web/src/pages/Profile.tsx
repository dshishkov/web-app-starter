import { type CurrentUser, type NicknameForm, nicknameSchema } from '@repo/types'

import Form from '../components/Form'
import FormError from '../components/FormError'
import FormField from '../components/FormField'
import FormInput from '../components/FormInput'
import { Icons } from '../components/icons'
import { useSession } from '../lib/auth-client'
import { queryKeys, useFormMutation, useMe } from '../lib/hooks'
import { gradientFor, hueFor } from '../lib/utils'

export default function Profile() {
  const { data: session } = useSession()
  const { data: profile, isLoading, isError } = useMe()
  const updateNickname = useFormMutation<NicknameForm, CurrentUser>({
    endpoint: '/api/me/nickname',
    method: 'PATCH',
    transformResponse: (data) => (data as { user: CurrentUser }).user,
    invalidateKeys: [queryKeys.users],
    setQueryData: queryKeys.me,
  })

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

  const handleSave = (values: NicknameForm) => {
    updateNickname.mutate(values)
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
        <Form<typeof nicknameSchema>
          schema={nicknameSchema}
          defaultValues={{ nickname: profile.nickname ?? '' }}
          onSubmit={handleSave}
        >
          {(methods) => {
            const { formState, reset } = methods
            const dirty = formState.isDirty

            return (
              <div className="panel-terminal overflow-hidden">
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
                  <FormField
                    name="nickname"
                    label="Nickname"
                    helper="Blank nickname falls back to your real name."
                  >
                    <FormInput placeholder={profile.name} />
                  </FormField>

                  <div className="flex items-center justify-between rounded-[18px] border border-[var(--border-subtle)] bg-white/[0.03] px-4 py-3 text-[12px] text-[var(--text-secondary)]">
                    <span>Blank nickname falls back to your real name.</span>
                    {isSaved && (
                      <span className="terminal-chip-strong h-7 px-2.5">
                        saved
                      </span>
                    )}
                  </div>

                  {serverError && <FormError message={serverError} />}

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="signal-button disabled:opacity-50"
                    >
                      <Icons.check size={14} />
                      {isSaving ? 'Saving…' : 'Save handle'}
                    </button>
                    {dirty && (
                      <button
                        type="button"
                        onClick={() => {
                          reset({ nickname: profile.nickname ?? '' })
                          updateNickname.reset()
                        }}
                        className="ghost-button"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          }}
        </Form>

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
