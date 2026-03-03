import { z } from 'zod'

export const BodyZone = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  hexColor: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type BodyZone = z.infer<typeof BodyZone>
