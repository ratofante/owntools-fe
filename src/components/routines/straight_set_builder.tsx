import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

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

const straightSetValidator = z.object({
  workout_name: z.string().min(1).or(z.undefined()),
  sets: z.number().min(1),
  repetitions: z.number().min(1),
  weight: z.number().or(z.undefined()),
  percentage: z.number().or(z.undefined()),
  rest: z.number().or(z.undefined()),
})

const formOptions = {
  defaultValues: {
    workout_name: '' as string | undefined,
    sets: 3,
    repetitions: 6,
    weight: undefined as number | undefined,
    percentage: undefined as number | undefined,
    rest: undefined as number | undefined,
  },
  validators: {
    onSubmit: straightSetValidator,
  },
}

export function StraightSetBuilder() {
  const form = useForm({
    ...formOptions,
  })
  return (
    <form
      id="straight-set-form"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="flex flex-col gap-6"
    >
      <form.Field
        name="workout_name"
        children={(field) => {
          const isInvalid = !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <div className="flex items-center gap-2">
                <FieldLabel htmlFor={field.name}>Block Name</FieldLabel>
                <AppTooltip
                  content={
                    '(Optional) you can name the block to help you identify it later or make it more descriptive.'
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
      <FieldSet>
        <FieldLegend>Set Details</FieldLegend>
        <FieldDescription>
          Enter the amount of sets and repetitions. Optionally, you can enter a
          weight or percentage to use aswell as a rest period between sets.
        </FieldDescription>
      </FieldSet>
    </form>
  )
}
