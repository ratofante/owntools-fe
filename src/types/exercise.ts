import { z } from 'zod'

export const Exercise = z.object({
  id: z.number(),
  createdBy: z.number().nullable(),
  name: z.string(),
  description: z.string().nullable(),
  videoUrl: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  user: z
    .object({
      id: z.number(),
      fullName: z.string(),
      email: z.string(),
    })
    .nullable(),
  bodyZones: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
      hexColor: z.string(),
      zone_importance: z.enum(['primary', 'secondary']),
    }),
  ),
  muscleGroups: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
      involvement_level: z.enum(['primary', 'secondary']),
    }),
  ),
})
export type Exercise = z.infer<typeof Exercise>
