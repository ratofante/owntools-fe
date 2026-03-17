import { z } from 'zod'

export const MuscleGroupSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  involvement_level: z.enum(['primary', 'secondary']).optional(),
})
export type MuscleGroupType = z.infer<typeof MuscleGroupSchema>
