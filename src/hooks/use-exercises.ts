import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type {
  CreateExerciseType,
  ExerciseType,
  UpdateExerciseType,
} from '@/types/exercise'
import type { PaginationMetaType } from '@/types/pagination-meta'
import { apiFetch } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth-store'

export interface GetExercisesOptions {
  page: number
  limit: number
  search: string
  bodyZones: Array<string>
  muscleGroups: Array<string>
}

export interface GetExercisesResponse {
  meta: PaginationMetaType
  data: Array<ExerciseType>
}

export const useGetExercisesPaginated = (payload: GetExercisesOptions) => {
  return useQuery({
    queryKey: [
      'exercises-paginated',
      payload.page,
      payload.limit,
      payload.search,
      payload.bodyZones,
      payload.muscleGroups,
    ],
    queryFn: () => getExercisesPaginated(payload),
    staleTime: 1000 * 60 * 5,
  })
}

async function getExercisesPaginated(payload: GetExercisesOptions) {
  try {
    const response = await apiFetch(
      `/exercises/paginated?page=${payload.page}&limit=${payload.limit}&searchName=${payload.search}${payload.bodyZones.length ? `&bodyZones=${payload.bodyZones.join(',')}` : ''}${payload.muscleGroups.length ? `&muscleGroups=${payload.muscleGroups.join(',')}` : ''}`,
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
    console.error('Error getting expenses:', error)
    throw error
  }
}

export const useGetExercises = () => {
  return useQuery({
    queryKey: ['exercises'],
    queryFn: () => getExercises(),
    staleTime: Infinity,
  })
}

async function getExercises() {
  try {
    const response = await apiFetch('/exercises', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to get exercises')
    }

    const data = await response.json()
    return data as Array<ExerciseType>
  } catch (error) {
    console.error('Error getting exercises: ', error)
    throw error
  }
}

export const useCreateExercise = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateExerciseType) => createExercise(payload),
    onSuccess: async (data: ExerciseType) => {
      queryClient.setQueryData(
        ['exercises'],
        (old: Array<ExerciseType> = []) => [...old, data],
      )
      await queryClient.invalidateQueries({ queryKey: ['exercises-paginated'] })
    },
  })
}

async function createExercise(payload: CreateExerciseType) {
  try {
    const response = await apiFetch('/exercises', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${useAuthStore.getState().token}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error('Failed to create exercise')
    }

    const data = await response.json()
    return data as ExerciseType
  } catch (error) {
    console.error('Error creating exercise: ', error)
    throw error
  }
}

export const useUpdateExercise = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateExerciseType) => updateExercise(payload),
    onSuccess: async (data: ExerciseType) => {
      queryClient.setQueryData(['exercises'], (old: Array<ExerciseType> = []) =>
        old.map((e) => (e.id === data.id ? data : e)),
      )
      await queryClient.invalidateQueries({ queryKey: ['exercises-paginated'] })
    },
  })
}

async function updateExercise(payload: UpdateExerciseType) {
  try {
    const response = await apiFetch(`/exercises/${payload.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${useAuthStore.getState().token}`,
      },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      throw new Error('Failed to update exercise')
    }

    const data = await response.json()
    return data as ExerciseType
  } catch (error) {
    console.error('Error updating exercise: ', error)
    throw error
  }
}

export const useDeleteExercise = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteExercise(id),
    onSuccess: async (response: { message: string; data: ExerciseType }) => {
      console.log('deleted exercise: ', response.data)
      queryClient.setQueryData(['exercises'], (old: Array<ExerciseType> = []) =>
        old.filter((e) => e.id !== response.data.id),
      )
      await queryClient.invalidateQueries({ queryKey: ['exercises-paginated'] })
    },
  })
}

async function deleteExercise(id: number) {
  try {
    const response = await apiFetch(`/exercises/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${useAuthStore.getState().token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to delete exercise')
    }

    const data = await response.json()
    return data as { message: string; data: ExerciseType }
  } catch (error) {
    console.error('Error deleting exercise: ', error)
    throw error
  }
}
