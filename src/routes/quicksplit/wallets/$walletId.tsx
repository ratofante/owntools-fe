import { createFileRoute } from '@tanstack/react-router'
import { useGetWallet } from '@/hooks/use-wallets'
import { useAuthStore } from '@/stores/auth-store'
import { useGetExpenses } from '@/hooks/use-expenses'
import { AppGoBackButton } from '@/components/app-go-back-button'
import { AddExpense } from '@/components/shared-wallets/add-expense'
import { ExpensesTable } from '@/components/shared-wallets/expenses-table'

export const Route = createFileRoute('/quicksplit/wallets/$walletId')({
  component: RouteComponent,
})

function RouteComponent() {
  const auth = useAuthStore()
  const { walletId } = Route.useParams()
  const { data: wallet, isLoading, isError } = useGetWallet(Number(walletId))
  const {
    data,
    isLoading: isExpensesLoading,
    isError: isExpensesError,
  } = useGetExpenses(Number(walletId))
  const expenses = data ?? []

  return (
    <div className="space-y-6">
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error loading wallet</div>}
      {wallet && (
        <div>
          <div className="flex items-center gap-4">
            <AppGoBackButton to="/quicksplit/dashboard" />
            <h2 className="section-title">{wallet.name}</h2>
            {auth.user && (
              <AddExpense
                className="ml-auto"
                userId={auth.user.id}
                wallet={wallet}
              />
            )}
          </div>

          <ExpensesTable expenses={expenses} isLoading={isExpensesLoading} />
        </div>
      )}
    </div>
  )
}
