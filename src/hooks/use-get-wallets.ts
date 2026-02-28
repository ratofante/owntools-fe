import { useQuery } from '@tanstack/react-query'
import type { Wallet } from '@/types/wallet'
import { apiFetch } from '@/lib/api-client'

export interface GetWalletsResponse {
  message: string
  wallets: Array<Wallet>
}

export const useGetWallets = () => {
  return useQuery({
    queryKey: ['wallets'],
    queryFn: () => getWallets(),
    staleTime: 1000 * 60 * 5,
  })
}

async function getWallets() {
  try {
    const response = await apiFetch(`/api/wallets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to get wallets')
    }

    const data = await response.json()
    return data as GetWalletsResponse
  } catch (error) {
    console.error('Error getting wallets: ', error)
    throw error
  }
}
