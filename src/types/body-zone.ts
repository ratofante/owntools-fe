import { z } from 'zod'

export const BodyZoneSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  hexColor: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  zone_importance: z.enum(['primary', 'secondary']).optional(),
})
export type BodyZoneType = z.infer<typeof BodyZoneSchema>
