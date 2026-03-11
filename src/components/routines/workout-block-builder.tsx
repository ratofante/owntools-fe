import { useState } from 'react'
import { ArrowLeftIcon } from 'lucide-react'
import type { WorkoutTypeOption } from '@/types/routine'
import { WorkoutTypeSelector } from '@/components/routines/workout-type-selector'
import { StraightSetBuilder } from '@/components/routines/straight_set_builder'
import { Button } from '@/components/ui/button'

export function WorkoutBlockBuilder() {
  const [workoutType, setWorkoutType] = useState<WorkoutTypeOption | null>(null)

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
          <StraightSetBuilder />
        </div>
      )}
      {workoutType && (
        <Button variant="outline" onClick={() => setWorkoutType(null)}>
          <ArrowLeftIcon className="size-4" />
          Back
        </Button>
      )}
    </div>
  )
}
