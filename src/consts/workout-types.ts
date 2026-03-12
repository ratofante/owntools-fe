import { Activity, ClockFading, Dumbbell, FileClock } from 'lucide-react'
import type { WorkoutType, WorkoutTypeOption } from '@/types/routine'

export const workoutTypes = {
  straight_set: {
    type: 'straight_set',
    label: 'Single',
    description: 'Sets of reps of a single exercise',
    icon: Dumbbell,
  },
  timed_set: {
    type: 'timed_set',
    label: 'Timed Set',
    description: 'A timed block of multiple exercises (AMRAP or Chipper)',
    icon: ClockFading,
  },
  emom: {
    type: 'emom',
    label: 'EMOM',
    description: 'Every Minute On the Minute (EMOM)',
    icon: FileClock,
  },
  hiit: {
    type: 'hiit',
    label: 'HIIT',
    description: 'High Intensity Interval Training (HIIT)',
    icon: Activity,
  },
} as Record<WorkoutType, WorkoutTypeOption>
