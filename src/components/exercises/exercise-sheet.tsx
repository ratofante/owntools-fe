import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import type { ExerciseType } from '@/types/index'
import type { RegisteredRouter } from '@tanstack/react-router'
import type { RoutePaths } from '@tanstack/router-core'
import { cn } from '@/lib/utils'
import { useDeleteExercise } from '@/hooks/use-exercises'
import { useExercisesTableStore } from '@/stores/exercises-table-store'
import { Separator } from '@/components/ui/separator'
import { VideoEmbed } from '@/components/video-embed'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'

interface ExerciseSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  exercise: ExerciseType | null
  fromRoute: RoutePaths<RegisteredRouter['routeTree']>
}

export function ExerciseSheet({
  open,
  onOpenChange,
  exercise,
  fromRoute,
}: ExerciseSheetProps) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const { setExercise, setOpenExerciseSheet } = useExercisesTableStore()
  const { mutateAsync: deleteExercise, isPending: isDeletingExercise } =
    useDeleteExercise()
  const navigate = useNavigate({ from: fromRoute as any })
  console.log(exercise)

  function handleEditExercise() {
    setExercise(exercise)
    setOpenExerciseSheet(false)
    navigate({ to: '/app/exercise/editor' })
  }

  function handleDeleteExercise() {
    deleteExercise(exercise?.id ?? 0, {
      onSuccess: () => {
        setDeleteOpen(false)
        setExercise(null)
        setOpenExerciseSheet(false)
      },
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{exercise?.name}</SheetTitle>
          <SheetDescription>{exercise?.description}</SheetDescription>
        </SheetHeader>
        <div className="px-4 flex flex-col gap-4">
          <Separator />
          <VideoEmbed url={exercise?.videoUrl} />
          <Separator />
          <ExerciseZonesAndGroups exercise={exercise} />
        </div>
        <SheetFooter>
          <Button
            variant="default"
            disabled={isDeletingExercise}
            onClick={handleEditExercise}
          >
            Edit
          </Button>
          <div>
            <Button
              variant="secondary"
              className={cn('w-full', deleteOpen ? 'hidden' : 'block')}
              onClick={() => setDeleteOpen(true)}
            >
              Delete
            </Button>
            <div className={cn('w-full gap-2', deleteOpen ? 'flex' : 'hidden')}>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDeleteOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => handleDeleteExercise()}
                disabled={isDeletingExercise}
              >
                {isDeletingExercise ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> 'Deleting ...'
                  </>
                ) : (
                  'Confirm'
                )}
              </Button>
            </div>
          </div>
          <SheetClose asChild>
            <Button variant="outline" disabled={isDeletingExercise}>
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function ExerciseZonesAndGroups({
  exercise,
}: {
  exercise: ExerciseType | null
}) {
  const primaryBodyZones = exercise?.bodyZones.filter(
    (bodyZone) => bodyZone.zone_importance === 'primary',
  )
  const secondaryBodyZones = exercise?.bodyZones.filter(
    (bodyZone) => bodyZone.zone_importance === 'secondary',
  )
  const primaryMuscleGroups = exercise?.muscleGroups.filter(
    (muscleGroup) => muscleGroup.involvement_level === 'primary',
  )
  const secondaryMuscleGroups = exercise?.muscleGroups.filter(
    (muscleGroup) => muscleGroup.involvement_level === 'secondary',
  )

  return (
    <div className="flex gap-1">
      <div className="flex-1">
        <Label className="text-base font-medium">Body Zones</Label>
        {exercise?.bodyZones.length ? (
          <div className="flex flex-col gap-2 mt-2">
            {primaryBodyZones && primaryBodyZones.length > 0 && (
              <div className="flex flex-col gap-1">
                <Label className="text-muted-foreground text-xs">Primary</Label>
                <div className="max-w-3xs flex flex-wrap gap-1 w-fit">
                  {primaryBodyZones.map((bodyZone) => (
                    <Badge
                      key={bodyZone.id}
                      variant="outline"
                      style={{ backgroundColor: bodyZone.hexColor }}
                    >
                      {bodyZone.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {secondaryBodyZones && secondaryBodyZones.length > 0 && (
              <div className="flex flex-col gap-1">
                <Label className="text-muted-foreground text-xs">
                  Secondary
                </Label>
                <div className="max-w-3xs flex flex-wrap gap-1 w-fit">
                  {secondaryBodyZones.map((bodyZone) => (
                    <Badge
                      key={bodyZone.id}
                      variant="outline"
                      style={{ backgroundColor: bodyZone.hexColor }}
                    >
                      {bodyZone.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <Label className="block mt-2">No body zones registered</Label>
        )}
      </div>
      <div className="flex-1">
        <Label className="text-base font-medium">Muscle Groups</Label>
        {exercise?.muscleGroups.length ? (
          <div className="flex flex-col gap-2 mt-2">
            {primaryMuscleGroups && primaryMuscleGroups.length > 0 && (
              <div className="flex flex-col gap-1">
                <Label className="text-muted-foreground text-xs">Primary</Label>
                <div className="max-w-3xs flex flex-wrap gap-1 w-fit">
                  {primaryMuscleGroups.map((muscleGroup) => (
                    <Badge key={muscleGroup.id} variant="default">
                      {muscleGroup.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {secondaryMuscleGroups && secondaryMuscleGroups.length > 0 && (
              <div className="flex flex-col gap-1">
                <Label className="text-muted-foreground text-xs">
                  Secondary
                </Label>
                <div className="max-w-3xs flex flex-wrap gap-1 w-fit">
                  {secondaryMuscleGroups.map((muscleGroup) => (
                    <Badge key={muscleGroup.id} variant="secondary">
                      {muscleGroup.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <Label className="block mt-2">No muscle groups registered</Label>
        )}
      </div>
    </div>
  )
}
