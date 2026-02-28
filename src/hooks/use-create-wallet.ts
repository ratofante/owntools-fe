import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateWalletPayload, Wallet } from '@/types/wallet'
import { apiFetch } from '@/lib/api-client'

interface CreateWalletResponse {
  message: string
  wallet: Omit<Wallet, 'lastExpense' | 'expenseCount' | 'userWallets'>
}

export const useCreateWallet = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateWalletPayload) => {
      return createWallet(payload)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
      console.log('Wallet created: ', data)
    },
    onError: (error) => {
      console.error('Error creating wallet: ', error)
    },
  })
}

async function createWallet(payload: CreateWalletPayload) {
  try {
    const response = await apiFetch('/api/wallets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error('Failed to create wallet')
    }

    const data = await response.json()
    return data as CreateWalletResponse
  } catch (error) {
    console.error('Error creating wallet: ', error)
    throw error
  }
}
