import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, AuthStatus, UserType } from '@/types'

interface AuthState {
  user: User | null
  status: AuthStatus
  isLoading: boolean
  error: string | null
  lastLoginTime: number | null
  sessionTimeout: number
}

interface AuthActions {
  login: (phone: string, userType: UserType, name: string) => Promise<void>
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  checkSession: () => boolean
  refreshSession: () => void
  clearError: () => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      status: 'unauthenticated',
      isLoading: false,
      error: null,
      lastLoginTime: null,
      sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours in milliseconds

      // Actions
      login: async (phone: string, userType: UserType, name: string) => {
        set({ isLoading: true, status: 'loading' })
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Mock user creation with proper type mapping
          const user: User = {
            id: `user_${Date.now()}`,
            phone: phone,
            name: name,
            user_type: userType,
            email: userType === 'customer' ? `${phone.replace(/\D/g, '')}@example.com` : `tech_${phone.replace(/\D/g, '')}@multiservicios.com`,
            profile_picture: undefined,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }

          // Add electrician profile for technicians
          if (userType === 'technician') {
            user.electrician_profile = {
              id: `tech_${Date.now()}`,
              user_id: user.id,
              name: name,
              phone: phone,
              specializations: ['reparacion', 'instalacion'],
              rating: 4.8,
              completed_jobs: 23,
              hourly_rate: 800,
              is_available: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          } else {
            // Add customer profile for customers
            user.customer_profile = {
              id: `cust_${Date.now()}`,
              user_id: user.id,
              preferred_contact_method: 'whatsapp' as const,
              property_type: 'casa' as const,
              service_preferences: ['reparacion', 'instalacion'],
              payment_method_preferences: ['efectivo', 'transferencia'],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          }

          set({
            user,
            status: 'authenticated',
            isLoading: false,
            error: null,
            lastLoginTime: Date.now(),
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error de autenticación'
          set({
            user: null,
            status: 'unauthenticated',
            isLoading: false,
            error: errorMessage,
            lastLoginTime: null,
          })
          throw error
        }
      },

      logout: () => {
        set({
          user: null,
          status: 'unauthenticated',
          isLoading: false,
          error: null,
          lastLoginTime: null,
        })
      },

      updateProfile: (updates: Partial<User>) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              ...updates,
              updated_at: new Date().toISOString(),
            }
          })
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      setError: (error: string | null) => {
        set({ error })
      },

      clearError: () => {
        set({ error: null })
      },

      checkSession: () => {
        const state = get()
        if (!state.user || !state.lastLoginTime) {
          return false
        }

        const now = Date.now()
        const sessionAge = now - state.lastLoginTime
        
        if (sessionAge > state.sessionTimeout) {
          // Session expired, logout
          state.logout()
          return false
        }

        return true
      },

      refreshSession: () => {
        const state = get()
        if (state.user && state.checkSession()) {
          set({ lastLoginTime: Date.now() })
        }
      },
    }),
    {
      name: 'multiservicios-auth',
      partialize: (state) => ({ 
        user: state.user, 
        status: state.status,
        lastLoginTime: state.lastLoginTime
      }),
    }
  )
) 