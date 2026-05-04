import type { InputHTMLAttributes } from 'react'
import { useFormContext } from 'react-hook-form'

import { useFormField } from './form-field-context'

export default function FormCheckbox(
  props: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>,
) {
  const { name, id } = useFormField()
  const { register } = useFormContext()

  return (
    <input
      type="checkbox"
      id={id}
      className={`terminal-checkbox ${props.className ?? ''}`}
      {...register(name)}
      {...props}
    />
  )
}
