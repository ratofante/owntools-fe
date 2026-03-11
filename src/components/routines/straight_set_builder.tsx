import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import type { Exercise } from '@/types/exercise'

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { AppTooltip } from '@/components/app-tooltip'
import { ExerciseSelect } from '@/components/exercises/exercise-select'

const straightSetValidator = z.object({
  exercise_id: z.number().int().positive(),
  workout_name: z.string().min(1).or(z.undefined()),
  sets: z.number().min(1),
  repetitions: z.number().min(1),
  target_weight: z.number().min(0.25).max(9999.99).or(z.undefined()),
  percentage: z.number().int().min(1).max(100).or(z.undefined()),
  rest: z.number().or(z.undefined()),
})

const formOptions = {
  defaultValues: {
    exercise_id: undefined as number | undefined,
    workout_name: '' as string | undefined,
    sets: 3,
    repetitions: 6,
    target_weight: undefined as number | undefined,
    percentage: undefined as number | undefined,
    rest: undefined as number | undefined,
  },
  validators: {
    onSubmit: straightSetValidator,
  },
}

export function StraightSetBuilder() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  )
  const form = useForm({
    ...formOptions,
  })

  function handleExerciseSelect(exercise: Exercise | null) {
    setSelectedExercise(exercise)
    form.setFieldValue('exercise_id', exercise?.id ?? undefined)
  }

  return (
    <form
      id="straight-set-form"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="flex flex-col gap-6"
    >
      <ExerciseSelect
        value={selectedExercise}
        onSelect={handleExerciseSelect}
      />
      <FieldSet>
        <FieldLegend>Set Details</FieldLegend>
        <FieldDescription>
          Enter the amount of sets and repetitions. Optionally, you can enter a
          weight or percentage to use aswell as a rest period between sets.
        </FieldDescription>
      </FieldSet>

      <div className="grid grid-cols-2 gap-x-2 gap-y-4">
        <form.Field
          name="sets"
          children={(field) => {
            const isInvalid = !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Sets</FieldLabel>
                <Input
                  id={field.name}
                  type="number"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  aria-invalid={isInvalid}
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )
          }}
        />
        <form.Field
          name="repetitions"
          children={(field) => {
            const isInvalid = !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Repetitions</FieldLabel>
                <Input
                  id={field.name}
                  type="number"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  aria-invalid={isInvalid}
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )
          }}
        />
        <form.Field
          name="target_weight"
          children={(field) => {
            const isInvalid = !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Target Weight (kg/lbs)
                </FieldLabel>
                <Input
                  id={field.name}
                  type="number"
                  step="0.05"
                  min="0.25"
                  max="9999.99"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  aria-invalid={isInvalid}
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )
          }}
        />
        <form.Field
          name="percentage"
          children={(field) => {
            const isInvalid = !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Percentage (1-100)%
                </FieldLabel>
                <Input
                  id={field.name}
                  type="number"
                  min="1"
                  max="100"
                  step="1"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  aria-invalid={isInvalid}
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )
          }}
        />
      </div>

      <form.Field
        name="workout_name"
        children={(field) => {
          const isInvalid = !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <div className="flex gap-2">
                <FieldLabel htmlFor={field.name}>
                  (Optional) Block Name
                </FieldLabel>
                <AppTooltip
                  content={
                    'You can name the block to help you identify it later or make it more descriptive.'
                  }
                />
              </div>
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
    </form>
  )
}
