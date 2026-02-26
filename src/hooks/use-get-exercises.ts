import type { PaginationMetaData } from '@/types/pagination-meta-data'
import type { Exercise } from '@/types/exercise'
import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api-client'

export interface GetExercisesOptions {
  page: number
  limit: number
}

export interface GetExercisesResponse {
  meta: PaginationMetaData
  data: Exercise[]
}

export const useGetExercises = (options: GetExercisesOptions) => {
  return useQuery({
    queryKey: ['exercises', options.page, options.limit],
    queryFn: async () => getExercises(options),
    staleTime: 1000 * 60 * 5,
  })
}

async function getExercises(options: GetExercisesOptions) {
  try {
    const res = await apiFetch(
      `/exercises?page=${options.page}&limit=${options.limit}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (!res.ok) {
      throw new Error('Failed to fetch exercises')
    }

    const data = await res.json()
    return data as GetExercisesResponse
  } catch (error) {
    throw new Error('Failed to fetch exercises')
  }
}
