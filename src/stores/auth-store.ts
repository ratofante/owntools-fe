import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { UserType } from '@/types'

interface AuthStore {
  isAuthenticated: boolean
  user: UserType | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  getAuthHeader: () => Record<string, string> | undefined
}

const baseURL = import.meta.env.VITE_API_BASE_URL.toString()

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      login: async (email: string, password: string) => {
        const res = await fetch(`${baseURL}/session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        })

        if (!res.ok) {
          throw new Error('Login failed')
        }
        const data = await res.json()
        set({
          isAuthenticated: true,
          user: data.user as UserType,
          token: data.token.token,
        })
      },
      logout: () => {
        set({ isAuthenticated: false, user: null, token: null })
      },
      getAuthHeader: () => {
        const token = get().token

        if (!token) {
          return undefined
        }

        return {
          Authorization: `Bearer ${token}`,
        }
      },
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
