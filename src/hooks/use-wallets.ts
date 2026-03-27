import { useMutation, useQuery } from '@tanstack/react-query'
import type { CreateExpenseType, WalletType } from '@/types'
import { apiFetch } from '@/lib/api-client'

export const useGetWallets = () => {
  return useQuery({
    queryKey: ['wallets'],
    queryFn: () => getWallets(),
    staleTime: Infinity,
  })
}

async function getWallets() {
  try {
    const response = await apiFetch('/wallets', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to get wallets')
    }

    const data = await response.json()
    return data as Array<WalletType>
  } catch (error) {
    console.error('Error getting wallets: ', error)
    throw error
  }
}

export const useGetWallet = (id: number) => {
  return useQuery({
    queryKey: ['wallet', id],
    queryFn: () => getWallet(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

async function getWallet(id: number) {
  try {
    const response = await apiFetch(`/wallets/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) {
      throw new Error('Failed to get wallet')
    }
    const data = await response.json()
    return data as WalletType
  } catch (error) {
    console.error('Error getting wallet: ', error)
    throw error
  }
}
