export interface Wallet {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  userWallets: Array<{
    role: string
    user: {
      id: string
      email: string
      profile: {
        username: string
      }
    }
  }>
  lastExpense?: {
    id: string
    amount: number
    description: string
    createdAt: string
  }
  expenseCount: string
}

export interface CreateWalletPayload {
  name: string
  description: string
  invites: Array<string>
}
