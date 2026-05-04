import type { TextareaHTMLAttributes } from 'react'
import { useFormContext } from 'react-hook-form'

import { useFormField } from './form-field-context'

export default function FormTextarea(
  props: TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  const { name, id } = useFormField()
  const { register, formState } = useFormContext()
  const hasError = !!formState.errors[name]
  const className = [
    'terminal-textarea',
    hasError && 'terminal-textarea--error',
    props.className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <textarea id={id} className={className} {...register(name)} {...props} />
  )
}
