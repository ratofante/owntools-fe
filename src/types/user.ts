import { z } from 'zod'

export const UserSchema = z.object({
  id: z.number(),
  email: z.string(),
  fullName: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type UserType = z.infer<typeof UserSchema>
