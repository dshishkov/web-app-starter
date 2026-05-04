import { zodResolver } from '@hookform/resolvers/zod'
import type { ReactNode } from 'react'
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form'
import type { z } from 'zod'

interface FormProps<T extends z.ZodTypeAny> {
  schema: T
  defaultValues: z.infer<T>
  onSubmit: (values: z.infer<T>) => void | Promise<void>
  children: ReactNode | ((methods: UseFormReturn<z.infer<T>>) => ReactNode)
}

export default function Form<T extends z.ZodTypeAny>({
  schema,
  defaultValues,
  onSubmit,
  children,
}: FormProps<T>) {
  const methods = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {typeof children === 'function' ? children(methods) : children}
      </form>
    </FormProvider>
  )
}
