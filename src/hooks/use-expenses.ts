import { useMutation, useQuery } from '@tanstack/react-query'
import type { CreateExpenseType, ExpenseType } from '@/types'
import { apiFetch } from '@/lib/api-client'

export const useGetExpenses = (walletId: number) => {
  return useQuery({
    queryKey: ['expenses', walletId],
    queryFn: () => getExpenses(walletId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

async function getExpenses(walletId: number) {
  try {
    const response = await apiFetch(`/wallets/${walletId}/expenses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) {
      throw new Error('Failed to get expenses')
    }
    const data = await response.json()
    return data as Array<ExpenseType>
  } catch (error) {
    console.error('Error getting expenses: ', error)
    throw error
  }
}

export const useAddExpense = (walletId: number) => {
  // const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateExpenseType) => addExpense(walletId, payload),
    onSuccess: (data: CreateExpenseType) => {
      console.log('added expense: ', data)
      // queryClient.invalidateQueries({ queryKey: ['wallet', walletId] })
    },
  })
}

async function addExpense(walletId: number, payload: CreateExpenseType) {
  try {
    const response = await apiFetch(`/wallets/${walletId}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      throw new Error('Failed to add expense')
    }
    const data = await response.json()
    return data as CreateExpenseType
  } catch (error) {
    console.error('Error adding expense: ', error)
    throw error
  }
}
