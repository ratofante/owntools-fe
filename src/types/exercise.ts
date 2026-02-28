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
})
export type Exercise = z.infer<typeof Exercise>
