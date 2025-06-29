import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'
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
  login: (identifier: string, userType: UserType, name: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  checkSession: () => boolean
  refreshSession: () => void
  clearError: () => void
  resetTestUser: (identifier: string, userType: UserType, name: string, password: string) => Promise<void>
}

type AuthStore = AuthState & AuthActions

// Simple password hashing function (in production, use bcrypt or similar)
const hashPassword = async (password: string): Promise<string> => {
  // For demo purposes - in production use proper bcrypt hashing
  const encoder = new TextEncoder()
  const data = encoder.encode(password + 'multiservicios_salt_2024')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Verify password function
const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const inputHash = await hashPassword(password)
  return inputHash === hashedPassword
}

// Generate a proper UUID instead of custom format
const generateId = () => {
  return crypto.randomUUID()
}

// Check if we're in development mode
const isDevelopment = () => {
  return process.env.NODE_ENV === 'development'
}

// Mock database operations for fallback when Supabase isn't available
const mockCreateUser = (identifier: string, userType: UserType, name: string, hashedPassword: string): User => {
  const now = new Date().toISOString()
  const id = generateId()
  
  // Determine if identifier is email or phone
  const isEmail = identifier.includes('@')
  const phone = isEmail ? '' : identifier
  const email = isEmail ? identifier : (userType === 'customer' 
    ? `${identifier.replace(/\D/g, '')}@example.com` 
    : `tech_${identifier.replace(/\D/g, '')}@multiservicios.com`)
  
  return {
    id,
    phone,
    name,
    user_type: userType,
    email,
    is_active: true,
    created_at: now,
    updated_at: now,
    // Store hashed password (in real app this would be in a separate secure table)
    password_hash: hashedPassword,
    ...(userType === 'customer' ? {
      customer_profile: {
        id: generateId(),
        user_id: id,
        preferred_contact_method: 'whatsapp' as const,
        property_type: 'casa' as const,
        service_preferences: [],
        payment_method_preferences: [],
        created_at: now,
        updated_at: now
      }
    } : {
      electrician_profile: {
        id: generateId(),
        user_id: id,
        name,
        phone,
        specializations: ['reparacion', 'instalacion'] as const,
        rating: 5.0,
        completed_jobs: 0,
        hourly_rate: 1200,
        is_available: true,
        certifications: [],
        created_at: now,
        updated_at: now
      }
    })
  }
}

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
      login: async (identifier: string, userType: UserType, name: string, password: string) => {
        set({ isLoading: true, status: 'loading', error: null })
        
        try {
          // Determine if identifier is email or phone
          const isEmail = identifier.includes('@')
          
          // First, try to find existing user by phone or email
          let existingUser = null
          let findError = null
          let isUserExistsCheck = false
          
          if (isEmail) {
            const { data, error } = await supabase
              .from('users')
              .select(`
                *,
                customer_profile:customer_profiles(*),
                electrician_profile:electrician_profiles(*)
              `)
              .eq('email', identifier)
              .maybeSingle()
            
            existingUser = data
            findError = error
            isUserExistsCheck = true
          } else {
            const { data, error } = await supabase
              .from('users')
              .select(`
                *,
                customer_profile:customer_profiles(*),
                electrician_profile:electrician_profiles(*)
              `)
              .eq('phone', identifier)
              .maybeSingle()
            
            existingUser = data
            findError = error
            isUserExistsCheck = true
          }

          if (existingUser && !findError) {
            // User exists - verify password
            const passwordMatch = await verifyPassword(password, existingUser.password_hash)
            if (!passwordMatch) {
              // In development, provide more helpful error messages
              if (isDevelopment()) {
                console.warn(`Development Mode: Password mismatch for user ${identifier}`)
                console.warn('If this is test data, you can use the resetTestUser function to update the password')
                set({
                  isLoading: false,
                  status: 'unauthenticated',
                  error: `Contraseña incorrecta para usuario existente. ${isDevelopment() ? 'En modo desarrollo, usa una contraseña diferente o resetea el usuario.' : ''}`
                })
              } else {
                set({
                  isLoading: false,
                  status: 'unauthenticated',
                  error: 'Contraseña incorrecta'
                })
              }
              throw new Error('Invalid password')
            }

            // Password correct - update last login and authenticate
            await supabase
              .from('users')
              .update({ last_login: new Date().toISOString() })
              .eq('id', existingUser.id)

            set({
              user: existingUser,
              status: 'authenticated',
              isLoading: false,
              error: null,
              lastLoginTime: Date.now(),
            })
            return
          }

          // Check for database errors during user lookup
          if (findError && isUserExistsCheck) {
            console.error('Database error during user lookup:', findError)
            // This is a system error - fall back to mock auth
            throw new Error(`Database error: ${findError.message}`)
          }

          // User not found - create new user (registration flow)
          const phone = isEmail ? '' : identifier
          const email = isEmail ? identifier : (userType === 'customer' 
            ? `${identifier.replace(/\D/g, '')}@example.com` 
            : `tech_${identifier.replace(/\D/g, '')}@multiservicios.com`)

          // Hash password
          const hashedPassword = await hashPassword(password)

          // Create user
          const { data: newUser, error: createUserError } = await supabase
            .from('users')
            .insert({
              phone,
              name,
              user_type: userType,
              email,
              is_active: true,
              last_login: new Date().toISOString(),
              password_hash: hashedPassword
            })
            .select()
            .single()

          if (createUserError) {
            throw new Error(`Error creating user: ${createUserError.message}`)
          }

          // Create corresponding profile
          if (userType === 'customer') {
            const { error: profileError } = await supabase
              .from('customer_profiles')
              .insert({
                user_id: newUser.id,
                full_name: name,
                phone: phone || 'No phone provided',
                email,
                preferred_contact_method: 'whatsapp',
                property_type: 'casa'
              })

            if (profileError) {
              console.warn('Error creating customer profile:', profileError.message)
            }
          } else if (userType === 'technician') {
            const { error: profileError } = await supabase
              .from('electrician_profiles')
              .insert({
                user_id: newUser.id,
                name,
                phone: phone || 'No phone provided',
                email,
                specialties: ['Reparaciones', 'Instalaciones'],
                service_area: 'El Seibo',
                hourly_rate: 1200.00,
                rating: 5.0,
                total_jobs: 0
              })

            if (profileError) {
              console.warn('Error creating electrician profile:', profileError.message)
            }
          }

          // Fetch the complete user with profiles
          const { data: completeUser, error: fetchError } = await supabase
            .from('users')
            .select(`
              *,
              customer_profile:customer_profiles(*),
              electrician_profile:electrician_profiles(*)
            `)
            .eq('id', newUser.id)
            .single()

          if (fetchError) {
            throw new Error(`Error fetching complete user: ${fetchError.message}`)
          }
          
          set({
            user: completeUser,
            status: 'authenticated',
            isLoading: false,
            error: null,
            lastLoginTime: Date.now(),
          })

        } catch (error: any) {
          console.error('Login error:', error)
          
          // Only use mock authentication for system/database errors, not user errors
          if (error.message === 'Invalid password') {
            // Don't fall back to mock auth for wrong passwords - this is a user error
            return
          }
          
          // For system errors, fallback to mock authentication
          console.log('Database system error, using fallback mock authentication')
          const user = mockCreateUser(identifier, userType, name, await hashPassword(password))
          
          set({
            user,
            status: 'authenticated',
            isLoading: false,
            error: null,
            lastLoginTime: Date.now(),
          })
        }
      },

      // Development helper function to reset test users
      resetTestUser: async (identifier: string, userType: UserType, name: string, password: string) => {
        if (!isDevelopment()) {
          console.warn('resetTestUser is only available in development mode')
          return
        }

        set({ isLoading: true, error: null })

        try {
          const isEmail = identifier.includes('@')
          const hashedPassword = await hashPassword(password)

          // Find existing user
          const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq(isEmail ? 'email' : 'phone', identifier)
            .maybeSingle()

          if (existingUser) {
            // Update existing user
            const { error: updateError } = await supabase
              .from('users')
              .update({
                name,
                user_type: userType,
                password_hash: hashedPassword,
                last_login: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .eq('id', existingUser.id)

            if (updateError) {
              throw new Error(`Error updating user: ${updateError.message}`)
            }

            console.log(`Development: Reset password for user ${identifier}`)
            
            // Now login with the new password
            await get().login(identifier, userType, name, password)
          } else {
            // User doesn't exist, create new one
            await get().login(identifier, userType, name, password)
          }

        } catch (error: any) {
          console.error('Reset test user error:', error)
          set({ 
            isLoading: false, 
            error: `Error resetting test user: ${error.message}` 
          })
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
        if (state.user) {
          set({ lastLoginTime: Date.now() })
        }
      },
    }),
    {
      name: 'multiservicios-auth',
      partialize: (state) => ({
        user: state.user,
        status: state.status,
        lastLoginTime: state.lastLoginTime,
      }),
    }
  )
) 