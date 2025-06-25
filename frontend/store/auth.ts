import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '@/lib/api'

interface User {
  id: number
  email: string
  username: string
  full_name?: string
  is_active: boolean
  created_at: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string, fullName?: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      login: async (email: string, password: string) => {
        try {
          const response = await api.post('/auth/login', {
            username: email, // FastAPI OAuth2 expects 'username'
            password,
          })
          
          const { access_token } = response.data
          api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
          
          // Get user info
          const userResponse = await api.get('/auth/me')
          
          set({
            token: access_token,
            user: userResponse.data,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (email: string, username: string, password: string, fullName?: string) => {
        try {
          const response = await api.post('/auth/register', {
            email,
            username,
            password,
            full_name: fullName,
          })
          
          // Auto-login after registration
          await get().login(email, password)
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        })
        delete api.defaults.headers.common['Authorization']
      },

      checkAuth: async () => {
        const { token } = get()
        if (!token) {
          set({ isLoading: false })
          return
        }

        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          const response = await api.get('/auth/me')
          set({
            user: response.data,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          })
          delete api.defaults.headers.common['Authorization']
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
) 