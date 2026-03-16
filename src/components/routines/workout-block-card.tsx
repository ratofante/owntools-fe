import React from 'react'
import { EllipsisVerticalIcon, GripVerticalIcon } from 'lucide-react'
import { useSortable } from '@dnd-kit/react/sortable'
import type { WorkoutBlockDraft } from '@/types/routine'
import { workoutTypes } from '@/consts/workout-types'
import { cn, formatSecondsToTime } from '@/lib/utils'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRoutineBuilderStore } from '@/stores/routine-builder-store'

export function WorkoutBlockCard({
  block,
  id,
  index,
  editMode = false,
  onDelete,
  onEdit,
}: {
  block: WorkoutBlockDraft
  id: number
  index: number
  editMode?: boolean
  onDelete: () => void
  onEdit?: () => void
}) {
  const isBuilderActive = useRoutineBuilderStore((s) => s.workoutType !== null)
  const { ref, handleRef, isDragging } = useSortable({ id, index })

  return (
    <>
      {block.blockType === 'straight_set' && (
        <Card ref={ref} size="sm" className={cn(isDragging && 'opacity-50')}>
          <CardHeader>
            <CardTitle>
              <div className="flex gap-2 items-center w-fit">
                {editMode && (
                  <button
                    ref={handleRef}
                    type="button"
                    className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
                    aria-label="Drag to reorder"
                  >
                    <GripVerticalIcon className="size-4" />
                  </button>
                )}
                <div className="grid row-span-2 place-items-center bg-muted w-9 h-9 rounded-sm">
                  {React.createElement(workoutTypes[block.blockType].icon, {
                    className: 'size-4',
                  })}
                </div>
                <p className="text-base font-medium">
                  {block.workout.setExercise.exercise.name}:{' '}
                  {block.workout.sets} sets of{' '}
                  {block.workout.setExercise.repetitions} reps
                </p>
              </div>
            </CardTitle>
            {editMode && (
              <CardAction className="ml-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <EllipsisVerticalIcon className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="start">
                    <DropdownMenuItem
                      disabled={isBuilderActive}
                      onSelect={onEdit}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onSelect={onDelete}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardAction>
            )}
          </CardHeader>
          {(block.workout.setExercise.targetWeight ||
            block.workout.setExercise.percentage ||
            block.workout.rest) && (
            <CardContent>
              <div className="flex gap-2">
                {block.workout.setExercise.targetWeight && (
                  <Badge variant="default">
                    {block.workout.setExercise.targetWeight}{' '}
                    {block.workout.setExercise.targetWeightUnit}
                  </Badge>
                )}
                {block.workout.setExercise.percentage && (
                  <Badge variant="secondary">
                    {block.workout.setExercise.percentage}%
                  </Badge>
                )}
                {block.workout.rest && (
                  <Badge variant="outline">
                    {formatSecondsToTime(block.workout.rest)} between sets
                  </Badge>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </>
  )
}
