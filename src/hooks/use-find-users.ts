import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api-client'

export interface FindUsersResponse {
  message: string
  results: Array<{
    id: string
    email: string
    username: string
  }>
}

export const useFindUsers = (search?: string | null) => {
  return useQuery({
    queryKey: ['find-users', search],
    queryFn: () => findUsers(search ?? ''),
    enabled: !!search,
  })
}

async function findUsers(search: string) {
  try {
    const response = await apiFetch(`/api/users/search?input=${search}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to find users')
    }

    const data = await response.json()
    return data as FindUsersResponse
  } catch (error) {
    console.error('Error finding users: ', error)
    throw error
  }
}
