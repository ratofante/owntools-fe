import { Link } from '@tanstack/react-router'

import {
  BellIcon,
  EyeIcon,
  PlusIcon,
  RefreshCwIcon,
  UserRound,
  UserStar,
} from 'lucide-react'
import { getWalletStatus, isOwner } from '@/lib/wallets-utils'
import { useGetWallets } from '@/hooks/use-wallets'
import { cn } from '@/lib/utils'
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
                    {isOwner(wallet, userId) ? (
                      <UserStar size={16} className="text-primary" />
                    ) : (
                      <UserRound size={16} className="text-secondary" />
                    )}
                    {wallet.name}
                  </div>
                </CardTitle>
                <CardDescription>Soon..</CardDescription>
                <CardAction>
                  {(() => {
                    const walletStatus = getWalletStatus(wallet, userId)
                    const statusConfig = {
                      pending: {
                        label: 'New',
                        icon: <BellIcon className="h-4 w-4" />,
                        variant: 'default',
                        className: '',
                      },
                      active: {
                        label: 'View',
                        icon: <EyeIcon className="h-4 w-4" />,
                        variant: 'outline',
                        className: '',
                      },
                      inactive: {
                        label: 'Re-activate',
                        icon: <RefreshCwIcon className="h-4 w-4" />,
                        variant: 'secondary',
                        className: '',
                      },
                    } as const
                    const config =
                      statusConfig[walletStatus as keyof typeof statusConfig]
                    return (
                      <Button
                        variant={config.variant}
                        asChild
                        className={config.className}
                      >
                        <Link
                          to="/quicksplit/wallets/$walletId"
                          params={{ walletId: String(wallet.id) }}
                        >
                          {config.icon}
                          {config.label}
                        </Link>
                      </Button>
                    )
                  })()}
                </CardAction>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
