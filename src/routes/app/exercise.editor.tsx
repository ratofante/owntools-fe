import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { Loader2 } from 'lucide-react'
import type { CreateExerciseType, UpdateExerciseType } from '@/types/exercise'
import { CreateExerciseSchema, UpdateExerciseSchema } from '@/types/exercise'
import { useGetMuscleGroups } from '@/hooks/use-get-muscle-groups'
import { useGetBodyZones } from '@/hooks/use-get-body-zones'
import { useCreateExercise, useUpdateExercise } from '@/hooks/use-exercises'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MuscleGroupsMultipleSelect } from '@/components/muscle-groups/muscle-groups-multiple-select'
import { BodyZonesMultipleSelect } from '@/components/body-zones/body-zones-multiple-select'
import { Button } from '@/components/ui/button'
import { useExercisesTableStore } from '@/stores/exercises-table-store'

export const Route = createFileRoute('/app/exercise/editor')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate({ from: '/app/exercise/editor' })
  const { data: muscleGroupsData } = useGetMuscleGroups()
  const { data: bodyZonesData } = useGetBodyZones()
  const allMuscleGroups = muscleGroupsData?.data ?? []
  const allBodyZones = bodyZonesData?.data ?? []
  const { mutateAsync: createExercise, isPending: isCreatingExercise } =
    useCreateExercise()
  const { mutateAsync: updateExercise, isPending: isUpdatingExercise } =
    useUpdateExercise()

  const exerciseToEdit = useExercisesTableStore((s) => s.exercise)
  const isEditing = exerciseToEdit !== null
  const validationSchema = isEditing
    ? UpdateExerciseSchema
    : CreateExerciseSchema

  const form = useForm({
    validators: {
      onMount: validationSchema,
      onChange: validationSchema,
      onSubmit: validationSchema,
    },
    defaultValues: isEditing
      ? ({
          id: exerciseToEdit.id,
          name: exerciseToEdit.name,
          description: exerciseToEdit.description,
          videoUrl: exerciseToEdit.videoUrl,
          bodyZones: exerciseToEdit.bodyZones,
          muscleGroups: exerciseToEdit.muscleGroups,
        } as UpdateExerciseType)
      : ({
          name: '',
          description: null,
          videoUrl: null,
          bodyZones: [],
          muscleGroups: [],
        } as CreateExerciseType),
    onSubmit: async ({ value }) => {
      if (isEditing) {
        await updateExercise(value as UpdateExerciseType, {
          onSuccess: () => {
            useExercisesTableStore.setState({ exercise: null })
            navigate({ to: '/app/exercises' })
          },
        })
      } else {
        await createExercise(value, {
          onSuccess: () => {
            console.log('created exercise SUCCESS')
          },
        })
        navigate({ to: '/app/exercises' })
      }
    },
  })

  return (
    <div className="flex-1 flex flex-col @container space-y-4">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold mr-auto">
          {isEditing ? 'Edit Exercise' : 'Add Exercise'}
        </h1>
      </div>
      <div className="bg-muted shadow-md rounded-lg p-4 max-w-md border">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          onChange={() => {
            console.log(form.state)
          }}
        >
          <FieldGroup>
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  form.state.isSubmitted && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      required
                    />
                    <FieldError
                      errors={
                        field.state.meta.isBlurred
                          ? field.state.meta.errors
                          : []
                      }
                    />
                  </Field>
                )
              }}
            />
            <form.Field
              name="description"
              children={(field) => {
                const isInvalid =
                  form.state.isSubmitted && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value ?? ''}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    <FieldError
                      errors={
                        field.state.meta.isBlurred
                          ? field.state.meta.errors
                          : []
                      }
                    />
                  </Field>
                )
              }}
            />
            <form.Field
              name="videoUrl"
              children={(field) => {
                const isInvalid =
                  form.state.isSubmitted && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Video URL</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value ?? ''}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    <FieldError
                      errors={
                        field.state.meta.isBlurred
                          ? field.state.meta.errors
                          : []
                      }
                    />
                  </Field>
                )
              }}
            />
            <form.Field
              name="muscleGroups"
              children={(field) => {
                const primaryIds = field.state.value
                  .filter((mg) => mg.involvement_level === 'primary')
                  .map((mg) => mg.id.toString())
                const secondaryIds = field.state.value
                  .filter((mg) => mg.involvement_level === 'secondary')
                  .map((mg) => mg.id.toString())

                const handlePrimaryChange = (newIds: Array<string>) => {
                  const secondary = field.state.value.filter(
                    (mg) => mg.involvement_level === 'secondary',
                  )
                  const primary = newIds.map((id) => ({
                    ...allMuscleGroups.find((mg) => mg.id.toString() === id)!,
                    involvement_level: 'primary' as const,
                  }))
                  field.handleChange([...primary, ...secondary])
                }

                const handleSecondaryChange = (newIds: Array<string>) => {
                  const primary = field.state.value.filter(
                    (mg) => mg.involvement_level === 'primary',
                  )
                  const secondary = newIds.map((id) => ({
                    ...allMuscleGroups.find((mg) => mg.id.toString() === id)!,
                    involvement_level: 'secondary' as const,
                  }))
                  field.handleChange([...primary, ...secondary])
                }

                return (
                  <Field>
                    <FieldLabel>Muscle Groups</FieldLabel>
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Primary</p>
                        <MuscleGroupsMultipleSelect
                          className="w-full"
                          values={primaryIds}
                          onValuesChange={handlePrimaryChange}
                          disabledValues={secondaryIds}
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Secondary
                        </p>
                        <MuscleGroupsMultipleSelect
                          className="w-full"
                          values={secondaryIds}
                          onValuesChange={handleSecondaryChange}
                          disabledValues={primaryIds}
                        />
                      </div>
                    </div>
                  </Field>
                )
              }}
            />
            <form.Field
              name="bodyZones"
              children={(field) => {
                const primaryIds = field.state.value
                  .filter((bz) => bz.zone_importance === 'primary')
                  .map((bz) => bz.id.toString())
                const secondaryIds = field.state.value
                  .filter((bz) => bz.zone_importance === 'secondary')
                  .map((bz) => bz.id.toString())

                const handlePrimaryChange = (newIds: Array<string>) => {
                  const secondary = field.state.value.filter(
                    (bz) => bz.zone_importance === 'secondary',
                  )
                  const primary = newIds.map((id) => ({
                    ...allBodyZones.find((bz) => bz.id.toString() === id)!,
                    zone_importance: 'primary' as const,
                  }))
                  field.handleChange([...primary, ...secondary])
                }

                const handleSecondaryChange = (newIds: Array<string>) => {
                  const primary = field.state.value.filter(
                    (bz) => bz.zone_importance === 'primary',
                  )
                  const secondary = newIds.map((id) => ({
                    ...allBodyZones.find((bz) => bz.id.toString() === id)!,
                    zone_importance: 'secondary' as const,
                  }))
                  field.handleChange([...primary, ...secondary])
                }

                return (
                  <Field>
                    <FieldLabel>Body Zones</FieldLabel>
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Primary</p>
                        <BodyZonesMultipleSelect
                          className="w-full"
                          values={primaryIds}
                          onValuesChange={handlePrimaryChange}
                          disabledValues={secondaryIds}
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Secondary
                        </p>
                        <BodyZonesMultipleSelect
                          className="w-full"
                          values={secondaryIds}
                          onValuesChange={handleSecondaryChange}
                          disabledValues={primaryIds}
                        />
                      </div>
                    </div>
                  </Field>
                )
              }}
            />
          </FieldGroup>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                disabled={
                  !canSubmit || isCreatingExercise || isUpdatingExercise
                }
                className="w-full mt-6"
              >
                {isSubmitting || isCreatingExercise || isUpdatingExercise ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isEditing
                      ? 'Updating exercise...'
                      : 'Creating exercise...'}
                  </>
                ) : isEditing ? (
                  'Update'
                ) : (
                  'Create'
                )}
              </Button>
            )}
          />
        </form>
      </div>
    </div>
  )
}
