import type { ExerciseType } from '@/types/exercise'
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
}

export function ExerciseSheet({
  open,
  onOpenChange,
  exercise,
}: ExerciseSheetProps) {
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
          {/* --- plain div version --- */}
          <div className="flex gap-1">
            <div className="flex-1">
              <Label className="text-base font-medium">Body Zones</Label>
              {exercise?.bodyZones.length ? (
                <div className="flex flex-col gap-2 mt-2">
                  {primaryBodyZones && primaryBodyZones.length > 0 && (
                    <div className="flex flex-col gap-1">
                      <Label className="text-muted-foreground text-xs">
                        Primary
                      </Label>
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
            <div className="flex-1 bg-muted p-4 rounded-md">
              <Label className="text-base font-medium underline text-muted-foreground">
                Muscle Groups
              </Label>
              {exercise?.muscleGroups.length ? (
                <div className="flex flex-col gap-2 mt-2">
                  {primaryMuscleGroups && primaryMuscleGroups.length > 0 && (
                    <div className="flex flex-col gap-1">
                      <Label className="text-muted-foreground text-xs">
                        Primary
                      </Label>
                      <div className="max-w-3xs flex flex-wrap gap-1 w-fit">
                        {primaryMuscleGroups.map((muscleGroup) => (
                          <Badge key={muscleGroup.id} variant="default">
                            {muscleGroup.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {secondaryMuscleGroups &&
                    secondaryMuscleGroups.length > 0 && (
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
                <Label className="block mt-2">
                  No muscle groups registered
                </Label>
              )}
            </div>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
