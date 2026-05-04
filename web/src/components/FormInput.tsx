import type { InputHTMLAttributes } from 'react'
import { useFormContext } from 'react-hook-form'

import { useFormField } from './form-field-context'

export default function FormInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const { name, id } = useFormField()
  const { register, formState } = useFormContext()
  const hasError = !!formState.errors[name]
  const className = [
    'terminal-input',
    hasError && 'terminal-input--error',
    props.className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <input id={id} className={className} {...register(name)} {...props} />
  )
}
