import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateExpenseType) => addExpense(walletId, payload),
    onSuccess: (data: CreateExpenseType) => {
      console.log('added expense: ', data)
      queryClient.invalidateQueries({ queryKey: ['expenses', walletId] })
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

export const useDeleteExpense = (walletId: number, expenseId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => deleteExpense(walletId, expenseId),
    onSuccess: async (response: { message: string; data: ExpenseType }) => {
      console.log('deleted expense: ', response.data)
      queryClient.setQueryData(
        ['expenses', walletId],
        (old: Array<ExpenseType> = []) =>
          old.filter((e) => e.id !== response.data.id),
      )
      await queryClient.invalidateQueries({ queryKey: ['expenses', walletId] })
    },
  })
}

async function deleteExpense(walletId: number, expenseId: number) {
  try {
    const response = await apiFetch(
      `/wallets/${walletId}/expenses/${expenseId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (!response.ok) {
      throw new Error('Failed to delete expense')
    }
    const data = await response.json()
    return { message: data.message, data: data.data as ExpenseType }
  } catch (error) {
    console.error('Error deleting expense: ', error)
    throw error
  }
}
