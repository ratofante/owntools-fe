import { Activity, ClockFading, Dumbbell, FileClock } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { WorkoutBlockKind } from '@/types/workout-block'

export const workoutTypes = {
  standard: {
    type: 'standard',
    label: 'Standard',
    description: 'Sets of reps of a single exercise',
    icon: Dumbbell,
  },
  superset: {
    type: 'superset',
    label: 'Superset',
    description: 'Two or more exercises performed back-to-back with no rest',
    icon: Dumbbell,
  },
  circuit: {
    type: 'circuit',
    label: 'Circuit',
    description: 'Multiple exercises performed in sequence with minimal rest',
    icon: Activity,
  },
  amrap: {
    type: 'amrap',
    label: 'AMRAP',
    description: 'As Many Rounds As Possible within a time cap',
    icon: ClockFading,
  },
  emom: {
    type: 'emom',
    label: 'EMOM',
    description: 'Every Minute On the Minute',
    icon: FileClock,
  },
  hiit: {
    type: 'hiit',
    label: 'HIIT',
    description: 'High Intensity Interval Training',
    icon: Activity,
  },
} as Record<WorkoutBlockKind, {
  type: WorkoutBlockKind
  label: string
  description: string
  icon: LucideIcon
}>
