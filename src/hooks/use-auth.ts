import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface AuthState {
  isAuthenticated: boolean
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  getAuthHeader: () => Record<string, string> | null
}

const baseURL = import.meta.env.VITE_API_BASE_URL.toString()

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      token: null,
      login: async (email: string, password: string) => {
        const res = await fetch(`${baseURL}/session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })

        if (!res.ok) {
          throw new Error('Failed to login')
        }

        const data = await res.json()
        set({
          isAuthenticated: true,
          token: data.token,
        })
      },
      logout: () => {
        set({
          isAuthenticated: false,
          token: null,
        })
      },
      getAuthHeader: () => {
        const token = get().token
        if (!token) return null
        return { Authorization: `Bearer ${token}` }
      },
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
