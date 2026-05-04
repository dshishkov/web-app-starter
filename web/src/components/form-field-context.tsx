import { createContext, useContext } from 'react'

export interface FormFieldContextValue {
  name: string
  id: string
}

export const FormFieldContext = createContext<FormFieldContextValue | null>(null)

export function useFormField() {
  const ctx = useContext(FormFieldContext)
  if (!ctx) {
    throw new Error(
      'FormInput, FormSelect, FormTextarea, FormCheckbox, and FormError must be used inside <FormField name="...">',
    )
  }
  return ctx
}
