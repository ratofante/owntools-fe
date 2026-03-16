import { useRef, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { format } from 'date-fns'
import { isSortableOperation } from '@dnd-kit/react/sortable'
import { DragDropProvider } from '@dnd-kit/react'

import type { User } from '@/hooks/use-auth'
import type { WorkoutBlockDraft } from '@/types/routine'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { WorkoutBlockBuilder } from '@/components/routines/workout-block-builder'
import { WorkoutBlockCard } from '@/components/routines/workout-block-card'
import { workoutTypes } from '@/consts/workout-types'
import { useRoutineBuilderStore } from '@/stores/routine-builder-store'

function reorder<T>(array: Array<T>, from: number, to: number): Array<T> {
  const result = [...array]
  const [removed] = result.splice(from, 1)
  result.splice(to, 0, removed)
  return result
}

export function RoutineBuilder({ user }: { user: User }) {
  const { editingBlock, startEditing } = useRoutineBuilderStore()
  const [blockIds, setBlockIds] = useState<Array<number>>([])
  const nextId = useRef(0)

  const form = useForm({
    defaultValues: {
      name: `${format(new Date(), 'dd-MM-yyyy')} Routine`,
      createdBy: user.id,
      workoutBlocks: [] as Array<WorkoutBlockDraft>,
    },
  })

  function handleBlockComplete(block: WorkoutBlockDraft) {
    if (editingBlock !== null) {
      form.setFieldValue('workoutBlocks', (prev) =>
        prev.map((b, i) => (i === editingBlock.index ? block : b)),
      )
    } else {
      const newId = nextId.current++
      setBlockIds((prev) => [...prev, newId])
      form.setFieldValue('workoutBlocks', (prev) => [...prev, block])
    }
    console.log(form.state.values)
  }

  function handleDragEnd({
    operation,
  }: {
    operation: Parameters<typeof isSortableOperation>[0]
  }) {
    if (
      !isSortableOperation(operation) ||
      !operation.source ||
      !operation.target
    )
      return

    const from = operation.source.initialIndex
    const to = operation.target.index
    if (from === to) return

    form.setFieldValue('workoutBlocks', (prev) => reorder(prev, from, to))
    setBlockIds((prev) => reorder(prev, from, to))
  }

  return (
    <div className="@container">
      <form
        id="routine-builder-form"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="space-y-6 @2xl:grid @2xl:grid-cols-2 @2xl:gap-4"
      >
        <div className="space-y-4">
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
              <DragDropProvider onDragEnd={handleDragEnd}>
                <div className="space-y-2">
                  {workoutBlocks.map((block, index) => (
                    <WorkoutBlockCard
                      key={blockIds[index]}
                      id={blockIds[index] ?? index}
                      index={index}
                      block={block}
                      editMode={true}
                      onDelete={() => {
                        form.setFieldValue('workoutBlocks', (prev) =>
                          prev.filter((_, i) => i !== index),
                        )
                        setBlockIds((prev) =>
                          prev.filter((_, i) => i !== index),
                        )
                      }}
                      onEdit={() => {
                        startEditing(
                          index,
                          block,
                          workoutTypes[block.blockType],
                        )
                      }}
                    />
                  ))}
                </div>
              </DragDropProvider>
            )}
          />
        </div>

        <div className="@2xl:col-start-2 @2xl:row-start-1">
          <WorkoutBlockBuilder onBlockComplete={handleBlockComplete} />
        </div>
      </form>
    </div>
  )
}
