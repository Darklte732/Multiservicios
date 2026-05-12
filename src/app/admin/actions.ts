'use server'

import { headers } from 'next/headers'

/**
 * Server-only helper that calls the admin API routes with the bearer token
 * attached. The token lives in process.env on the server; it is never sent
 * to the client. Server actions return plain JSON so the client component
 * can stay UI-only.
 */
async function adminFetch(path: string, init?: RequestInit): Promise<Response> {
  const token = process.env.ADMIN_API_TOKEN
  if (!token) {
    throw new Error('ADMIN_API_TOKEN is not configured on the server')
  }
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000'
  const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')
  const url = `${proto}://${host}${path}`
  return fetch(url, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    cache: 'no-store',
  })
}

export async function fetchStats(): Promise<Record<string, unknown>> {
  const res = await adminFetch('/api/admin/stats')
  if (!res.ok) {
    return { error: `stats failed: ${res.status}` }
  }
  return res.json()
}

export async function fetchImprovement(): Promise<Record<string, unknown>> {
  const res = await adminFetch('/api/admin/improve-prompt')
  if (!res.ok) {
    return { error: `improvement failed: ${res.status}` }
  }
  return res.json()
}

export async function applyPromptAction(
  newPrompt: string,
  changeSummary: string,
): Promise<Record<string, unknown>> {
  if (!newPrompt || newPrompt.trim().length < 100) {
    return { error: 'Prompt inválido o muy corto' }
  }
  const res = await adminFetch('/api/admin/improve-prompt', {
    method: 'POST',
    body: JSON.stringify({ newPrompt: newPrompt.trim(), changeSummary }),
  })
  if (!res.ok) {
    const body = await res.text()
    return { error: `apply failed: ${res.status} ${body}` }
  }
  return res.json()
}
