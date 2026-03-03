import { useQuery } from '@tanstack/react-query'
import type { Exercise } from '@/types/exercise'
import type { PaginationMeta } from '@/types/pagination-meta'
import { apiFetch } from '@/lib/api-client'

export interface GetExercisesOptions {
  page: number
  limit: number
  search: string
  bodyZones: Array<string>
  muscleGroups: Array<string>
}

export interface GetExercisesResponse {
  meta: PaginationMeta
  data: Array<Exercise>
}

export const useGetExercises = (payload: GetExercisesOptions) => {
  return useQuery({
    queryKey: [
      'expenses',
      payload.page,
      payload.limit,
      payload.search,
      payload.bodyZones,
      payload.muscleGroups,
    ],
    queryFn: () => getExercises(payload),
    staleTime: 1000 * 60 * 5,
  })
}

async function getExercises(payload: GetExercisesOptions) {
  try {
    const response = await apiFetch(
      `/exercises?page=${payload.page}&limit=${payload.limit}&searchName=${payload.search}${payload.bodyZones.length ? `&bodyZones=${payload.bodyZones.join(',')}` : ''}${payload.muscleGroups.length ? `&muscleGroups=${payload.muscleGroups.join(',')}` : ''}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (!response.ok) {
      throw new Error('Failed to get expenses')
    }

    const data = await response.json()
    return data as GetExercisesResponse
  } catch (error) {
    console.error('Error getting expenses: ', error)
    throw error
  }
}
