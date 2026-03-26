import { createFileRoute } from '@tanstack/react-router'
import { useGetWallet } from '@/hooks/use-wallets'
import { AppGoBackButton } from '@/components/app-go-back-button'

export const Route = createFileRoute('/quicksplit/wallets/$walletId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { walletId } = Route.useParams()
  const { data: wallet, isLoading, isError } = useGetWallet(Number(walletId))
  return (
    <div className="space-y-6">
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error loading wallet</div>}
      {wallet && (
        <div>
          <div className="flex items-center gap-4">
            <AppGoBackButton to="/quicksplit/dashboard" />
            <h2 className="section-title">{wallet.name}</h2>
          </div>
        </div>
      )}
    </div>
  )
}
