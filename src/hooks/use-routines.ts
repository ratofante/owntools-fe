import { useQuery } from '@tanstack/react-query'
import type { RoutineType } from '@/types/routine'
import { apiFetch } from '@/lib/api-client'

export const useGetRoutine = (id: number) => {
  return useQuery({
    queryKey: ['routine', id],
    queryFn: () => getRoutine(id),
    staleTime: Infinity, // 5 minutes
  })
}

async function getRoutine(id: number) {
  try {
    const res = await apiFetch(`/routines/${id}`)

    if (!res.ok) {
      throw new Error('Failed to get routine')
    }

    const data = await res.json()
    return data as RoutineType
  } catch (error) {
    console.error('Error getting routine: ', error)
    throw error
  }
}
