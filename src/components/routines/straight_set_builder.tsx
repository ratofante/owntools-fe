import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import type { ExerciseType } from '@/types/exercise'
import type {
  StraightSetBlockDraft,
  TargetWeightUnit,
  WorkoutBlockDraft,
} from '@/types/routine-old'

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AppTooltip } from '@/components/app-tooltip'
import { ExerciseSelect } from '@/components/exercises/exercise-select'
import { TargetWeightUnitSelect } from '@/components/routines/target-weight-unit-select'

const straightSetValidator = z.object({
  exercise_id: z.number().int().positive(),
  workout_name: z.string().or(z.undefined()),
  sets: z.number().min(1),
  repetitions: z.number().min(1),
  target_weight: z.number().min(0.25).max(9999.99).or(z.undefined()),
  target_weight_unit: z.enum(['kg', 'lbs', 'cal']).nullable(),
  percentage: z.number().int().min(1).max(100).or(z.undefined()),
  rest: z.number().or(z.undefined()),
})

export function StraightSetBuilder({
  onBlockComplete,
  initialData,
}: {
  onBlockComplete: (block: WorkoutBlockDraft) => void
  initialData?: StraightSetBlockDraft | null
}) {
  const [selectedExercise, setSelectedExercise] = useState<ExerciseType | null>(
    initialData?.workout.setExercise.exercise ?? null,
  )
  const form = useForm({
    defaultValues: {
      exercise_id: initialData?.workout.setExercise.exercise.id,
      workout_name: (initialData?.name ?? '') as string | undefined,
      sets: initialData?.workout.sets ?? 3,
      repetitions: initialData?.workout.setExercise.repetitions ?? 6,
      target_weight: initialData?.workout.setExercise.targetWeight ?? undefined,
      target_weight_unit: (initialData?.workout.setExercise.targetWeightUnit ??
        'kg') as TargetWeightUnit | null,
      percentage: initialData?.workout.setExercise.percentage ?? undefined,
      rest: initialData?.workout.rest ?? undefined,
    },
    validators: {
      onSubmit: straightSetValidator,
    },
    onSubmit: ({ value }) => {
      onBlockComplete({
        blockType: 'straight_set',
        name: value.workout_name ?? null,
        workout: {
          sets: value.sets,
          rest: value.rest ?? null,
          setExercise: {
            exercise: selectedExercise!,
            repetitions: value.repetitions,
            targetWeight: value.target_weight ?? null,
            targetWeightUnit: value.target_weight_unit,
            percentage: value.percentage ?? null,
          },
        },
      })
    },
  })

  const hasExercise = !!form.state.values.exercise_id
  const isEditing = initialData != null

  return (
    <div className="flex flex-col gap-6">
      <form.Field
        name="exercise_id"
        validators={{
          onMount: ({ value }) =>
            !value ? { message: 'Please select an exercise' } : undefined,
          onChange: ({ value }) =>
            !value ? { message: 'Please select an exercise' } : undefined,
        }}
        children={(field) => {
          const showError =
            field.state.meta.isDirty && !field.state.meta.isValid
          return (
            <Field data-invalid={showError}>
              <ExerciseSelect
                value={selectedExercise}
                onSelect={(exercise) => {
                  setSelectedExercise(exercise)
                  field.handleChange(exercise?.id)
                  field.handleBlur()
                }}
              />
              {showError && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
        }}
      />
      <FieldSet>
        <FieldLegend>Set Details</FieldLegend>
        <FieldDescription>
          Enter the amount of sets and repetitions. Optionally, you can enter a
          weight or percentage to use aswell as a rest period between sets.
        </FieldDescription>
      </FieldSet>

      <div className="grid grid-cols-2 gap-x-2 gap-y-4">
        <div className="flex gap-2">
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
        </div>
        <div className="flex gap-2">
          <form.Field
            name="target_weight"
            children={(field) => {
              const isInvalid = !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid} className="">
                  <FieldLabel htmlFor={field.name}>Target Weight</FieldLabel>
                  <Input
                    id={field.name}
                    type="number"
                    step="0.05"
                    min="0.25"
                    max="9999.99"
                    name={field.name}
                    value={field.state.value ?? ''}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value === ''
                          ? undefined
                          : Number(e.target.value),
                      )
                    }
                    aria-invalid={isInvalid}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )
            }}
          />
          <form.Field
            name="target_weight_unit"
            children={(field) => {
              const isInvalid =
                !field.state.meta.isValid && field.state.meta.isDirty
              return (
                <Field data-invalid={isInvalid} className="w-fit">
                  <FieldLabel htmlFor={field.name}>Unit</FieldLabel>
                  <TargetWeightUnitSelect
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )
            }}
          />
        </div>
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
                  value={field.state.value ?? ''}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(
                      e.target.value === ''
                        ? undefined
                        : Number(e.target.value),
                    )
                  }
                  aria-invalid={isInvalid}
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )
          }}
        />
        <form.Field
          name="rest"
          children={(field) => {
            const isInvalid =
              !field.state.meta.isValid && field.state.meta.isDirty
            return (
              <Field data-invalid={isInvalid} className="">
                <FieldLabel htmlFor={field.name}>Rest (seconds)</FieldLabel>
                <Input
                  id={field.name}
                  type="number"
                  name={field.name}
                  value={field.state.value ?? ''}
                  onChange={(e) =>
                    field.handleChange(
                      e.target.value === ''
                        ? undefined
                        : Number(e.target.value),
                    )
                  }
                  onBlur={field.handleBlur}
                  aria-invalid={isInvalid}
                />
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

      <Button
        type="button"
        onClick={() => form.handleSubmit()}
        disabled={!hasExercise || !form.state.isValid}
        className="mt-8"
      >
        {isEditing ? 'Update Block' : 'Add Block'}
      </Button>
    </div>
  )
}
