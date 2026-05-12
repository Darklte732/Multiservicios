import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'node:crypto'

/**
 * Server-only admin gate. Returns NextResponse with 401/500 if the request
 * is not authorized; returns null if authorized.
 *
 * Auth strategy: a `Bearer <ADMIN_API_TOKEN>` header. The token MUST be set
 * server-side only (never exposed via NEXT_PUBLIC_*). The /admin page is a
 * server component that injects the token when calling these routes
 * server-to-server. Public clients have no way to forge the header.
 *
 * Routes that use this MUST also set `export const runtime = 'nodejs'`
 * because `node:crypto` is not available on the edge runtime.
 */
export function requireAdmin(request: NextRequest): NextResponse | null {
  const token = process.env.ADMIN_API_TOKEN
  if (!token) {
    console.error('[admin-auth] ADMIN_API_TOKEN env var is not set — refusing access')
    return NextResponse.json({ error: 'Admin access not configured' }, { status: 500 })
  }
  const header = request.headers.get('authorization') ?? ''
  const expected = `Bearer ${token}`
  // timingSafeEqual needs equal lengths — short-circuit on length first
  if (header.length !== expected.length) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const ok = timingSafeEqual(Buffer.from(header), Buffer.from(expected))
    if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}
