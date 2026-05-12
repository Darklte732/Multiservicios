// Server component — runs only on the server, holds ADMIN_API_TOKEN, and
// hydrates the client UI with an initial snapshot. Client-side mutations
// (refresh, load improvement, apply prompt) go through server actions in
// ./actions.ts so the bearer token is never sent to the browser.

import AdminClient, { type AdminInitial } from './admin-client'
import { fetchStats, fetchPendingUsers, type PendingUser } from './actions'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function AdminPage() {
  let initial: AdminInitial = {
    stats: null,
    leads: [],
    versions: [],
    weeklyInsights: [],
    pendingUsers: [],
  }

  if (!process.env.ADMIN_API_TOKEN) {
    initial = {
      ...initial,
      error: 'ADMIN_API_TOKEN no está configurado. Define la variable en .env y reinicia el servidor.',
    }
    return <AdminClient initial={initial} />
  }

  try {
    const [statsData, pendingData] = await Promise.all([
      fetchStats() as Promise<{
        error?: string
        stats?: AdminInitial['stats']
        leads?: AdminInitial['leads']
        versions?: AdminInitial['versions']
        weeklyInsights?: AdminInitial['weeklyInsights']
      }>,
      fetchPendingUsers(),
    ])

    if (statsData?.error) {
      initial = { ...initial, error: String(statsData.error) }
    } else {
      initial = {
        ...initial,
        stats: statsData.stats ?? null,
        leads: statsData.leads ?? [],
        versions: statsData.versions ?? [],
        weeklyInsights: statsData.weeklyInsights ?? [],
      }
    }

    // Pending users are non-fatal — show the rest of the dashboard even if
    // this fetch failed (the error is logged on the server).
    const pendingUsers: PendingUser[] = pendingData?.users ?? []
    initial = { ...initial, pendingUsers }
  } catch (err) {
    initial = {
      ...initial,
      error: err instanceof Error ? err.message : 'Error al cargar los datos del admin.',
    }
  }

  return <AdminClient initial={initial} />
}
