import { useMemo } from 'react'
import { useForm } from '@tanstack/react-form'
import { format } from 'date-fns'

import type { User } from '@/hooks/use-auth'
import type { WorkoutBlockDraft } from '@/types/routine'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { WorkoutBlockBuilder } from '@/components/routines/workout-block-builder'
import { WorkoutBlockCard } from '@/components/routines/workout-block-card'

export function RoutineBuilder({ user }: { user: User }) {
  const formOptions = useMemo(() => {
    return {
      defaultValues: {
        name: `${format(new Date(), 'dd-MM-yyyy')} Routine`,
        createdBy: user.id,
        workoutBlocks: [] as Array<WorkoutBlockDraft>,
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

      <form.Subscribe
        selector={(state) => state.values.workoutBlocks}
        children={(workoutBlocks) => (
          <div className="space-y-2">
            {workoutBlocks.map((block, index) => (
              <WorkoutBlockCard
                key={index}
                block={block}
                editMode={true}
                onDelete={() => {
                  form.setFieldValue('workoutBlocks', (prev) =>
                    prev.filter((_, i) => i !== index),
                  )
                }}
              />
            ))}
          </div>
        )}
      />

      <WorkoutBlockBuilder
        onBlockComplete={(block) => {
          form.setFieldValue('workoutBlocks', (prev) => [...prev, block])
          console.log(form.state.values)
        }}
      />
    </form>
  )
}
