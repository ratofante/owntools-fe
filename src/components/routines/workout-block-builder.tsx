import { ArrowLeftIcon } from 'lucide-react'
import type { WorkoutBlockDraft } from '@/types/routine'
import { WorkoutTypeSelector } from '@/components/routines/workout-type-selector'
import { StraightSetBuilder } from '@/components/routines/straight_set_builder'
import { Button } from '@/components/ui/button'
import { useRoutineBuilderStore } from '@/stores/routine-builder-store'

export function WorkoutBlockBuilder({
  onBlockComplete,
}: {
  onBlockComplete: (block: WorkoutBlockDraft) => void
}) {
  const { workoutType, editingBlock, setWorkoutType, reset } =
    useRoutineBuilderStore()

  function handleBlockComplete(block: WorkoutBlockDraft) {
    onBlockComplete(block)
    reset()
  }

  const straightSetInitialData =
    editingBlock?.block.blockType === 'straight_set'
      ? editingBlock.block
      : null

  return (
    <div className="space-y-6">
      {!workoutType ? (
        <WorkoutTypeSelector
          onSelect={(type) => {
            setWorkoutType(type)
          }}
        />
      ) : (
        <div className="flex flex-col gap-6">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <workoutType.icon className="size-4" />
            {workoutType.label}
          </h3>
          {workoutType.type === 'straight_set' && (
            <StraightSetBuilder
              key={
                editingBlock ? `edit-${editingBlock.index}` : 'new'
              }
              initialData={straightSetInitialData}
              onBlockComplete={(block) => handleBlockComplete(block)}
            />
          )}
        </div>
      )}
      {workoutType && (
        <Button variant="outline" onClick={() => reset()}>
          <ArrowLeftIcon className="size-4" />
          Back
        </Button>
      )}
    </div>
  )
}
