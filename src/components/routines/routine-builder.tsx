import { useMemo } from 'react'
import { useForm } from '@tanstack/react-form'
import { format } from 'date-fns'

import type { User } from '@/hooks/use-auth'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { WorkoutBlockBuilder } from '@/components/routines/workout-block-builder'

export function RoutineBuilder({ user }: { user: User }) {
  const formOptions = useMemo(() => {
    return {
      defaultValues: {
        name: `${format(new Date(), 'dd-MM-yyyy')} Routine`,
        createdBy: user.id,
        workoutBlocks: [],
      },
    }
  }, [user])

  const form = useForm({
    ...formOptions,
  })

  return (
    <form
      id="routine-builder-form"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="max-w-md space-y-6"
    >
      <form.Field
        name="name"
        children={(field) => {
          const isInvalid = !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Routine Name</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
              />
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )
        }}
      />

      <WorkoutBlockBuilder />
    </form>
  )
}
