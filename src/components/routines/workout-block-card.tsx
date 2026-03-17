import React from 'react'
import {
  ClockFading,
  GripVerticalIcon,
  PencilIcon,
  TrashIcon,
} from 'lucide-react'
import { useSortable } from '@dnd-kit/react/sortable'
import type { WorkoutBlockType, WorkoutBlockKind } from '@/types'
import { workoutTypes } from '@/consts/workout-types'
import { cn, formatSecondsToTime } from '@/lib/utils'
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRoutineBuilderStore } from '@/stores/routine-builder-store'
import { SetExercise } from '@/components/exercises/set-exercise'

export function WorkoutBlockCard({
  workoutBlock,
  id,
  index,
  editMode = false,
  onDelete,
  onEdit,
}: {
  workoutBlock: WorkoutBlockType
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
      <Card
        ref={ref}
        size="default"
        className={cn(isDragging && 'opacity-50', '')}
      >
        {editMode && (
          <div className="flex gap-1 px-4 justify-between">
            <Button
              variant="outline"
              size="icon"
              ref={handleRef}
              type="button"
              className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
              aria-label="Drag to reorder"
            >
              <GripVerticalIcon className="size-4" />
            </Button>

            <WorkoutTypeBadge workoutType={workoutBlock.type} />

            <CardAction className="ml-auto">
              <div className="flex gap-1">
                <Button size="icon" variant="outline" onClick={onEdit}>
                  <PencilIcon className="size-4" />
                </Button>
                <Button size="icon" variant="outline" onClick={onDelete}>
                  <TrashIcon className="size-4" />
                </Button>
              </div>
            </CardAction>
          </div>
        )}
        <CardHeader>
          <CardTitle>
            <div className="flex gap-2 items-start justify-between">
              <div className="flex flex-col gap-1">
                {!workoutBlock.name && !workoutBlock.description ? (
                  <p>{workoutTypes[workoutBlock.type].label}</p>
                ) : (
                  <div className="space-y-1">
                    <p className="text-base font-medium">{workoutBlock.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {workoutBlock.description}
                    </p>
                  </div>
                )}
              </div>
              {!editMode && (
                <Badge variant="default" className="size-8">
                  {' '}
                  {workoutBlock.position}
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {workoutBlock.workoutDuration && (
              <Badge
                variant="outline"
                className="bg-secondary text-secondary-foreground"
              >
                <ClockFading className="size-4" />
                {formatSecondsToTime(workoutBlock.workoutDuration)}
              </Badge>
            )}

            {workoutBlock.roundsPerWorkout &&
              workoutBlock.roundsPerWorkout > 1 && (
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-secondary text-secondary-foreground"
                  >
                    {/* <RepeatIcon className="size-4" /> */}
                    {workoutBlock.roundsPerWorkout} rounds
                  </Badge>
                  {workoutBlock.restAfterRound &&
                    workoutBlock.restAfterRound > 0 && (
                      <p className="leading-none text-xs font-medium text-muted-foreground">
                        Rest {formatSecondsToTime(workoutBlock.restAfterRound)}{' '}
                        between rounds
                      </p>
                    )}
                </div>
              )}

            {workoutBlock.sets.length > 0 && (
              <div className="flex flex-col gap-2 bg-background rounded-sm">
                {workoutBlock.sets.map((set) => (
                  <div key={set.id}>
                    <SetExercise set={set} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </>
  )
}

function WorkoutTypeIcon({ workoutType }: { workoutType: WorkoutBlockKind }) {
  return (
    <div className="grid place-items-center bg-accent rounded-sm">
      {React.createElement(workoutTypes[workoutType].icon, {
        className: 'size-3',
      })}
    </div>
  )
}

function WorkoutTypeBadge({ workoutType }: { workoutType: WorkoutBlockKind }) {
  return (
    <Badge className="bg-accent text-accent-foreground">
      <WorkoutTypeIcon workoutType={workoutType} />
      <span className="text-xs font-semibold text-accent-foreground">
        {workoutTypes[workoutType].label}
      </span>
    </Badge>
  )
}
