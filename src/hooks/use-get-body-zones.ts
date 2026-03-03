import { useQuery } from '@tanstack/react-query'
import type { BodyZone } from '@/types/body-zone'
import { apiFetch } from '@/lib/api-client'

export interface GetBodyZonesResponse {
  data: Array<BodyZone>
}

export const useGetBodyZones = () => {
  return useQuery({
    queryKey: ['body-zones'],
    queryFn: () => getBodyZones(),
    staleTime: 1000 * 60 * 5,
  })
}

async function getBodyZones() {
  try {
    const response = await apiFetch('/body-zones', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to get body zones')
    }

    const data = await response.json()
    return data as GetBodyZonesResponse
  } catch (error) {
    console.error('Error getting body zones: ', error)
    throw error
  }
}
