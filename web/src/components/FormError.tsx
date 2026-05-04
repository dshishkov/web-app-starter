import { useContext } from 'react'
import { useFormContext } from 'react-hook-form'

import { FormFieldContext } from './form-field-context'

export default function FormError({ message }: { message?: string }) {
  const ctx = useContext(FormFieldContext)
  const { formState } = useFormContext()
  const name = ctx?.name
  const errorMessage =
    message ?? (name ? (formState.errors[name]?.message as string) : undefined)

  if (!errorMessage) return null

  return (
    <div
      id={ctx ? `${ctx.id}-error` : undefined}
      className="mt-2 text-[12px] text-[var(--text-error)]"
    >
      {errorMessage}
    </div>
  )
}
