import { useContext, type ReactNode } from 'react'
import { useFormContext } from 'react-hook-form'

import { FormFieldContext } from './form-field-context'

export default function FormHelper({ children }: { children: ReactNode }) {
  const ctx = useContext(FormFieldContext)
  const { formState } = useFormContext()
  const name = ctx?.name
  const hasError = name ? !!formState.errors[name] : false

  if (hasError) return null

  return (
    <div className="mt-2 text-[12px] text-[var(--text-tertiary)]">
      {children}
    </div>
  )
}
