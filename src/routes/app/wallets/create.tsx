import { createFileRoute } from '@tanstack/react-router'
import { AppGoBackButton } from '@/components/app-go-back-button'
import { WalletCreate } from '@/components/wallets/wallet-create'

export const Route = createFileRoute('/app/wallets/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <div className="flex items-center gap-4">
        <AppGoBackButton to="/app/dashboard" />
        <h1 className="app-title">Create Wallet</h1>
      </div>
      <div className="border bg-muted py-3 rounded-lg px-4">
        <WalletCreate />
      </div>
    </>
  )
}
