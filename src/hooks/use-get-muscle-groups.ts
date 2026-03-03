import { useQuery } from '@tanstack/react-query'
import type { MuscleGroup } from '@/types/muscle-groups'
import { apiFetch } from '@/lib/api-client'

export interface GetMuscleGroupsResponse {
  data: Array<MuscleGroup>
}

export const useGetMuscleGroups = () => {
  return useQuery({
    queryKey: ['muscle-groups'],
    queryFn: () => getMuscleGroups(),
    staleTime: 1000 * 60 * 5,
  })
}

async function getMuscleGroups() {
  try {
    const response = await apiFetch('/muscle-groups', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to get muscle groups')
    }

    const data = await response.json()
    return data as GetMuscleGroupsResponse
  } catch (error) {
    console.error('Error getting muscle groups: ', error)
    throw error
  }
}
