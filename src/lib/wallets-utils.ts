import type { WalletType, WalletUserType } from '@/types'

export function isOwner(wallet: WalletType, userId: number) {
  return wallet.users.some(
    (user: WalletUserType) => user.id === userId && user.role === 'owner',
  )
}

export function getWalletStatus(wallet: WalletType, userId: number) {
  return wallet.users.find((user: WalletUserType) => user.id === userId)?.status
}
