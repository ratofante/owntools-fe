import { useState } from 'react'
import type { WorkoutTypeOption } from '@/types/routine'
import { WorkoutTypeSelector } from '@/components/routines/workout-type-selector'
import { StraightSetBuilder } from '@/components/routines/straight_set_builder'

export function WorkoutBlockBuilder() {
  const [workoutType, setWorkoutType] = useState<WorkoutTypeOption | null>(null)

  return (
    <div className="space-y-6">
      <WorkoutTypeSelector
        onSelect={(type) => {
          setWorkoutType(type)
        }}
      />
      {workoutType && (
        <div className="flex flex-col gap-6">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <workoutType.icon className="size-4" />
            {workoutType.label}
          </h3>
          <StraightSetBuilder />
        </div>
      )}
    </div>
  )
}
