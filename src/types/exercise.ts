import { z } from 'zod'
import { BodyZoneSchema } from './body-zone'
import { MuscleGroupSchema } from './muscle-groups'

export const ExerciseSchema = z.object({
  id: z.number(),
  name: z.string().min(3).max(50),
  description: z.string().nullable(),
  videoUrl: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  bodyZones: z.array(BodyZoneSchema),
  muscleGroups: z.array(MuscleGroupSchema),
})
export type ExerciseType = z.infer<typeof ExerciseSchema>

export const CreateExerciseSchema = ExerciseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
export type CreateExerciseType = z.infer<typeof CreateExerciseSchema>

export const UpdateExerciseSchema = ExerciseSchema.omit({
  createdAt: true,
  updatedAt: true,
})
export type UpdateExerciseType = z.infer<typeof UpdateExerciseSchema>
