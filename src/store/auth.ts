import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, AuthStatus, UserType } from '@/types'
import { db, supabase } from '@/lib/supabase'

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
          // Try to find existing user by phone
          let user: User | null = null
          
          try {
            user = await db.getUserByPhone(phone)
            console.log('Found existing user:', user)
          } catch (error) {
            // User doesn't exist, we'll create a new one
            console.log('User not found, creating new user')
          }

          if (!user) {
            // Create new user in database
            const email = userType === 'customer' 
              ? `${phone.replace(/\D/g, '')}@example.com` 
              : `tech_${phone.replace(/\D/g, '')}@multiservicios.com`

            // First create the user record
            const { data: newUser, error: userError } = await supabase
              .from('users')
              .insert({
                phone: phone,
                name: name,
                user_type: userType,
                email: email,
                address: null
              })
              .select()
              .single()
            
            if (userError) throw userError

            // Create corresponding profile
            if (userType === 'customer') {
              await supabase
                .from('customer_profiles')
                .insert({
                  user_id: newUser.id,
                  full_name: name,
                  phone: phone,
                  email: email,
                  address: null
                })
              
              await supabase
                .from('customers')
                .insert({
                  id: newUser.id,
                  name: name,
                  phone: phone,
                  address: 'Dirección por definir',
                  is_returning: false,
                  previous_jobs: 0,
                  payment_history: 'good'
                })
            } else {
              await supabase
                .from('electrician_profiles')
                .insert({
                  user_id: newUser.id,
                  name: name,
                  phone: phone,
                  email: email,
                  business_name: `Servicios ${name}`,
                  license_number: null,
                  specialties: ['Reparaciones', 'Instalaciones'],
                  service_area: 'Santo Domingo',
                  hourly_rate: 1200.00,
                  availability_status: 'available',
                  rating: 5.0,
                  total_jobs: 0
                })
            }

            // Fetch the complete user with profiles
            user = await db.getUser(newUser.id)
          }

          if (!user) {
            throw new Error('No se pudo crear o encontrar el usuario')
          }

          set({
            user,
            status: 'authenticated',
            isLoading: false,
            error: null,
            lastLoginTime: Date.now(),
          })
        } catch (error) {
          console.error('Login error:', error)
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