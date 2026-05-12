import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, AuthStatus, UserType } from '@/types'
import { capture, identify, reset as analyticsReset } from '@/lib/analytics'

/**
 * Send an identify + login event to PostHog after a successful auth.
 * Called from the login + register success branches in `login()`.
 */
function trackAuthSuccess(user: User, kind: 'login' | 'register') {
  identify(user.id, {
    name: user.name,
    user_type: user.user_type,
    // Don't send the raw phone — id is enough for distinct ID. Send the
    // last 4 as a low-PII property for support lookups if needed.
    phone_last4: user.phone ? user.phone.slice(-4) : undefined,
  })
  capture('auth_login_success', { kind, user_type: user.user_type })
}

interface AuthState {
  user: User | null
  status: AuthStatus
  isLoading: boolean
  error: string | null
  lastLoginTime: number | null
  sessionTimeout: number
  /**
   * True once Zustand has finished rehydrating from localStorage.
   * Components rendering an auth gate should wait for this before deciding
   * "unauthenticated" — otherwise an authenticated user sees a flash of
   * "Acceso Denegado" before the persisted state loads.
   */
  hasHydrated: boolean
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
  setHasHydrated: (v: boolean) => void
}

type AuthStore = AuthState & AuthActions

// Check if we're in development mode
const isDevelopment = () => {
  return process.env.NODE_ENV === 'development'
}

/**
 * Authentication is now server-side. Plaintext passwords go to
 * `/api/auth/{login,register}` over TLS; the server hashes with bcrypt (rounds=12)
 * and reads/writes the `users` table via the service-role key. The browser
 * never sees a password hash and never queries the `users` table directly for auth.
 *
 * UX preserved from the old flow: a single submit either logs in or registers.
 * The store calls `/api/auth/login`; if the server replies `404 user_not_found`,
 * it falls through to `/api/auth/register`.
 */

interface AuthApiResponse {
  user?: User
  error?: string
  code?: string
  message?: string
  pending_approval?: boolean
}

async function callAuthApi(path: string, body: Record<string, unknown>): Promise<{
  status: number
  data: AuthApiResponse
}> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  let data: AuthApiResponse = {}
  try {
    data = (await res.json()) as AuthApiResponse
  } catch {
    // Empty/non-JSON body — leave as {}.
  }
  return { status: res.status, data }
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
      hasHydrated: false,

      // Actions
      login: async (identifier: string, userType: UserType, name: string, password: string) => {
        set({ isLoading: true, status: 'loading', error: null })

        try {
          // Step 1: try to log in.
          const loginRes = await callAuthApi('/api/auth/login', {
            identifier,
            userType,
            password,
          })

          if (loginRes.status === 200 && loginRes.data.user) {
            set({
              user: loginRes.data.user,
              status: 'authenticated',
              isLoading: false,
              error: null,
              lastLoginTime: Date.now(),
            })
            trackAuthSuccess(loginRes.data.user, 'login')
            return
          }

          // Account approval gate — server returns 403 + a friendly Spanish
          // message when the account is pending or has been rejected. We
          // surface the message via `error` and keep status unauthenticated
          // (no new status value in the union — error string is the signal).
          if (
            loginRes.status === 403 &&
            (loginRes.data.error === 'pending_approval' || loginRes.data.error === 'rejected')
          ) {
            set({
              user: null,
              isLoading: false,
              status: 'unauthenticated',
              error:
                loginRes.data.message ||
                (loginRes.data.error === 'pending_approval'
                  ? 'Tu cuenta está esperando aprobación de Neno. Te avisaremos cuando esté lista.'
                  : 'Tu cuenta no fue aprobada. Si crees que es un error, contacta directamente a Neno.'),
              lastLoginTime: null,
            })
            return
          }

          // Step 2: if the user doesn't exist, register them with the same creds.
          if (loginRes.status === 404 && loginRes.data.code === 'user_not_found') {
            const registerRes = await callAuthApi('/api/auth/register', {
              identifier,
              userType,
              name,
              password,
            })

            // Register success — but the account is gated. Don't authenticate.
            // Surface the friendly message via `error` so the AuthModal can
            // render it as a "cuenta creada — esperando aprobación" notice.
            if (
              (registerRes.status === 200 || registerRes.status === 201) &&
              registerRes.data.pending_approval
            ) {
              set({
                user: null,
                isLoading: false,
                status: 'unauthenticated',
                error:
                  registerRes.data.message ||
                  'Cuenta creada. Esperando aprobación de Neno. Te avisaremos cuando esté lista.',
                lastLoginTime: null,
              })
              return
            }

            // Backwards-compat path: register succeeded without the gate (e.g.
            // pre-migration server). Authenticate as before.
            if ((registerRes.status === 200 || registerRes.status === 201) && registerRes.data.user) {
              set({
                user: registerRes.data.user,
                status: 'authenticated',
                isLoading: false,
                error: null,
                lastLoginTime: Date.now(),
              })
              trackAuthSuccess(registerRes.data.user, 'register')
              return
            }

            set({
              isLoading: false,
              status: 'unauthenticated',
              error:
                registerRes.data.error ||
                'No pudimos crear la cuenta ahora mismo. Intenta de nuevo en un momento.',
            })
            return
          }

          // Step 3: any other failure surfaces the server's friendly message.
          set({
            isLoading: false,
            status: 'unauthenticated',
            error:
              loginRes.data.message ||
              loginRes.data.error ||
              'No pudimos verificar tu acceso ahora mismo. Intenta de nuevo en un momento.',
          })
        } catch (error: unknown) {
          console.error('Login error:', error)
          // Always fail closed. Never authenticate on a system error.
          set({
            isLoading: false,
            status: 'unauthenticated',
            error: 'No pudimos verificar tu acceso ahora mismo. Intenta de nuevo en un momento.',
          })
        }
      },

      // Development helper function to reset test users.
      // Now just delegates to the regular login flow against the API routes.
      // If a legacy account exists with a forgotten password there's no longer a
      // client-side back-door — fix it in Supabase directly or wipe the row.
      resetTestUser: async (identifier: string, userType: UserType, name: string, password: string) => {
        if (!isDevelopment()) {
          console.warn('resetTestUser is only available in development mode')
          return
        }
        console.warn(
          'resetTestUser now delegates to the API. If you need to overwrite an existing password, update the row in Supabase directly.'
        )
        await get().login(identifier, userType, name, password)
      },

      logout: () => {
        capture('auth_logout')
        analyticsReset()
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

      setHasHydrated: (v: boolean) => set({ hasHydrated: v }),
    }),
    {
      name: 'multiservicios-auth',
      partialize: (state) => ({
        user: state.user,
        status: state.status,
        lastLoginTime: state.lastLoginTime,
      }),
      onRehydrateStorage: () => (state) => {
        // Mark the store as hydrated once persist has finished restoring.
        // Components gating on this avoid the "auth flash" where an
        // authenticated user briefly sees the Acceso Denegado panel while
        // localStorage is still loading.
        state?.setHasHydrated(true)
      },
    }
  )
)
