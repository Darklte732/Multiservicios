import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { hashPassword } from '@/lib/password'
import type { UserType } from '@/types'

export const runtime = 'nodejs'

const PENDING_APPROVAL_MESSAGE =
  'Cuenta creada. Esperando aprobación de Neno. Te avisaremos cuando esté lista.'

/**
 * Best-effort email notification to Neno when a new account is pending.
 * Non-fatal — we never block the register response on this. If RESEND_API_KEY
 * or NENO_EMAIL is missing, this is a silent no-op (same pattern as the
 * ElevenLabs webhook's notifyNeno helper).
 */
async function notifyNenoOfPendingAccount(args: {
  name: string
  phone: string
  email: string
  userType: UserType
}) {
  const resendKey = process.env.RESEND_API_KEY
  const nenoEmail = process.env.NENO_EMAIL
  if (!resendKey || !nenoEmail) return

  try {
    const resend = new Resend(resendKey)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://multiservicios.app'
    const adminUrl = `${appUrl}/admin`
    const roleLabel = args.userType === 'technician' ? 'Técnico' : args.userType === 'admin' ? 'Admin' : 'Cliente'

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; background: #0A0F1E; color: #ffffff; margin: 0; padding: 20px;">
  <div style="background: #1A2035; border: 1px solid #EAB308; border-radius: 12px; padding: 24px; max-width: 480px; margin: 0 auto;">
    <div style="background: #EAB308; color: #0A0F1E; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; display: inline-block; margin-bottom: 16px;">SOLICITUD DE CUENTA — MultiServicios</div>
    <div style="color: #EAB308; font-size: 20px; font-weight: bold; margin-bottom: 16px;">Una persona quiere registrarse, Neno</div>
    <div style="margin-bottom: 12px;"><div style="color: #9CA3AF; font-size: 12px; text-transform: uppercase;">Nombre</div><div style="color: #ffffff; font-size: 16px; font-weight: 600;">${args.name}</div></div>
    <div style="margin-bottom: 12px;"><div style="color: #9CA3AF; font-size: 12px; text-transform: uppercase;">Rol</div><div style="color: #ffffff; font-size: 16px; font-weight: 600;">${roleLabel}</div></div>
    ${args.phone ? `<div style="margin-bottom: 12px;"><div style="color: #9CA3AF; font-size: 12px; text-transform: uppercase;">Teléfono</div><div style="color: #ffffff; font-size: 16px; font-weight: 600;">${args.phone}</div></div>` : ''}
    <div style="margin-bottom: 16px;"><div style="color: #9CA3AF; font-size: 12px; text-transform: uppercase;">Correo</div><div style="color: #ffffff; font-size: 16px; font-weight: 600;">${args.email}</div></div>
    <a href="${adminUrl}" style="display: inline-block; margin-top: 8px; padding: 12px 24px; background: #EAB308; color: #0A0F1E; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">Revisar en /admin</a>
  </div>
</body>
</html>`

    await resend.emails.send({
      from: 'MultiServicios <ana@payment.legacycore.io>',
      to: [nenoEmail],
      subject: `🆕 Nueva solicitud de cuenta — ${args.name}`,
      text: `Nueva solicitud de cuenta pendiente de aprobación.\n\nNombre: ${args.name}\nRol: ${roleLabel}\nTeléfono: ${args.phone || '—'}\nCorreo: ${args.email}\n\nRevisar y aprobar/rechazar en: ${adminUrl}`,
      html,
    })
  } catch (err) {
    // Non-fatal — log only.
    console.warn('Auth register: notifyNenoOfPendingAccount failed', err)
  }
}

interface RegisterBody {
  identifier?: string
  userType?: UserType
  name?: string
  password?: string
}

function badRequest(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

function stripHash<T extends { password_hash?: string | null }>(user: T): Omit<T, 'password_hash'> {
  const { password_hash: _hash, ...rest } = user
  return rest
}

export async function POST(request: NextRequest) {
  let body: RegisterBody
  try {
    body = await request.json()
  } catch {
    return badRequest('Solicitud inválida')
  }

  const identifier = typeof body.identifier === 'string' ? body.identifier.trim() : ''
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const password = typeof body.password === 'string' ? body.password : ''
  const userType = body.userType

  if (!identifier || !name || !password || !userType) {
    return badRequest('Falta información para crear la cuenta')
  }
  if (userType !== 'customer' && userType !== 'technician' && userType !== 'admin') {
    return badRequest('Tipo de usuario inválido')
  }
  if (password.length < 8) {
    return badRequest('La contraseña debe tener al menos 8 caracteres')
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
    const phone = isEmail ? '' : identifier
    const email = isEmail
      ? identifier
      : userType === 'customer'
        ? `${identifier.replace(/\D/g, '')}@example.com`
        : `tech_${identifier.replace(/\D/g, '')}@example.com`

    // Check whether a user already exists by phone OR email.
    const orFilter = phone
      ? `email.eq.${email},phone.eq.${phone}`
      : `email.eq.${email}`

    const { data: existing, error: existingError } = await supabase
      .from('users')
      .select('id')
      .or(orFilter)
      .maybeSingle()

    if (existingError) {
      console.error('Auth register: existence check failed')
      return NextResponse.json(
        { error: 'No pudimos crear la cuenta ahora mismo. Intenta de nuevo en un momento.' },
        { status: 500 }
      )
    }
    if (existing) {
      return NextResponse.json(
        { error: 'Ya existe una cuenta con este teléfono o correo' },
        { status: 409 }
      )
    }

    const password_hash = await hashPassword(password)

    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        phone,
        name,
        user_type: userType,
        email,
        is_active: true,
        last_login: new Date().toISOString(),
        password_hash,
        // Manual approval gate — Neno must approve from /admin before this user can log in.
        approval_status: 'pending',
      })
      .select()
      .single()

    if (createError || !newUser) {
      console.error('Auth register: insert failed')
      return NextResponse.json(
        { error: 'No pudimos crear la cuenta ahora mismo. Intenta de nuevo en un momento.' },
        { status: 500 }
      )
    }

    if (userType === 'customer') {
      const { error: profileError } = await supabase.from('customer_profiles').insert({
        user_id: newUser.id,
        full_name: name,
        phone: phone || 'No phone provided',
        email,
        preferred_contact_method: 'whatsapp',
        property_type: 'casa',
      })
      if (profileError) {
        console.warn('Auth register: customer profile insert warning')
      }
    } else if (userType === 'technician') {
      const { error: profileError } = await supabase.from('electrician_profiles').insert({
        user_id: newUser.id,
        name,
        phone: phone || 'No phone provided',
        email,
        specialties: ['Reparaciones', 'Instalaciones'],
        service_area: 'El Seibo',
        hourly_rate: 1200.0,
        rating: 5.0,
        total_jobs: 0,
      })
      if (profileError) {
        console.warn('Auth register: electrician profile insert warning')
      }
    }

    const { data: completeUser, error: fetchError } = await supabase
      .from('users')
      .select(
        `
          *,
          customer_profile:customer_profiles(*),
          electrician_profile:electrician_profiles(*)
        `
      )
      .eq('id', newUser.id)
      .single()

    // Fire-and-forget: notify Neno that a new account is waiting for approval.
    // We deliberately don't `await` this — register should return as fast as
    // possible. Errors inside notifyNenoOfPendingAccount are already swallowed.
    void notifyNenoOfPendingAccount({
      name,
      phone,
      email,
      userType,
    })

    if (fetchError || !completeUser) {
      // The account exists; just return the bare user.
      return NextResponse.json(
        {
          user: stripHash(newUser),
          pending_approval: true,
          message: PENDING_APPROVAL_MESSAGE,
        },
        { status: 201 }
      )
    }

    return NextResponse.json(
      {
        user: stripHash(completeUser),
        pending_approval: true,
        message: PENDING_APPROVAL_MESSAGE,
      },
      { status: 201 }
    )
  } catch (err) {
    console.error('Auth register: unexpected error')
    return NextResponse.json(
      { error: 'No pudimos crear la cuenta ahora mismo. Intenta de nuevo en un momento.' },
      { status: 500 }
    )
  }
}
