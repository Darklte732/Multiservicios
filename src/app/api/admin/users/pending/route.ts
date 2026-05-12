import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '@/lib/require-admin'

export const runtime = 'nodejs'

/**
 * GET /api/admin/users/pending
 *
 * Lists up to 100 users whose account is awaiting Neno's approval, newest
 * first. Gated by `requireAdmin` (bearer-token check against ADMIN_API_TOKEN).
 *
 * Returns ONLY safe columns — never `password_hash` and never sensitive
 * profile data. Used by the /admin queue.
 */
export async function GET(request: NextRequest) {
  const denied = requireAdmin(request)
  if (denied) return denied

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

  const { data, error } = await supabase
    .from('users')
    .select('id, name, phone, email, user_type, created_at')
    .eq('approval_status', 'pending')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('[admin/users/pending] query failed', error)
    return NextResponse.json(
      { error: 'No pudimos cargar las solicitudes pendientes.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ users: data ?? [] }, { status: 200 })
}
