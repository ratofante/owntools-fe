import { z } from 'zod'
import { WorkoutBlockSchema } from './workout-block'

export const RoutineSchema = z.object({
  id: z.number(),
  name: z.string(),
  createdBy: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  workoutBlocks: z.array(WorkoutBlockSchema),
})
export type RoutineType = z.infer<typeof RoutineSchema>
