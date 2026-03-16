import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

const ROLLING_WINDOW = 5        // Check last N calls
const SCORE_THRESHOLD = 6       // Heal if avg below this
const COOLDOWN_HOURS = 6        // Don't heal more than once per N hours

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
  return data?.conversation_config?.agent?.prompt?.prompt ?? null
}

// ─── Apply prompt to ElevenLabs ───────────────────────────────────────────────

async function applyPrompt(newPrompt: string): Promise<boolean> {
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

// ─── Main self-heal function (called after every call evaluation) ─────────────

export async function checkAndSelfHeal(currentConversationId: string): Promise<{
  triggered: boolean
  reason?: string
  newVersion?: number
  avgScore?: number
}> {
  const anthropicKey = process.env.ANTHROPIC_API_KEY
  if (!anthropicKey) return { triggered: false, reason: 'No ANTHROPIC_API_KEY' }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // ── 1. Cooldown check — don't heal twice within COOLDOWN_HOURS ────────────
  const cooldownCutoff = new Date()
  cooldownCutoff.setHours(cooldownCutoff.getHours() - COOLDOWN_HOURS)

  const { data: recentHeal } = await supabase
    .from('ms_prompt_versions')
    .select('created_at')
    .ilike('applied_by', 'self-heal%')
    .gte('created_at', cooldownCutoff.toISOString())
    .limit(1)
    .maybeSingle()

  if (recentHeal) {
    return { triggered: false, reason: `Cooldown active — last heal was within ${COOLDOWN_HOURS}h` }
  }

  // ── 2. Rolling window check — last N analyzed calls ───────────────────────
  const { data: recentAnalyses, error } = await supabase
    .from('ms_call_analysis')
    .select('score_overall, conversation_id, missed_opportunities, objections_encountered, improvement_suggestions, call_outcome')
    .order('created_at', { ascending: false })
    .limit(ROLLING_WINDOW)

  if (error || !recentAnalyses || recentAnalyses.length < ROLLING_WINDOW) {
    return { triggered: false, reason: `Not enough data yet (${recentAnalyses?.length ?? 0}/${ROLLING_WINDOW} calls)` }
  }

  const scores = recentAnalyses
    .map(a => a.score_overall)
    .filter((s): s is number => s != null)

  if (scores.length < ROLLING_WINDOW) {
    return { triggered: false, reason: 'Not all calls scored yet' }
  }

  const avgScore = scores.reduce((s, n) => s + n, 0) / scores.length

  if (avgScore >= SCORE_THRESHOLD) {
    return { triggered: false, reason: `Score OK (${avgScore.toFixed(1)} ≥ ${SCORE_THRESHOLD})`, avgScore }
  }

  console.log(`[self-heal] Triggered — rolling avg ${avgScore.toFixed(1)} < ${SCORE_THRESHOLD}`)

  // ── 3. Aggregate what's failing ───────────────────────────────────────────
  const allMissed = recentAnalyses.flatMap(a => a.missed_opportunities ?? [])
  const allObjections = recentAnalyses.flatMap(a => a.objections_encountered ?? [])
  const allSuggestions = recentAnalyses.flatMap(a => a.improvement_suggestions ?? [])
  const outcomes = recentAnalyses.map(a => a.call_outcome).filter(Boolean)

  // ── 4. Get current prompt ─────────────────────────────────────────────────
  const currentPrompt = await getCurrentPrompt()
  if (!currentPrompt) {
    return { triggered: false, reason: 'Could not fetch current ElevenLabs prompt' }
  }

  // ── 5. Ask Claude for a targeted fix ─────────────────────────────────────
  const client = new Anthropic({ apiKey: anthropicKey })

  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 4096,
    thinking: { type: 'adaptive' },
    system: `Eres un experto en optimización de agentes de voz de IA para MultiServicios El Seibo (negocio de electricidad en República Dominicana).
Ana es la asistente virtual de Neno Báez. Está fallando consistentemente y necesita una corrección inmediata y quirúrgica.

REGLAS:
- Mantén todo el contexto del negocio exactamente igual
- Haz cambios quirúrgicos: arregla lo que está roto, no reinventes todo
- Preserva el tono dominicano/caribeño cálido
- El prompt mejorado debe ser COMPLETO (no solo los cambios)
- Responde SOLO con JSON válido, sin markdown`,
    messages: [{
      role: 'user',
      content: `⚠️ AUTO-CORRECCIÓN URGENTE — Ana ha fallado en las últimas ${ROLLING_WINDOW} llamadas

PUNTUACIÓN PROMEDIO: ${avgScore.toFixed(1)}/10 (umbral: ${SCORE_THRESHOLD}/10)

RESULTADOS DE LAS LLAMADAS:
${outcomes.map(o => `• ${o}`).join('\n') || '• No registrados'}

OPORTUNIDADES PERDIDAS (más frecuentes):
${[...new Set(allMissed)].slice(0, 6).map(m => `• ${m}`).join('\n') || '• Ninguna'}

OBJECIONES NO MANEJADAS:
${[...new Set(allObjections)].slice(0, 6).map(o => `• ${o}`).join('\n') || '• Ninguna'}

SUGERENCIAS DE LAS EVALUACIONES:
${[...new Set(allSuggestions)].slice(0, 6).map(s => `• ${s}`).join('\n') || '• Ninguna'}

PROMPT ACTUAL:
${currentPrompt}

Haz una corrección quirúrgica para arreglar exactamente lo que está fallando.

Responde con este JSON exacto:
{
  "diagnosis": "<qué está fallando y por qué en 2-3 oraciones>",
  "changes": ["<lista exacta de cambios realizados>"],
  "fixed_prompt": "<prompt completo corregido>"
}`
    }],
  })

  const textBlock = response.content.find(b => b.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    return { triggered: true, reason: 'Claude returned no text', avgScore }
  }

  let fix: { diagnosis: string; changes: string[]; fixed_prompt: string }
  try {
    fix = JSON.parse(textBlock.text)
  } catch {
    console.error('[self-heal] Claude JSON parse failed:', textBlock.text.slice(0, 200))
    return { triggered: true, reason: 'Claude response parse failed', avgScore }
  }

  // ── 6. Apply the fix ──────────────────────────────────────────────────────
  const applied = await applyPrompt(fix.fixed_prompt)

  // ── 7. Save version ───────────────────────────────────────────────────────
  const { data: lastVersion } = await supabase
    .from('ms_prompt_versions')
    .select('version')
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle()

  const nextVersion = (lastVersion?.version ?? 0) + 1

  await supabase.from('ms_prompt_versions').insert({
    version: nextVersion,
    prompt_text: fix.fixed_prompt,
    change_summary: `🚨 Auto-corrección: ${fix.changes.slice(0, 2).join('; ')}`,
    applied_by: `self-heal (avg ${avgScore.toFixed(1)}/10 over last ${ROLLING_WINDOW} calls)`,
    performance_before: { avg_score: avgScore, window: ROLLING_WINDOW },
  })

  console.log(`[self-heal] Applied v${nextVersion} (avg was ${avgScore.toFixed(1)}): ${fix.diagnosis}`)

  return {
    triggered: true,
    reason: fix.diagnosis,
    newVersion: nextVersion,
    avgScore,
  }
}
