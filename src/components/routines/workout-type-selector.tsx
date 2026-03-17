import type { WorkoutTypeOption } from '@/types/routine-old'
import { Button } from '@/components/ui/button'
import { AppTooltip } from '@/components/app-tooltip'
import { Label } from '@/components/ui/label'
import { workoutTypes } from '@/consts/workout-types'

export function WorkoutTypeSelector({
  onSelect,
}: {
  onSelect: (type: WorkoutTypeOption) => void
}) {
  const buttons: Array<WorkoutTypeOption> = Object.values(workoutTypes)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label htmlFor="workout-type-buttons">Workout Type</Label>
        <AppTooltip
          content={
            <ul className="space-y-1">
              {buttons.map((option) => (
                <li key={option.type}>
                  <span className="font-semibold">{option.label}</span>
                  {' — '}
                  {option.description}
                </li>
              ))}
            </ul>
          }
        />
      </div>
      <div id="workout-type-buttons" className="flex flex-col gap-2">
        {buttons.map((workoutTypeOption) => (
          <Button
            key={workoutTypeOption.type}
            variant="outline"
            size="lg"
            onClick={() => onSelect(workoutTypeOption)}
          >
            <workoutTypeOption.icon className="size-4" />
            {workoutTypeOption.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
