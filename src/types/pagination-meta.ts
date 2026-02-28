import { z } from 'zod'

export const PaginationMeta = z.object({
  total: z.number(),
  perPage: z.number(),
  currentPage: z.number(),
  lastPage: z.number(),
  firstPage: z.number(),
  lastPageUrl: z.string().nullable(),
  nextPageUrl: z.string().nullable(),
  previousPageUrl: z.string().nullable(),
})
export type PaginationMeta = z.infer<typeof PaginationMeta>
