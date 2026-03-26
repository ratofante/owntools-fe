import { createFileRoute } from '@tanstack/react-router'
import { AppGoBackButton } from '@/components/app-go-back-button'
import { CreateSharedWallet } from '@/components/shared-wallets/create-shared-wallet'

export const Route = createFileRoute('/quicksplit/create-shared-wallet')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <AppGoBackButton to="/quicksplit/dashboard" />
        <h1 className="app-title">Create Shared Wallet</h1>
      </div>
      <CreateSharedWallet />
    </div>
  )
}
