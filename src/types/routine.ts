import { z } from 'zod'
import type React from 'react'
import type { Exercise } from './exercise'

export const workoutTypeEnum = z.enum([
  'straight_set',
  'timed_set',
  'emom',
  'hiit',
])
export type WorkoutType = z.infer<typeof workoutTypeEnum>

export const targetWeightUnitEnum = z.enum(['kg', 'lbs', 'cal'])
export type TargetWeightUnit = z.infer<typeof targetWeightUnitEnum>

export type WorkoutTypeOption = {
  type: WorkoutType
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

const SetExerciseInput = z.object({
  exerciseId: z.number(),
  repetitions: z.number().nullable(),
  percentage: z.number().nullable(),
  targetWeight: z.number().nullable(),
  targetWeightUnit: z.enum(['kg', 'lbs', 'cal']).nullable(),
})
export type SetExerciseInput = z.infer<typeof SetExerciseInput>

const workoutBlockBase = z.object({ name: z.string().nullable() })

export const straightSetBlockValidator = workoutBlockBase.extend({
  blockType: z.literal('straight_set'),
  workout: z.object({
    sets: z.number(),
    rest: z.number().nullable(),
    setExercise: SetExerciseInput,
  }),
})
export type StraightSetBlock = z.infer<typeof straightSetBlockValidator>

export const timedSetBlockValidator = workoutBlockBase.extend({
  blockType: z.literal('timed_set'),
  workout: z.object({
    type: z.enum(['amrap', 'chipper']),
    time: z.number(),
    setExercises: z.array(SetExerciseInput),
  }),
})
export type TimedSetBlock = z.infer<typeof timedSetBlockValidator>

export const emomBlockValidator = workoutBlockBase.extend({
  blockType: z.literal('emom'),
  workout: z.object({
    rounds: z.number().nullable(),
    intervals: z.array(
      z.object({
        duration: z.number(),
        setExercise: SetExerciseInput,
      }),
    ),
  }),
})
export type EmomBlock = z.infer<typeof emomBlockValidator>

export const hiitBlockValidator = workoutBlockBase.extend({
  blockType: z.literal('hiit'),
  workout: z.object({
    rounds: z.number(),
    work: z.number(),
    rest: z.number(),
    setExercises: z.array(SetExerciseInput),
  }),
})
export type HiitBlock = z.infer<typeof hiitBlockValidator>

export const workoutBlockValidator = z.discriminatedUnion('blockType', [
  straightSetBlockValidator,
  timedSetBlockValidator,
  emomBlockValidator,
  hiitBlockValidator,
])
export type WorkoutBlock = z.infer<typeof workoutBlockValidator>

// Draft types — used for local/UI state only. Replace exerciseId with the full
// Exercise object so components can display exercise info without extra lookups.
// When submitting to the API, map these back to WorkoutBlock (exercise → exerciseId).
export type SetExerciseDraft = Omit<SetExerciseInput, 'exerciseId'> & {
  exercise: Exercise
}

export type StraightSetBlockDraft = Omit<StraightSetBlock, 'workout'> & {
  workout: Omit<StraightSetBlock['workout'], 'setExercise'> & {
    setExercise: SetExerciseDraft
  }
}

export type TimedSetBlockDraft = Omit<TimedSetBlock, 'workout'> & {
  workout: Omit<TimedSetBlock['workout'], 'setExercises'> & {
    setExercises: Array<SetExerciseDraft>
  }
}

export type EmomBlockDraft = Omit<EmomBlock, 'workout'> & {
  workout: {
    rounds: EmomBlock['workout']['rounds']
    intervals: Array<{
      duration: number
      setExercise: SetExerciseDraft
    }>
  }
}

export type HiitBlockDraft = Omit<HiitBlock, 'workout'> & {
  workout: Omit<HiitBlock['workout'], 'setExercises'> & {
    setExercises: Array<SetExerciseDraft>
  }
}

export type WorkoutBlockDraft =
  | StraightSetBlockDraft
  | TimedSetBlockDraft
  | EmomBlockDraft
  | HiitBlockDraft

export const createRoutineValidator = z.object({
  name: z.string().min(1).max(255),
  createdBy: z.number().nullable(),
  workoutBlocks: z.array(workoutBlockValidator),
})

export type CreateRoutine = z.infer<typeof createRoutineValidator>

const testRoutine = {
  name: 'Monday Push Day',
  createdBy: 1,
  workoutBlocks: [
    {
      blockType: 'straight_set',
      name: 'Bench Press',
      workout: {
        sets: 4,
        rest: 90,
        setExercise: {
          exerciseId: 12,
          repetitions: 8,
          percentage: null,
          targetWeight: 100,
        },
      },
    },
    {
      blockType: 'timed_set',
      name: 'Metcon',
      workout: {
        type: 'amrap',
        time: 1200,
        setExercises: [
          {
            exerciseId: 5,
            repetitions: 10,
            percentage: null,
            targetWeight: null,
          },
          {
            exerciseId: 8,
            repetitions: 15,
            percentage: null,
            targetWeight: null,
          },
        ],
      },
    },
    {
      blockType: 'emom',
      name: 'EMOM 10',
      workout: {
        rounds: 10,
        intervals: [
          {
            duration: 60,
            setExercise: {
              exerciseId: 3,
              repetitions: 5,
              percentage: 75,
              targetWeight: null,
            },
          },
          {
            duration: 60,
            setExercise: {
              exerciseId: 9,
              repetitions: 12,
              percentage: null,
              targetWeight: null,
            },
          },
        ],
      },
    },
    {
      blockType: 'hiit',
      name: 'Tabata Finisher',
      workout: {
        rounds: 8,
        work: 20,
        rest: 10,
        setExercises: [
          {
            exerciseId: 7,
            repetitions: null,
            percentage: null,
            targetWeight: null,
          },
        ],
      },
    },
  ],
}
