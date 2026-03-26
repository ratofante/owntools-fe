import { z } from 'zod'
import { UserSchema } from './user'

const WalletUserSchema = UserSchema.extend({
  role: z.string(),
  status: z.string(),
})

export const WalletSchema = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  users: z.array(WalletUserSchema),
})

export type WalletUserType = z.infer<typeof WalletUserSchema>
export type WalletType = z.infer<typeof WalletSchema>
