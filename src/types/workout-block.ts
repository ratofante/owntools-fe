import { z } from 'zod'
import { SetSchema } from './set'

export const WorkoutBlockKindSchema = z.enum([
  'standard',
  'superset',
  'circuit',
  'amrap',
  'emom',
  'hiit',
])
export type WorkoutBlockKind = z.infer<typeof WorkoutBlockKindSchema>

export const WorkoutBlockSchema = z.object({
  id: z.number(),
  type: WorkoutBlockKindSchema,
  name: z.string().nullable(),
  description: z.string().nullable(),
  roundsPerWorkout: z.number().nullable(),
  workoutDuration: z.number().nullable(),
  timeToComplete: z.number().nullable(),
  restAfterRound: z.number().nullable(),
  restAfterWorkout: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  sets: z.array(SetSchema),
  position: z.number(),
})
export type WorkoutBlockType = z.infer<typeof WorkoutBlockSchema>
