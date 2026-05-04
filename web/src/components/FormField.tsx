import { type ReactNode } from 'react'
import { useFormContext } from 'react-hook-form'

import { FormFieldContext } from './form-field-context'

interface FormFieldProps {
  name: string
  label: string
  helper?: string
  children: ReactNode
}

export default function FormField({
  name,
  label,
  helper,
  children,
}: FormFieldProps) {
  const id = `field-${name}`
  const { formState } = useFormContext()
  const hasError = !!formState.errors[name]

  return (
    <FormFieldContext.Provider value={{ name, id }}>
      <label htmlFor={id} className="block">
        <div className="mb-2 text-[12px] font-medium text-[var(--text-secondary)]">
          {label}
        </div>
        {children}
      </label>
      {!hasError && helper && (
        <div className="mt-2 text-[12px] text-[var(--text-tertiary)]">
          {helper}
        </div>
      )}
    </FormFieldContext.Provider>
  )
}
