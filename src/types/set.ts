import { z } from 'zod'
import { ExerciseSchema } from './exercise'

export const TargetWeightUnitSchema = z.enum(['kg', 'lbs', 'cal'])
export type TargetWeightUnitType = z.infer<typeof TargetWeightUnitSchema>

export const SetSchema = z.object({
  id: z.number(),
  exerciseId: z.number(),
  description: z.string().nullable(),
  series: z.number(),
  repetitions: z.number().nullable(),
  timePerSeries: z.number().nullable(),
  rest: z.number().nullable(),
  percentage: z.number().nullable(),
  targetRpe: z.number().nullable(),
  targetWeightUnit: TargetWeightUnitSchema,
  targetWeightUnisexMax: z.number().nullable(),
  targetWeightUnisexMin: z.number().nullable(),
  targetWeightManMax: z.number().nullable(),
  targetWeightManMin: z.number().nullable(),
  targetWeightWomanMax: z.number().nullable(),
  targetWeightWomanMin: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  exercise: ExerciseSchema.nullable(),
  position: z.number(),
})
export type SetType = z.infer<typeof SetSchema>
