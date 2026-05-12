import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { hashPassword, isLegacyHash, verifyPassword } from '@/lib/password'
import type { UserType } from '@/types'

export const runtime = 'nodejs'

interface LoginBody {
  identifier?: string
  userType?: UserType
  password?: string
}

function badRequest(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

function stripHash<T extends { password_hash?: string | null; approval_status?: string | null }>(
  user: T
): Omit<T, 'password_hash' | 'approval_status'> {
  const { password_hash: _hash, approval_status: _approval, ...rest } = user
  return rest
}

export async function POST(request: NextRequest) {
  let body: LoginBody
  try {
    body = await request.json()
  } catch {
    return badRequest('Solicitud inválida')
  }

  const identifier = typeof body.identifier === 'string' ? body.identifier.trim() : ''
  const userType = body.userType
  const password = typeof body.password === 'string' ? body.password : ''

  if (!identifier || !password || !userType) {
    return badRequest('Falta información para iniciar sesión')
  }
  if (userType !== 'customer' && userType !== 'technician' && userType !== 'admin') {
    return badRequest('Tipo de usuario inválido')
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey || serviceKey === 'YOUR_SUPABASE_SERVICE_ROLE_KEY') {
    return NextResponse.json(
      { error: 'El servicio de autenticación no está disponible en este momento.' },
      { status: 503 }
    )
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  try {
    const isEmail = identifier.includes('@')
    const lookupColumn = isEmail ? 'email' : 'phone'

    const { data: user, error: findError } = await supabase
      .from('users')
      .select(
        `
          *,
          customer_profile:customer_profiles(*),
          electrician_profile:electrician_profiles(*)
        `
      )
      .eq(lookupColumn, identifier)
      .maybeSingle()

    if (findError) {
      console.error('Auth login: user lookup failed')
      return NextResponse.json(
        { error: 'No pudimos verificar tu acceso ahora mismo. Intenta de nuevo en un momento.' },
        { status: 500 }
      )
    }

    if (!user) {
      // Distinct code so the store can choose to fall through to register.
      return NextResponse.json(
        { error: 'Usuario no encontrado', code: 'user_not_found' },
        { status: 404 }
      )
    }

    if (!user.password_hash) {
      return NextResponse.json(
        { error: 'Esta cuenta no tiene contraseña configurada' },
        { status: 401 }
      )
    }

    const ok = await verifyPassword(password, user.password_hash)
    if (!ok) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
    }

    // Account approval gate — block sign-in if Neno hasn't approved the account.
    // `undefined` is treated as 'approved' for backwards compatibility (pre-migration rows).
    const approvalStatus = (user as { approval_status?: string }).approval_status
    if (approvalStatus === 'pending') {
      return NextResponse.json(
        {
          error: 'pending_approval',
          message:
            'Tu cuenta está esperando aprobación de Neno. Te avisaremos cuando esté lista.',
        },
        { status: 403 }
      )
    }
    if (approvalStatus === 'rejected') {
      return NextResponse.json(
        {
          error: 'rejected',
          message:
            'Tu cuenta no fue aprobada. Si crees que es un error, contacta directamente a Neno.',
        },
        { status: 403 }
      )
    }

    // Auto-migrate legacy SHA-256 hashes to bcrypt now that we know the password.
    if (isLegacyHash(user.password_hash)) {
      try {
        const newHash = await hashPassword(password)
        const { error: rehashError } = await supabase
          .from('users')
          .update({
            password_hash: newHash,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id)
        if (rehashError) {
          // Non-fatal — the login itself succeeded. They'll re-migrate next time.
          console.warn('Auth login: legacy rehash update failed')
        }
      } catch {
        console.warn('Auth login: legacy rehash compute failed')
      }
    }

    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id)

    return NextResponse.json({ user: stripHash(user) }, { status: 200 })
  } catch (err) {
    console.error('Auth login: unexpected error')
    return NextResponse.json(
      { error: 'No pudimos verificar tu acceso ahora mismo. Intenta de nuevo en un momento.' },
      { status: 500 }
    )
  }
}
