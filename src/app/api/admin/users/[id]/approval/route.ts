import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '@/lib/require-admin'

export const runtime = 'nodejs'

interface ApprovalBody {
  status?: 'approved' | 'rejected'
  reason?: string
}

function stripHash<T extends { password_hash?: string | null }>(user: T): Omit<T, 'password_hash'> {
  const { password_hash: _hash, ...rest } = user
  return rest
}

/**
 * POST /api/admin/users/<id>/approval
 *
 * Body: { status: 'approved' | 'rejected', reason?: string }
 *
 * Marks an account as approved or rejected. Gated by `requireAdmin`.
 * The bearer-token check does not carry an admin identity, so `approved_by`
 * is left NULL for now.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = requireAdmin(request)
  if (denied) return denied

  const { id } = await params
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Falta el id del usuario' }, { status: 400 })
  }

  let body: ApprovalBody
  try {
    body = (await request.json()) as ApprovalBody
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 })
  }

  const status = body.status
  if (status !== 'approved' && status !== 'rejected') {
    return NextResponse.json(
      { error: 'status debe ser "approved" o "rejected"' },
      { status: 400 }
    )
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

  const now = new Date().toISOString()

  // Build the patch — clear the opposite-side audit fields so the row is
  // never simultaneously "approved" and "rejected".
  const patch =
    status === 'approved'
      ? {
          approval_status: 'approved' as const,
          approved_at: now,
          approved_by: null, // bearer-token check has no admin identity yet
          rejected_at: null,
          rejection_reason: null,
          updated_at: now,
        }
      : {
          approval_status: 'rejected' as const,
          rejected_at: now,
          rejection_reason: typeof body.reason === 'string' ? body.reason.trim() || null : null,
          approved_at: null,
          approved_by: null,
          updated_at: now,
        }

  const { data, error } = await supabase
    .from('users')
    .update(patch)
    .eq('id', id)
    .select()
    .single()

  if (error || !data) {
    console.error('[admin/users/:id/approval] update failed', error)
    return NextResponse.json(
      { error: 'No pudimos actualizar el estado de la cuenta.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ user: stripHash(data) }, { status: 200 })
}
