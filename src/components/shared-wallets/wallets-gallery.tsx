import { Link } from '@tanstack/react-router'

import { EyeIcon, PlusIcon, UserRound, UserStar } from 'lucide-react'
import type { WalletType, WalletUserType } from '@/types'
import { useGetWallets } from '@/hooks/use-wallets'
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface WalletsGalleryProps {
  userId: number
}

export function WalletsGallery({ userId }: WalletsGalleryProps) {
  const { data: wallets, isLoading, isError } = useGetWallets()

  function isOwner(wallet: WalletType) {
    return wallet.users.some(
      (user: WalletUserType) => user.id === userId && user.role === 'owner',
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="section-title">Your Shared Wallets</h2>
        <Button variant="default" size="sm" className="ml-auto" asChild>
          <Link to="/quicksplit/create-shared-wallet">
            <PlusIcon className="h-4 w-4" />
            New Wallet
          </Link>
        </Button>
      </div>

      {isLoading && <div>Loading...</div>}
      {isError && <div>Error loading wallets</div>}
      {wallets && wallets.length > 0 && (
        <div>
          {wallets.map((wallet) => (
            <Card key={wallet.id} size="sm">
              <CardHeader>
                <CardTitle>
                  <div className="flex gap-1.5 items-center">
                    {isOwner(wallet) ? (
                      <UserStar size={16} className="text-primary" />
                    ) : (
                      <UserRound size={16} className="text-secondary" />
                    )}
                    {wallet.name}
                  </div>
                </CardTitle>
                <CardDescription>Soon..</CardDescription>
                <CardAction>
                  <Button variant="outline" asChild>
                    <Link to="/quicksplit/wallets/$walletId" params={{ walletId: String(wallet.id) }}>
                      <EyeIcon className="h-4 w-4" />
                      View
                    </Link>
                  </Button>
                </CardAction>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
