import { z } from 'zod'

const ExpenseShareSchema = z.object({
  user_id: z.number().int().positive(),
  share_amount_cents: z.number().int().positive(),
})

const BaseExpenseSchema = z.object({
  description: z.string().min(1).max(255),
  amount_cents: z.number().int().positive(),
})

export const ExpenseSchema = z.discriminatedUnion('split_type', [
  BaseExpenseSchema.extend({
    split_type: z.literal('equal'),
  }),
  BaseExpenseSchema.extend({
    split_type: z.literal('custom'),
    custom_shares: z.array(ExpenseShareSchema).min(1),
  }),
])

export type CreateExpenseType = z.infer<typeof ExpenseSchema>

const ExpenseUserSchema = z.object({
  id: z.number().int().positive(),
  fullName: z.string(),
  email: z.string().email(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

const ExpenseShareResponseSchema = z.object({
  id: z.number().int().positive(),
  expenseId: z.number().int().positive(),
  userId: z.number().int().positive(),
  shareAmountCents: z.number().int(),
  paidAmountCents: z.number().int(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  user: ExpenseUserSchema,
})

export const ExpenseSchemaResponse = z.object({
  id: z.number().int().positive(),
  walletId: z.number().int().positive(),
  paidByUserId: z.number().int().positive(),
  description: z.string(),
  amountCents: z.number().int(),
  splitType: z.string(),
  date: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  paidBy: ExpenseUserSchema,
  shares: z.array(ExpenseShareResponseSchema),
})

export type ExpenseType = z.infer<typeof ExpenseSchemaResponse>
export const Expense = ExpenseSchemaResponse
