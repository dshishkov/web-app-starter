import type { SelectHTMLAttributes } from 'react'
import { useFormContext } from 'react-hook-form'

import { useFormField } from './form-field-context'

export default function FormSelect(
  props: SelectHTMLAttributes<HTMLSelectElement>,
) {
  const { name, id } = useFormField()
  const { register, formState } = useFormContext()
  const hasError = !!formState.errors[name]
  const className = [
    'terminal-select',
    hasError && 'terminal-select--error',
    props.className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <select id={id} className={className} {...register(name)} {...props} />
  )
}
