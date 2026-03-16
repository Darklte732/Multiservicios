import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import Anthropic from '@anthropic-ai/sdk'

// ─── Types ────────────────────────────────────────────────────────────────────

interface TranscriptMessage {
  role: 'agent' | 'user'
  message: string
  time_in_call_secs: number
}

interface DataCollectionResult {
  value: string | boolean | null
  rationale?: string
}

interface ElevenLabsWebhookPayload {
  type: string
  event_timestamp: number
  data: {
    conversation_id: string
    agent_id: string
    status: string
    transcript: TranscriptMessage[]
    metadata: {
      start_time_unix_secs: number
      call_duration_secs: number
    }
    analysis?: {
      data_collection_results?: Record<string, DataCollectionResult>
    }
  }
}

interface LeadData {
  nombre: string | null
  telefono: string | null
  ubicacion: string | null
  tipo_servicio: string | null
  descripcion: string | null
}

interface CallAnalysis {
  score_info_capture: number
  score_objection_handling: number
  score_warm_transfer: number
  score_tone: number
  score_overall: number
  info_captured: { nombre: boolean; telefono: boolean; ubicacion: boolean; problema: boolean }
  objections_encountered: string[]
  objections_handled_well: boolean
  transfer_attempted: boolean
  transfer_succeeded: boolean
  missed_opportunities: string[]
  strengths: string[]
  improvement_suggestions: string[]
  call_outcome: string
}

// ─── Signature verification ───────────────────────────────────────────────────

async function verifySignature(request: NextRequest, rawBody: string): Promise<boolean> {
  const secret = process.env.ELEVENLABS_WEBHOOK_SECRET
  if (!secret) return true // Skip verification if no secret configured yet

  const signatureHeader = request.headers.get('ElevenLabs-Signature') ?? ''
  const parts = Object.fromEntries(signatureHeader.split(',').map(p => p.split('=')))
  const timestamp = parts['t']
  const signature = parts['v0']

  if (!timestamp || !signature) return false

  // Reject requests older than 5 minutes
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const mac = await crypto.subtle.sign('HMAC', key, encoder.encode(`${timestamp}.${rawBody}`))
  const expected = Array.from(new Uint8Array(mac)).map(b => b.toString(16).padStart(2, '0')).join('')
  return expected === signature
}

// ─── Lead extraction ──────────────────────────────────────────────────────────

function extractLeadFromDataCollection(
  results: Record<string, DataCollectionResult>
): LeadData {
  return {
    nombre: (results.nombre_cliente?.value as string) || null,
    telefono: (results.telefono_whatsapp?.value as string) || null,
    ubicacion: (results.ubicacion?.value as string) || null,
    tipo_servicio: (results.tipo_servicio?.value as string) || null,
    descripcion: (results.descripcion_problema?.value as string) || null,
  }
}

function extractLeadFromTranscript(transcript: TranscriptMessage[]): LeadData {
  const fullText = transcript.map(m => `${m.role}: ${m.message}`).join('\n')

  // Extract phone numbers (DR formats: 809/829/849-xxx-xxxx or +1809...)
  const phoneMatch = fullText.match(/(?:\+?1[-.\\s]?)?(?:809|829|849)[-.\\s]?\d{3}[-.\\s]?\d{4}/)
  // Extract names after common patterns Ana uses when confirming
  const nameMatch = fullText.match(/(?:tu nombre es|nombre es|llamo|me llamo|soy)\s+([A-ZÁ-Ú][a-záéíóú]+(?:\s+[A-ZÁ-Ú][a-záéíóú]+)?)/i)

  return {
    nombre: nameMatch?.[1] || null,
    telefono: phoneMatch?.[0] || null,
    ubicacion: null,
    tipo_servicio: null,
    descripcion: null,
  }
}

// ─── Claude AI call evaluation ────────────────────────────────────────────────

async function evaluateCallWithClaude(
  transcript: TranscriptMessage[],
  lead: LeadData,
  durationSecs: number
): Promise<CallAnalysis | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return null

  const transcriptText = transcript
    .map(m => `[${m.role.toUpperCase()}] ${m.message}`)
    .join('\n')

  const client = new Anthropic({ apiKey })

  const systemPrompt = `Eres un evaluador experto de agentes de voz de IA para MultiServicios El Seibo, un negocio de electricidad en República Dominicana.
Evalúas el desempeño de "Ana", la asistente virtual de Neno Báez (electricista).

El objetivo de Ana es:
1. Entender el problema eléctrico del cliente
2. Obtener: nombre, teléfono/WhatsApp, ubicación, tipo de servicio, descripción del problema
3. Manejar objeciones con confianza
4. Intentar hacer transferencia en caliente a Neno
5. Si Neno no contesta, terminar con cortesía prometiendo que Neno llama pronto

Responde ÚNICAMENTE con JSON válido (sin markdown, sin texto adicional).`

  const userPrompt = `Transcripción de llamada (${durationSecs}s):
${transcriptText}

Datos capturados:
- Nombre: ${lead.nombre || 'No capturado'}
- Teléfono: ${lead.telefono || 'No capturado'}
- Ubicación: ${lead.ubicacion || 'No capturado'}
- Tipo servicio: ${lead.tipo_servicio || 'No especificado'}
- Descripción: ${lead.descripcion || 'No especificado'}

Evalúa y responde con este JSON exacto:
{
  "score_info_capture": <0-10>,
  "score_objection_handling": <0-10, usa 5 si no hubo objeciones>,
  "score_warm_transfer": <0-10>,
  "score_tone": <0-10>,
  "score_overall": <0-10>,
  "info_captured": {"nombre": <bool>, "telefono": <bool>, "ubicacion": <bool>, "problema": <bool>},
  "objections_encountered": [<lista de objeciones que planteó el cliente>],
  "objections_handled_well": <bool>,
  "transfer_attempted": <bool>,
  "transfer_succeeded": <bool>,
  "missed_opportunities": [<cosas que Ana pudo haber dicho/hecho pero no hizo>],
  "strengths": [<cosas que Ana hizo bien en esta llamada>],
  "improvement_suggestions": [<sugerencias específicas para esta llamada>],
  "call_outcome": <"lead_captured" | "transferred" | "no_lead" | "hung_up">
}`

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const analysis = JSON.parse(text) as CallAnalysis
    return analysis
  } catch (err) {
    console.error('[webhook] Claude evaluation error:', err)
    return null
  }
}

// ─── Notification email to Neno ───────────────────────────────────────────────

async function notifyNeno(lead: LeadData, conversationId: string, durationSecs: number) {
  const resendKey = process.env.RESEND_API_KEY
  const nenoEmail = process.env.NENO_EMAIL
  if (!resendKey || !nenoEmail) return

  const resend = new Resend(resendKey)

  const durMin = Math.floor(durationSecs / 60)
  const durSec = durationSecs % 60

  const whatsappUrl = lead.telefono
    ? `https://wa.me/${lead.telefono.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${lead.nombre || ''}, habla Neno de MultiServicios El Seibo. Ana me pasó tu información. ¿Cómo te puedo ayudar?`)}`
    : null

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; background: #0A0F1E; color: #ffffff; margin: 0; padding: 20px; }
    .card { background: #1A2035; border: 1px solid #EAB308; border-radius: 12px; padding: 24px; max-width: 480px; margin: 0 auto; }
    .header { color: #EAB308; font-size: 20px; font-weight: bold; margin-bottom: 16px; }
    .badge { background: #EAB308; color: #0A0F1E; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; display: inline-block; margin-bottom: 16px; }
    .field { margin-bottom: 12px; }
    .label { color: #9CA3AF; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
    .value { color: #ffffff; font-size: 16px; font-weight: 600; margin-top: 2px; }
    .cta { display: inline-block; margin-top: 20px; padding: 12px 24px; background: #25D366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px; }
    .call-cta { display: inline-block; margin-top: 8px; margin-left: 8px; padding: 12px 24px; background: #EAB308; color: #0A0F1E; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px; }
    .footer { color: #4B5563; font-size: 11px; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">⚡ NUEVO LEAD — MultiServicios El Seibo</div>
    <div class="header">Ana te consiguió un cliente, Neno 👇</div>
    ${lead.nombre ? `<div class="field"><div class="label">Nombre</div><div class="value">${lead.nombre}</div></div>` : ''}
    ${lead.telefono ? `<div class="field"><div class="label">Teléfono / WhatsApp</div><div class="value">${lead.telefono}</div></div>` : ''}
    ${lead.ubicacion ? `<div class="field"><div class="label">Ubicación</div><div class="value">${lead.ubicacion}</div></div>` : ''}
    ${lead.tipo_servicio ? `<div class="field"><div class="label">Servicio</div><div class="value">${lead.tipo_servicio}</div></div>` : ''}
    ${lead.descripcion ? `<div class="field"><div class="label">Problema</div><div class="value">${lead.descripcion}</div></div>` : ''}
    <div class="field"><div class="label">Duración de llamada</div><div class="value">${durMin}m ${durSec}s</div></div>
    <br>
    ${whatsappUrl ? `<a href="${whatsappUrl}" class="cta">💬 Escribir por WhatsApp</a>` : ''}
    ${lead.telefono ? `<a href="tel:${lead.telefono.replace(/\D/g, '')}" class="call-cta">📞 Llamar</a>` : ''}
    <div class="footer">ID conversación: ${conversationId}</div>
  </div>
</body>
</html>`

  await resend.emails.send({
    from: 'Ana — MultiServicios <ana@payment.legacycore.io>',
    to: [nenoEmail],
    subject: `⚡ Nuevo lead: ${lead.nombre || 'Cliente'} — ${lead.ubicacion || 'El Seibo'}`,
    text: `Nuevo lead de Ana.\n\nNombre: ${lead.nombre || 'No capturado'}\nTeléfono: ${lead.telefono || 'No capturado'}\nUbicación: ${lead.ubicacion || 'No capturado'}\nServicio: ${lead.tipo_servicio || 'No especificado'}\nProblema: ${lead.descripcion || 'No especificado'}\nDuración llamada: ${durMin}m ${durSec}s`,
    html,
  })
}

// ─── Twilio WhatsApp (activates when TWILIO_ACCOUNT_SID is set) ───────────────

async function notifyNenoWhatsApp(lead: LeadData, conversationId: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_WHATSAPP_FROM   // e.g. whatsapp:+14155238886
  const to = process.env.NENO_WHATSAPP             // e.g. whatsapp:+18091234567

  if (!accountSid || !authToken || !from || !to) return

  const message = [
    `⚡ *LEAD NUEVO — Ana*`,
    ``,
    `👤 *Nombre:* ${lead.nombre || 'No capturado'}`,
    `📞 *Teléfono:* ${lead.telefono || 'No capturado'}`,
    `📍 *Ubicación:* ${lead.ubicacion || 'No especificada'}`,
    `🔧 *Servicio:* ${lead.tipo_servicio || 'No especificado'}`,
    `📋 *Problema:* ${lead.descripcion || 'No especificado'}`,
    ``,
    `_Llámalo o escríbele lo antes posible._`,
  ].join('\n')

  const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64')
  await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: 'POST',
    headers: { 'Authorization': `Basic ${credentials}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ From: from, To: to, Body: message }).toString(),
  })
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const rawBody = await request.text()

  // Verify signature
  const valid = await verifySignature(request, rawBody)
  if (!valid) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })

  let payload: ElevenLabsWebhookPayload
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Only handle post-call transcription events
  if (payload.type !== 'post_call_transcription') {
    return NextResponse.json({ received: true })
  }

  const { conversation_id, transcript, metadata, analysis, agent_id } = payload.data
  const durationSecs = metadata?.call_duration_secs ?? 0

  // Extract lead data — prefer structured data_collection, fall back to transcript parsing
  const dataCollectionResults = analysis?.data_collection_results ?? {}
  const hasStructuredData = Object.values(dataCollectionResults).some(r => r.value)

  const lead: LeadData = hasStructuredData
    ? extractLeadFromDataCollection(dataCollectionResults)
    : extractLeadFromTranscript(transcript ?? [])

  // Skip if we couldn't capture a phone number (call was too short / wrong number)
  if (!lead.telefono && !lead.nombre) {
    // Still save for analytics even if no lead captured
    console.log('[webhook] No lead data captured — saving call for analytics only')
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Save to ms_leads
  const { error: dbError } = await supabase.from('ms_leads').upsert({
    conversation_id,
    nombre: lead.nombre,
    telefono: lead.telefono,
    ubicacion: lead.ubicacion,
    tipo_servicio: lead.tipo_servicio,
    descripcion: lead.descripcion,
    transcript: transcript,
    call_duration_secs: durationSecs,
    notified_at: new Date().toISOString(),
    agent_id,
  }, { onConflict: 'conversation_id' })

  if (dbError) {
    console.error('[webhook] Supabase ms_leads error:', dbError)
  }

  // Run Claude evaluation + notifications in parallel (non-blocking on errors)
  const [callAnalysis] = await Promise.allSettled([
    evaluateCallWithClaude(transcript ?? [], lead, durationSecs),
    notifyNenoWhatsApp(lead, conversation_id),
    lead.telefono || lead.nombre ? notifyNeno(lead, conversation_id, durationSecs) : Promise.resolve(),
  ])

  // Save Claude's analysis to ms_call_analysis
  if (callAnalysis.status === 'fulfilled' && callAnalysis.value) {
    const ev = callAnalysis.value
    const { error: analysisError } = await supabase.from('ms_call_analysis').upsert({
      conversation_id,
      score_info_capture: ev.score_info_capture,
      score_objection_handling: ev.score_objection_handling,
      score_warm_transfer: ev.score_warm_transfer,
      score_tone: ev.score_tone,
      score_overall: ev.score_overall,
      info_captured: ev.info_captured,
      objections_encountered: ev.objections_encountered,
      objections_handled_well: ev.objections_handled_well,
      transfer_attempted: ev.transfer_attempted,
      transfer_succeeded: ev.transfer_succeeded,
      missed_opportunities: ev.missed_opportunities,
      strengths: ev.strengths,
      improvement_suggestions: ev.improvement_suggestions,
      call_outcome: ev.call_outcome,
      raw_analysis: ev,
    }, { onConflict: 'conversation_id' })

    if (analysisError) {
      console.error('[webhook] Supabase ms_call_analysis error:', analysisError)
    }
  }

  return NextResponse.json({ received: true, lead })
}
