import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import { Resend } from 'resend'

// ─── Thresholds ───────────────────────────────────────────────────────────────

const ROLLING_WINDOW = 5

const LEVELS = {
  1: { min: 5,   max: 6,   cooldownHours: 4,  label: 'Parche quirúrgico'  },
  2: { min: 3.5, max: 5,   cooldownHours: 8,  label: 'Revisión de sección' },
  3: { min: 0,   max: 3.5, cooldownHours: 16, label: 'Reconstrucción total' },
} as const

type HealLevel = 1 | 2 | 3

// ─── ElevenLabs helpers ───────────────────────────────────────────────────────

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

// ─── Emergency alert to Neno ──────────────────────────────────────────────────

async function sendEmergencyAlert(avgScore: number, diagnosis: string, changes: string[]) {
  const resendKey = process.env.RESEND_API_KEY
  const nenoEmail = process.env.NENO_EMAIL
  if (!resendKey || !nenoEmail) return

  const resend = new Resend(resendKey)
  await resend.emails.send({
    from: 'Ana — MultiServicios <ana@payment.legacycore.io>',
    to: [nenoEmail],
    subject: `🚨 ALERTA CRÍTICA — Ana fue reconstruida (score ${avgScore.toFixed(1)}/10)`,
    html: `
<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  body { font-family: Arial, sans-serif; background: #0A0F1E; color: #fff; margin: 0; padding: 20px; }
  .card { background: #1A2035; border: 2px solid #EF4444; border-radius: 12px; padding: 24px; max-width: 520px; margin: 0 auto; }
  .badge { background: #EF4444; color: white; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; display: inline-block; margin-bottom: 16px; }
  .header { color: #EF4444; font-size: 20px; font-weight: bold; margin-bottom: 12px; }
  .score { font-size: 48px; font-weight: 900; color: #EF4444; text-align: center; margin: 16px 0; }
  .label { color: #9CA3AF; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
  .value { color: #fff; font-size: 14px; margin-bottom: 12px; }
  ul { margin: 0; padding-left: 18px; color: #D1D5DB; font-size: 13px; }
  li { margin-bottom: 4px; }
  .footer { color: #4B5563; font-size: 11px; margin-top: 20px; }
</style></head><body>
<div class="card">
  <div class="badge">🚨 NIVEL 3 — RECONSTRUCCIÓN TOTAL</div>
  <div class="header">Ana fue reconstruida automáticamente</div>
  <div class="score">${avgScore.toFixed(1)}/10</div>
  <div class="label">Diagnóstico</div>
  <div class="value">${diagnosis}</div>
  <div class="label">Cambios realizados</div>
  <ul>${changes.map(c => `<li>${c}</li>`).join('')}</ul>
  <div class="footer">El nuevo prompt ya fue aplicado automáticamente. Ana debería mejorar en las próximas llamadas. Si el problema persiste, revisa el panel de admin.</div>
</div></body></html>`,
    text: `ALERTA CRÍTICA: Ana fue reconstruida automáticamente.\n\nScore promedio: ${avgScore.toFixed(1)}/10\n\nDiagnóstico: ${diagnosis}\n\nCambios: ${changes.join(', ')}`,
  })
}

// ─── Per-level Claude prompt ───────────────────────────────────────────────────

function buildClaudePrompt(
  level: HealLevel,
  avgScore: number,
  currentPrompt: string,
  context: {
    missed: string[]
    objections: string[]
    suggestions: string[]
    outcomes: string[]
    weakScores: Record<string, number>
  }
): string {
  const contextBlock = `
PUNTUACIÓN PROMEDIO: ${avgScore.toFixed(1)}/10 — NIVEL ${level}: ${LEVELS[level].label}

DIMENSIONES MÁS DÉBILES:
${Object.entries(context.weakScores).map(([k, v]) => `• ${k}: ${v.toFixed(1)}/10`).join('\n')}

RESULTADOS RECIENTES:
${context.outcomes.map(o => `• ${o}`).join('\n') || '• No registrados'}

OPORTUNIDADES PERDIDAS:
${[...new Set(context.missed)].slice(0, 6).map(m => `• ${m}`).join('\n') || '• Ninguna'}

OBJECIONES NO MANEJADAS:
${[...new Set(context.objections)].slice(0, 6).map(o => `• ${o}`).join('\n') || '• Ninguna'}

SUGERENCIAS ACUMULADAS:
${[...new Set(context.suggestions)].slice(0, 6).map(s => `• ${s}`).join('\n') || '• Ninguna'}`

  const levelInstructions: Record<HealLevel, string> = {
    1: `NIVEL 1 — PARCHE QUIRÚRGICO:
Haz el mínimo cambio necesario para arreglar el problema específico.
- Identifica el UNO o DOS problemas más críticos
- Modifica SOLO esas secciones del prompt
- Todo lo demás permanece exactamente igual
- El parche debe ser invisible para el cliente — Ana sigue sonando igual`,

    2: `NIVEL 2 — REVISIÓN DE SECCIÓN:
Hay múltiples fallas. Reescribe completamente las secciones problemáticas.
- Identifica qué secciones están fallando (ej: manejo de objeciones, captura de datos, tono)
- Reescribe esas secciones de cero — versión mejorada, más completa
- El resto del prompt puede ser ajustado para coherencia
- Sé más explícito con instrucciones paso a paso en las áreas débiles`,

    3: `NIVEL 3 — RECONSTRUCCIÓN TOTAL:
Ana está en crisis. Reconstruye el prompt de cero preservando solo el conocimiento del negocio.
- El conocimiento del negocio (servicios, zona, horarios, Neno) se mantiene exacto
- El flujo de conversación, instrucciones, tono y manejo de objeciones se reescriben completamente
- Sé extremadamente específico y detallado — no dejes ambigüedad
- Agrega ejemplos concretos de cómo responder en las situaciones problemáticas
- Este es el prompt más completo y exhaustivo posible`,
  }

  return `${contextBlock}

PROMPT ACTUAL:
${currentPrompt}

${levelInstructions[level]}

Responde con este JSON exacto (sin markdown):
{
  "diagnosis": "<qué está fallando y por qué — máximo 3 oraciones>",
  "changes": ["<lista de cambios específicos realizados>"],
  "fixed_prompt": "<prompt completo corregido>"
}`
}

// ─── Main self-heal function ───────────────────────────────────────────────────

export async function checkAndSelfHeal(currentConversationId: string): Promise<{
  triggered: boolean
  level?: HealLevel
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

  // ── 1. Fetch last N scored calls ──────────────────────────────────────────
  const { data: recentAnalyses, error } = await supabase
    .from('ms_call_analysis')
    .select('score_overall, score_info_capture, score_objection_handling, score_warm_transfer, score_tone, conversation_id, missed_opportunities, objections_encountered, improvement_suggestions, call_outcome')
    .order('created_at', { ascending: false })
    .limit(ROLLING_WINDOW)

  if (error || !recentAnalyses || recentAnalyses.length < ROLLING_WINDOW) {
    return { triggered: false, reason: `Not enough data (${recentAnalyses?.length ?? 0}/${ROLLING_WINDOW})` }
  }

  const scores = recentAnalyses
    .map(a => a.score_overall)
    .filter((s): s is number => s != null)

  if (scores.length < ROLLING_WINDOW) {
    return { triggered: false, reason: 'Not all calls scored yet' }
  }

  const avgScore = scores.reduce((s, n) => s + n, 0) / scores.length

  // Determine which level (if any) is needed
  let level: HealLevel | null = null
  if (avgScore < LEVELS[3].max) level = 3
  else if (avgScore < LEVELS[2].max) level = 2
  else if (avgScore < LEVELS[1].max) level = 1

  if (!level) {
    return { triggered: false, reason: `Score OK (${avgScore.toFixed(1)} ≥ ${LEVELS[1].max})`, avgScore }
  }

  // ── 2. Cooldown check per level (each level has its own cooldown) ─────────
  const cooldown = LEVELS[level].cooldownHours
  const cooldownCutoff = new Date()
  cooldownCutoff.setHours(cooldownCutoff.getHours() - cooldown)

  const { data: recentHeal } = await supabase
    .from('ms_prompt_versions')
    .select('created_at, applied_by')
    .ilike('applied_by', `self-heal:level-${level}%`)
    .gte('created_at', cooldownCutoff.toISOString())
    .limit(1)
    .maybeSingle()

  if (recentHeal) {
    return { triggered: false, reason: `Level ${level} cooldown active (${cooldown}h)`, avgScore }
  }

  console.log(`[self-heal] Level ${level} triggered — avg ${avgScore.toFixed(1)}/10`)

  // ── 3. Build context for Claude ───────────────────────────────────────────
  const allMissed = recentAnalyses.flatMap(a => a.missed_opportunities ?? [])
  const allObjections = recentAnalyses.flatMap(a => a.objections_encountered ?? [])
  const allSuggestions = recentAnalyses.flatMap(a => a.improvement_suggestions ?? [])
  const outcomes = recentAnalyses.map(a => a.call_outcome).filter(Boolean)

  // Which dimensions are scoring lowest
  const dimScores = {
    'Captura de info': avg(recentAnalyses.map(a => a.score_info_capture).filter(isNum)),
    'Objeciones': avg(recentAnalyses.map(a => a.score_objection_handling).filter(isNum)),
    'Transferencia': avg(recentAnalyses.map(a => a.score_warm_transfer).filter(isNum)),
    'Tono': avg(recentAnalyses.map(a => a.score_tone).filter(isNum)),
  }
  const weakScores = Object.fromEntries(
    Object.entries(dimScores).filter(([, v]) => v < 7).sort((a, b) => a[1] - b[1])
  )

  // ── 4. Fetch current prompt ───────────────────────────────────────────────
  const currentPrompt = await getCurrentPrompt()
  if (!currentPrompt) {
    return { triggered: false, reason: 'Could not fetch ElevenLabs prompt', avgScore }
  }

  // ── 5. Ask Claude ─────────────────────────────────────────────────────────
  const client = new Anthropic({ apiKey: anthropicKey })

  const systemPrompt = level === 3
    ? `Eres un experto en agentes de voz de IA. Ana, la asistente virtual de MultiServicios El Seibo (negocio de electricidad de Neno Báez en República Dominicana), está en CRISIS CRÍTICA. Debes reconstruir su prompt de cero. REGLAS: preserva exactamente los datos del negocio (servicios, precios libres, zona 60km, horario L-S 8am-6pm, Neno Báez); reconstruye todo lo demás. Responde SOLO con JSON válido.`
    : `Eres un experto en optimización de agentes de voz de IA. Ana es la asistente virtual de MultiServicios El Seibo (electricidad, Neno Báez, República Dominicana). Está fallando en nivel ${level}. REGLAS: mantén el contexto del negocio exacto, tono dominicano/caribeño cálido, flujo de precalificación → transferencia. Responde SOLO con JSON válido.`

  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: level === 3 ? 6000 : level === 2 ? 4096 : 2048,
    thinking: { type: 'adaptive' },
    system: systemPrompt,
    messages: [{
      role: 'user',
      content: buildClaudePrompt(level, avgScore, currentPrompt, {
        missed: allMissed,
        objections: allObjections,
        suggestions: allSuggestions,
        outcomes,
        weakScores,
      }),
    }],
  })

  const textBlock = response.content.find(b => b.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    return { triggered: true, reason: 'Claude returned no text', avgScore, level }
  }

  let fix: { diagnosis: string; changes: string[]; fixed_prompt: string }
  try {
    fix = JSON.parse(textBlock.text)
  } catch {
    console.error('[self-heal] Claude JSON parse failed:', textBlock.text.slice(0, 300))
    return { triggered: true, reason: 'Claude JSON parse failed', avgScore, level }
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
  const levelLabel = LEVELS[level].label

  await supabase.from('ms_prompt_versions').insert({
    version: nextVersion,
    prompt_text: fix.fixed_prompt,
    change_summary: `🚨 Nivel ${level} — ${levelLabel}: ${fix.changes.slice(0, 2).join('; ')}`,
    applied_by: `self-heal:level-${level} (avg ${avgScore.toFixed(1)}/10)`,
    performance_before: { avg_score: avgScore, level, weak_dimensions: weakScores },
  })

  // ── 8. Level 3: alert Neno ────────────────────────────────────────────────
  if (level === 3) {
    try {
      await sendEmergencyAlert(avgScore, fix.diagnosis, fix.changes)
    } catch (emailErr) {
      console.error('[self-heal] Emergency email failed (non-fatal):', emailErr)
    }
  }

  console.log(`[self-heal] L${level} applied v${nextVersion} (avg ${avgScore.toFixed(1)}): ${fix.diagnosis}`)

  return {
    triggered: true,
    level,
    reason: fix.diagnosis,
    newVersion: nextVersion,
    avgScore,
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function avg(nums: number[]): number {
  return nums.length ? nums.reduce((s, n) => s + n, 0) / nums.length : 0
}

function isNum(v: unknown): v is number {
  return typeof v === 'number' && !isNaN(v)
}
