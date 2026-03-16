import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Fetch all data in parallel
  const [leadsResult, analysisResult, versionsResult, weeklyResult] = await Promise.all([
    supabase
      .from('ms_leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100),
    supabase
      .from('ms_call_analysis')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100),
    supabase
      .from('ms_prompt_versions')
      .select('id, version, change_summary, applied_by, created_at, performance_before')
      .order('version', { ascending: false })
      .limit(20),
    supabase
      .from('ms_weekly_insights')
      .select('*')
      .order('week_start', { ascending: false })
      .limit(10),
  ])

  const leads = leadsResult.data ?? []
  const analyses = analysisResult.data ?? []
  const versions = versionsResult.data ?? []
  const weeklyInsights = weeklyResult.data ?? []

  // Build analysis map for quick lookup
  const analysisMap = new Map(analyses.map(a => [a.conversation_id, a]))

  // Compute stats
  const totalCalls = leads.length
  const leadsWithPhone = leads.filter(l => l.telefono).length
  const avgDuration = leads.length
    ? Math.round(leads.reduce((sum, l) => sum + (l.call_duration_secs || 0), 0) / leads.length)
    : 0

  const scoredCalls = analyses.filter(a => a.score_overall != null)
  const avgScore = scoredCalls.length
    ? (scoredCalls.reduce((sum, a) => sum + a.score_overall, 0) / scoredCalls.length).toFixed(1)
    : null

  const statusCounts = leads.reduce((acc, l) => {
    acc[l.status || 'nuevo'] = (acc[l.status || 'nuevo'] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Enrich leads with analysis
  const enrichedLeads = leads.map(l => ({
    ...l,
    analysis: analysisMap.get(l.conversation_id) || null,
  }))

  return NextResponse.json({
    stats: {
      totalCalls,
      leadsWithPhone,
      avgDurationSecs: avgDuration,
      avgScore,
      statusCounts,
      conversionRate: totalCalls ? ((leadsWithPhone / totalCalls) * 100).toFixed(1) : '0',
    },
    leads: enrichedLeads,
    versions,
    weeklyInsights,
  })
}
