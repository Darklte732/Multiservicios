import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

// ─── GET: Generate improvement suggestions ────────────────────────────────────

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Get last 20 analyzed calls
  const { data: analyses, error } = await supabase
    .from('ms_call_analysis')
    .select(`
      *,
      ms_leads (nombre, telefono, ubicacion, tipo_servicio, call_duration_secs, transcript)
    `)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!analyses || analyses.length === 0) {
    return NextResponse.json({ error: 'No hay suficientes llamadas analizadas aún.' }, { status: 400 })
  }

  // Aggregate patterns
  const avgScores = {
    overall: avg(analyses.map(a => a.score_overall).filter(Boolean)),
    info_capture: avg(analyses.map(a => a.score_info_capture).filter(Boolean)),
    objection: avg(analyses.map(a => a.score_objection_handling).filter(Boolean)),
    tone: avg(analyses.map(a => a.score_tone).filter(Boolean)),
    transfer: avg(analyses.map(a => a.score_warm_transfer).filter(Boolean)),
  }

  const allMissed = analyses.flatMap(a => a.missed_opportunities || [])
  const allObjections = analyses.flatMap(a => a.objections_encountered || [])
  const allStrengths = analyses.flatMap(a => a.strengths || [])

  // Get current prompt from latest version or hardcoded
  const { data: latestVersion } = await supabase
    .from('ms_prompt_versions')
    .select('prompt_text, version')
    .order('version', { ascending: false })
    .limit(1)
    .single()

  const anthropicKey = process.env.ANTHROPIC_API_KEY
  if (!anthropicKey) return NextResponse.json({ error: 'ANTHROPIC_API_KEY no configurado' }, { status: 500 })

  const client = new Anthropic({ apiKey: anthropicKey })

  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 2048,
    system: `Eres un experto en optimización de agentes de voz de IA para negocios de servicios en República Dominicana.
Analizas el desempeño de "Ana", la asistente de MultiServicios El Seibo, y sugieres mejoras concretas al prompt.`,
    messages: [{
      role: 'user',
      content: `Aquí está el análisis de las últimas ${analyses.length} llamadas de Ana:

PUNTUACIONES PROMEDIO:
- General: ${avgScores.overall}/10
- Captura de información: ${avgScores.info_capture}/10
- Manejo de objeciones: ${avgScores.objection}/10
- Tono y estilo: ${avgScores.tone}/10
- Transferencia a Neno: ${avgScores.transfer}/10

OPORTUNIDADES PERDIDAS MÁS FRECUENTES:
${topFrequent(allMissed, 5).join('\n')}

OBJECIONES MÁS COMUNES:
${topFrequent(allObjections, 5).join('\n')}

FORTALEZAS DE ANA:
${topFrequent(allStrengths, 5).join('\n')}

Basándote en estos datos, dame:
1. Un resumen ejecutivo de qué está fallando (2-3 párrafos)
2. Las 5 mejoras más importantes al prompt de Ana (específicas, accionables)
3. Secciones exactas del prompt que deberían actualizarse con el texto nuevo sugerido

Responde en español dominicano claro y directo.`
    }],
  })

  const suggestions = response.content[0].type === 'text' ? response.content[0].text : ''

  return NextResponse.json({
    avgScores,
    totalCallsAnalyzed: analyses.length,
    topMissedOpportunities: topFrequent(allMissed, 8),
    topObjections: topFrequent(allObjections, 8),
    topStrengths: topFrequent(allStrengths, 8),
    suggestions,
    currentVersion: latestVersion?.version || 0,
  })
}

// ─── POST: Apply prompt update to ElevenLabs ──────────────────────────────────

export async function POST(request: NextRequest) {
  const { newPrompt, changeSummary } = await request.json() as { newPrompt: string; changeSummary: string }

  if (!newPrompt || newPrompt.length < 100) {
    return NextResponse.json({ error: 'Prompt inválido o muy corto' }, { status: 400 })
  }

  const elevenLabsKey = process.env.ELEVENLABS_API_KEY
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID
  if (!elevenLabsKey || !agentId) {
    return NextResponse.json({ error: 'ElevenLabs no configurado' }, { status: 500 })
  }

  // Apply to ElevenLabs agent
  const patchRes = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${agentId}`, {
    method: 'PATCH',
    headers: { 'xi-api-key': elevenLabsKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      conversation_config: { agent: { prompt: { prompt: newPrompt } } }
    }),
  })

  if (!patchRes.ok) {
    const err = await patchRes.text()
    return NextResponse.json({ error: `ElevenLabs error: ${err}` }, { status: 500 })
  }

  // Save version to Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: lastVersion } = await supabase
    .from('ms_prompt_versions')
    .select('version')
    .order('version', { ascending: false })
    .limit(1)
    .single()

  const nextVersion = (lastVersion?.version || 0) + 1

  await supabase.from('ms_prompt_versions').insert({
    version: nextVersion,
    prompt_text: newPrompt,
    change_summary: changeSummary || 'Actualización manual',
    applied_by: 'admin',
  })

  return NextResponse.json({ success: true, version: nextVersion })
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function avg(nums: number[]): string {
  if (!nums.length) return 'N/A'
  return (nums.reduce((s, n) => s + n, 0) / nums.length).toFixed(1)
}

function topFrequent(items: string[], limit: number): string[] {
  const freq = items.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([item, count]) => `• ${item} (${count}x)`)
}
