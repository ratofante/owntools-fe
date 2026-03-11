import { Activity, ClockFading, Dumbbell, FileClock } from 'lucide-react'
import type { WorkoutTypeOption } from '@/types/routine'
import { Button } from '@/components/ui/button'
import { AppTooltip } from '@/components/app-tooltip'
import { Label } from '@/components/ui/label'

export function WorkoutTypeSelector({
  onSelect,
}: {
  onSelect: (type: WorkoutTypeOption) => void
}) {
  const buttons: Array<WorkoutTypeOption> = [
    {
      type: 'straight_set',
      label: 'Single',
      description: 'Sets of reps of a single exercise',
      icon: Dumbbell,
    },
    {
      type: 'timed_set',
      label: 'Timed Set',
      description: 'A timed block of multiple exercises (AMRAP or Chipper)',
      icon: ClockFading,
    },
    {
      type: 'emom',
      label: 'EMOM',
      description: 'Every Minute On the Minute (EMOM)',
      icon: FileClock,
    },
    {
      type: 'hiit',
      label: 'HIIT',
      description: 'High Intensity Interval Training (HIIT)',
      icon: Activity,
    },
  ]

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
