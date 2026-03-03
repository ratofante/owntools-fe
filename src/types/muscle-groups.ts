import { z } from 'zod'

export const MuscleGroup = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type MuscleGroup = z.infer<typeof MuscleGroup>
