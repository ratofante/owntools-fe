import React from 'react'
import { EllipsisVerticalIcon } from 'lucide-react'
import type { WorkoutBlockDraft } from '@/types/routine'
import { workoutTypes } from '@/consts/workout-types'
import { formatSecondsToTime } from '@/lib/utils'
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

export function WorkoutBlockCard({
  block,
  editMode = false,
  onDelete,
}: {
  block: WorkoutBlockDraft
  editMode?: boolean
  onDelete: () => void
}) {
  return (
    <>
      {block.blockType === 'straight_set' && (
        <Card size="sm">
          <CardHeader>
            <CardTitle>
              <div className="flex gap-2 items-center w-fit">
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
                    <DropdownMenuItem>Edit</DropdownMenuItem>
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
