import { z } from 'zod'

const SetExerciseInput = z.object({
  exerciseId: z.number(),
  repetitions: z.number().nullable(),
  percentage: z.number().nullable(),
  targetWeight: z.number().nullable(),
})

export const createRoutineValidator = z.object({
  name: z.string().min(1).max(255),
  createdBy: z.number().nullable(),
  workoutBlocks: z.array(
    z.discriminatedUnion('blockType', [
      z.object({
        blockType: z.literal('straight_set'),
        name: z.string().nullable(),
        workout: z.object({
          sets: z.number(),
          rest: z.number().nullable(),
          setExercise: SetExerciseInput,
        }),
      }),
      z.object({
        blockType: z.literal('timed_set'),
        name: z.string().nullable(),
        workout: z.object({
          type: z.enum(['amrap', 'chipper']),
          time: z.number(),
          setExercises: z.array(SetExerciseInput),
        }),
      }),
      z.object({
        blockType: z.literal('emom'),
        name: z.string().nullable(),
        workout: z.object({
          rounds: z.number().nullable(),
          intervals: z.array(
            z.object({
              duration: z.number(),
              setExercise: SetExerciseInput,
            }),
          ),
        }),
      }),
      z.object({
        blockType: z.literal('hiit'),
        name: z.string().nullable(),
        workout: z.object({
          rounds: z.number(),
          work: z.number(),
          rest: z.number(),
          setExercises: z.array(SetExerciseInput),
        }),
      }),
    ]),
  ),
})

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
