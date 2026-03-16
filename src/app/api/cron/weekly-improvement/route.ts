import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

export const maxDuration = 300 // 5 min — this job needs time

// ─── Helpers ──────────────────────────────────────────────────────────────────

function avg(nums: number[]): number {
  return nums.length ? nums.reduce((s, n) => s + n, 0) / nums.length : 0
}

function topFrequent(items: string[], limit = 5): string[] {
  const freq = items.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([item, count]) => `• ${item} (${count}x)`)
}

// ─── Fetch current prompt from ElevenLabs ─────────────────────────────────────

async function getCurrentPrompt(): Promise<string | null> {
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID
  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!agentId || !apiKey) return null

  const res = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${agentId}`, {
    headers: { 'xi-api-key': apiKey },
  })
  if (!res.ok) return null

  const data = await res.json()
  return data?.conversation_config?.agent?.prompt?.prompt || null
}

// ─── Apply prompt to ElevenLabs ───────────────────────────────────────────────

async function applyPromptToElevenLabs(newPrompt: string): Promise<boolean> {
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID
  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!agentId || !apiKey) return false

  const res = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${agentId}`, {
    method: 'PATCH',
    headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      conversation_config: { agent: { prompt: { prompt: newPrompt } } },
    }),
  })
  return res.ok
}

// ─── Main cron handler ────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  // Verify Vercel cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY
  if (!anthropicKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // ── 1. Fetch last 7 days of analyzed calls ────────────────────────────────
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  const { data: analyses, error: analysesError } = await supabase
    .from('ms_call_analysis')
    .select(`
      *,
      ms_leads (nombre, telefono, ubicacion, tipo_servicio, call_duration_secs, transcript)
    `)
    .gte('created_at', weekAgo.toISOString())
    .order('created_at', { ascending: false })

  if (analysesError) {
    return NextResponse.json({ error: analysesError.message }, { status: 500 })
  }

  const totalCalls = analyses?.length || 0

  // Skip if not enough data (require at least 3 calls to generate meaningful improvements)
  if (totalCalls < 3) {
    console.log(`[cron] Only ${totalCalls} calls this week — skipping improvement loop`)
    return NextResponse.json({ skipped: true, reason: `Only ${totalCalls} calls analyzed this week` })
  }

  // ── 2. Aggregate patterns ─────────────────────────────────────────────────
  const scores = {
    overall: avg(analyses!.filter(a => a.score_overall != null).map(a => a.score_overall)),
    info_capture: avg(analyses!.filter(a => a.score_info_capture != null).map(a => a.score_info_capture)),
    objection: avg(analyses!.filter(a => a.score_objection_handling != null).map(a => a.score_objection_handling)),
    tone: avg(analyses!.filter(a => a.score_tone != null).map(a => a.score_tone)),
    transfer: avg(analyses!.filter(a => a.score_warm_transfer != null).map(a => a.score_warm_transfer)),
  }

  const allMissed = analyses!.flatMap(a => a.missed_opportunities || [])
  const allObjections = analyses!.flatMap(a => a.objections_encountered || [])
  const allStrengths = analyses!.flatMap(a => a.strengths || [])
  const outcomeBreakdown = analyses!.reduce((acc, a) => {
    if (a.call_outcome) acc[a.call_outcome] = (acc[a.call_outcome] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const { data: leadsData } = await supabase
    .from('ms_leads')
    .select('call_duration_secs')
    .gte('created_at', weekAgo.toISOString())

  const totalLeads = (leadsData || []).length
  const leadsWithPhone = (leadsData || []).filter(l => l.call_duration_secs > 0).length
  const avgDuration = avg((leadsData || []).map(l => l.call_duration_secs))

  // ── 3. Get current prompt ─────────────────────────────────────────────────
  const currentPrompt = await getCurrentPrompt()
  if (!currentPrompt) {
    return NextResponse.json({ error: 'Could not fetch current ElevenLabs prompt' }, { status: 500 })
  }

  // ── 4. Ask Claude to generate improved prompt ─────────────────────────────
  const client = new Anthropic({ apiKey: anthropicKey })

  const analysisResponse = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 4096,
    thinking: { type: 'adaptive' },
    system: `Eres un experto en optimización de agentes de voz de IA para negocios de servicios en República Dominicana.
Tu trabajo es analizar el desempeño de "Ana", la asistente virtual de MultiServicios El Seibo (negocio de electricidad de Neno Báez), y generar una versión mejorada de su prompt.

REGLAS ABSOLUTAS:
- Mantén el contexto completo del negocio (servicios, zona, horarios, precios)
- No inventes información nueva sobre el negocio
- Preserva el tono dominicano/caribeño cálido y natural
- Mantén el flujo de precalificación → transferencia en caliente
- El prompt mejorado debe ser el prompt COMPLETO (no solo las secciones que cambias)
- Responde SIEMPRE con JSON válido en el formato especificado`,
    messages: [{
      role: 'user',
      content: `Aquí está el análisis de las últimas ${totalCalls} llamadas de Ana esta semana:

MÉTRICAS CLAVE:
- Llamadas totales: ${totalLeads}
- Score general promedio: ${scores.overall.toFixed(1)}/10
- Captura de información: ${scores.info_capture.toFixed(1)}/10
- Manejo de objeciones: ${scores.objection.toFixed(1)}/10
- Tono y estilo: ${scores.tone.toFixed(1)}/10
- Transferencia a Neno: ${scores.transfer.toFixed(1)}/10
- Duración promedio de llamada: ${Math.round(avgDuration)}s
- Resultados: ${JSON.stringify(outcomeBreakdown)}

OPORTUNIDADES PERDIDAS MÁS FRECUENTES:
${topFrequent(allMissed).join('\n') || 'Ninguna registrada'}

OBJECIONES MÁS COMUNES:
${topFrequent(allObjections).join('\n') || 'Ninguna registrada'}

FORTALEZAS DE ANA:
${topFrequent(allStrengths).join('\n') || 'Ninguna registrada'}

PROMPT ACTUAL DE ANA:
${currentPrompt}

Basándote en estos datos, genera:
1. Un análisis breve de qué está funcionando y qué no (máximo 3 párrafos)
2. El prompt completo mejorado para Ana, corrigiendo los puntos débiles identificados

Responde con este JSON exacto (sin markdown):
{
  "analysis_summary": "<resumen ejecutivo de 3 párrafos>",
  "changes_made": ["<lista de cambios específicos realizados>"],
  "improved_prompt": "<el prompt completo mejorado>"
}`
    }],
  })

  // Extract text from response (skip thinking blocks)
  const textContent = analysisResponse.content.find(b => b.type === 'text')
  if (!textContent || textContent.type !== 'text') {
    return NextResponse.json({ error: 'Claude returned no text content' }, { status: 500 })
  }

  let improvement: { analysis_summary: string; changes_made: string[]; improved_prompt: string }
  try {
    improvement = JSON.parse(textContent.text)
  } catch {
    return NextResponse.json({ error: 'Claude response was not valid JSON', raw: textContent.text }, { status: 500 })
  }

  // ── 5. Apply improved prompt to ElevenLabs ────────────────────────────────
  const applied = await applyPromptToElevenLabs(improvement.improved_prompt)

  // ── 6. Save version to Supabase ───────────────────────────────────────────
  const { data: lastVersion } = await supabase
    .from('ms_prompt_versions')
    .select('version')
    .order('version', { ascending: false })
    .limit(1)
    .single()

  const nextVersion = (lastVersion?.version || 0) + 1

  await supabase.from('ms_prompt_versions').insert({
    version: nextVersion,
    prompt_text: improvement.improved_prompt,
    change_summary: improvement.changes_made.join('; '),
    applied_by: 'cron:weekly-improvement',
    performance_before: scores,
  })

  // ── 7. Save weekly insights ───────────────────────────────────────────────
  const weekEnd = new Date()
  await supabase.from('ms_weekly_insights').insert({
    week_start: weekAgo.toISOString().split('T')[0],
    week_end: weekEnd.toISOString().split('T')[0],
    total_calls: totalLeads,
    calls_with_lead: leadsWithPhone,
    calls_transferred: outcomeBreakdown['transferred'] || 0,
    avg_score_overall: scores.overall,
    avg_score_info_capture: scores.info_capture,
    avg_score_objection: scores.objection,
    avg_call_duration_secs: avgDuration,
    top_objections: topFrequent(allObjections),
    top_missed_opportunities: topFrequent(allMissed),
    top_strengths: topFrequent(allStrengths),
    prompt_suggestions: improvement.analysis_summary,
    prompt_applied: applied,
    prompt_applied_at: applied ? new Date().toISOString() : null,
    new_prompt_snapshot: applied ? improvement.improved_prompt : null,
  })

  console.log(`[cron] Week improvement complete. Version ${nextVersion} applied: ${applied}`)

  return NextResponse.json({
    success: true,
    weekSummary: {
      totalCalls,
      scores,
      outcomeBreakdown,
    },
    promptVersion: nextVersion,
    promptApplied: applied,
    changesMade: improvement.changes_made,
    analysisSummary: improvement.analysis_summary,
  })
}
