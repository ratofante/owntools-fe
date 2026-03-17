import { MarsIcon, VenusIcon } from 'lucide-react'
import type { SetType } from '@/types/set'
import { cn, formatSecondsToTime, formatWeight } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

function hasWeightTarget(set: SetType) {
  return (
    set.targetWeightManMax ||
    set.targetWeightManMin ||
    set.targetWeightWomanMax ||
    set.targetWeightWomanMin ||
    set.targetWeightUnisexMax ||
    set.targetWeightUnisexMin
  )
}

export function SetExercise({ set }: { set: SetType }) {
  return (
    <div className="tracking-tight flex items-center gap-1">
      <div className="space-x-1 mr-2">
        <p className="text-sm font-medium inline">{set.exercise?.name}</p>
        {set.repetitions && set.repetitions > 0 && (
          <p className="text-sm text-muted-foreground inline">{`${set.series > 1 ? `${set.series}x` : ''} ${set.repetitions} reps`}</p>
        )}
      </div>

      {hasWeightTarget(set) && <TargetWeightBadge set={set} />}
      {set.percentage && <Badge variant="outline">{set.percentage}%</Badge>}
      {set.targetRpe && (
        <Badge variant="outline">
          {set.targetRpe}
          <span className="text-xs text-muted-foreground">RPE</span>
        </Badge>
      )}
      {set.timePerSeries && set.timePerSeries > 0 && (
        <p className="leading-none text-xs font-medium text-muted-foreground">
          Work for {formatSecondsToTime(set.timePerSeries)}
        </p>
      )}
      {set.rest != null && set.rest > 0 && (
        <p className="leading-none text-xs font-medium text-muted-foreground">
          Rest {formatSecondsToTime(set.rest)}
        </p>
      )}
    </div>
  )
}

function TargetWeightBadge({ set }: { set: SetType }) {
  const targets = [
    {
      min: set.targetWeightManMin,
      max: set.targetWeightManMax,
      className: 'bg-blue-100',
      icon: <MarsIcon className="size-3 inline" />,
    },
    {
      min: set.targetWeightWomanMin,
      max: set.targetWeightWomanMax,
      className: 'bg-green-100',
      icon: <VenusIcon className="size-3 inline" />,
    },
    {
      min: set.targetWeightUnisexMin,
      max: set.targetWeightUnisexMax,
      className: 'bg-yellow-100',
      icon: null,
    },
  ]

  return (
    <div className="flex items-center gap-1">
      {targets
        .filter(({ min, max }) => min && max)
        .map(({ min, max, className, icon }) => (
          <Badge
            key={className}
            variant="outline"
            className={cn(
              'flex items-center gap-1 px-1 py-2 w-fit rounded-xl text-xs text-muted-foreground',
              className,
            )}
          >
            {icon}
            <p className="leading-none">
              {formatWeight(min!)} | {formatWeight(max!, set.targetWeightUnit)}
            </p>
          </Badge>
        ))}
    </div>
  )
}
