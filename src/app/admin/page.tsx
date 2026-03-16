'use client'

import { useState, useEffect, useCallback } from 'react'
import { Phone, TrendingUp, Users, Clock, Star, ChevronDown, ChevronUp, RefreshCw, Zap, MessageSquare, Target, AlertCircle, CheckCircle2, XCircle, Loader2, History, Calendar } from 'lucide-react'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Lead {
  id: string
  created_at: string
  conversation_id: string
  nombre: string | null
  telefono: string | null
  ubicacion: string | null
  tipo_servicio: string | null
  descripcion: string | null
  call_duration_secs: number
  status: string
  transcript: Array<{ role: string; message: string; time_in_call_secs: number }> | null
  analysis: {
    score_overall: number | null
    score_info_capture: number | null
    score_objection_handling: number | null
    score_warm_transfer: number | null
    score_tone: number | null
    call_outcome: string | null
    missed_opportunities: string[] | null
    strengths: string[] | null
    improvement_suggestions: string[] | null
    objections_encountered: string[] | null
    transfer_attempted: boolean | null
    transfer_succeeded: boolean | null
    info_captured: { nombre: boolean; telefono: boolean; ubicacion: boolean; problema: boolean } | null
  } | null
}

interface Stats {
  totalCalls: number
  leadsWithPhone: number
  avgDurationSecs: number
  avgScore: string | null
  statusCounts: Record<string, number>
  conversionRate: string
  selfHealCount: number
  autoImprovementCount: number
  totalVersions: number
}

interface ImprovementData {
  avgScores: Record<string, string>
  totalCallsAnalyzed: number
  topMissedOpportunities: string[]
  topObjections: string[]
  topStrengths: string[]
  suggestions: string
  currentVersion: number
}

interface PromptVersion {
  id: string
  version: number
  change_summary: string
  applied_by: string
  created_at: string
  performance_before: Record<string, number> | null
}

interface WeeklyInsight {
  id: string
  week_start: string
  week_end: string
  total_calls: number
  calls_with_lead: number
  avg_score_overall: number
  prompt_applied: boolean
  prompt_suggestions: string
}

// ─── Score badge component ─────────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number | null }) {
  if (score == null) return <span className="text-gray-500 text-xs">—</span>
  const color = score >= 8 ? 'text-green-400' : score >= 6 ? 'text-yellow-400' : 'text-red-400'
  return <span className={`font-bold text-sm ${color}`}>{score}/10</span>
}

function OutcomeBadge({ outcome }: { outcome: string | null }) {
  if (!outcome) return null
  const map: Record<string, { label: string; color: string }> = {
    lead_captured: { label: 'Lead ✓', color: 'bg-green-900/50 text-green-300 border-green-700' },
    transferred: { label: 'Transferido ✓', color: 'bg-blue-900/50 text-blue-300 border-blue-700' },
    no_lead: { label: 'Sin lead', color: 'bg-gray-800 text-gray-400 border-gray-600' },
    hung_up: { label: 'Colgó', color: 'bg-red-900/50 text-red-300 border-red-700' },
  }
  const { label, color } = map[outcome] || { label: outcome, color: 'bg-gray-800 text-gray-400 border-gray-600' }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${color}`}>{label}</span>
  )
}

// ─── Lead card ─────────────────────────────────────────────────────────────────

function LeadCard({ lead }: { lead: Lead }) {
  const [expanded, setExpanded] = useState(false)
  const dur = lead.call_duration_secs
  const durStr = `${Math.floor(dur / 60)}m ${dur % 60}s`
  const date = new Date(lead.created_at).toLocaleDateString('es-DO', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  return (
    <div className="bg-navy-700 border border-white/10 rounded-xl overflow-hidden hover:border-electric/30 transition-colors">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-electric/10 border border-electric/30 flex items-center justify-center flex-shrink-0">
            <Phone className="w-4 h-4 text-electric" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-white text-sm truncate">
              {lead.nombre || <span className="text-gray-500 italic">Sin nombre</span>}
            </div>
            <div className="text-xs text-gray-400 truncate">
              {lead.telefono || '—'} · {lead.ubicacion || 'Sin ubicación'} · {date}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-3">
          <OutcomeBadge outcome={lead.analysis?.call_outcome || null} />
          {lead.analysis?.score_overall != null && (
            <div className="text-right hidden sm:block">
              <div className="text-xs text-gray-500">Score</div>
              <ScoreBadge score={lead.analysis.score_overall} />
            </div>
          )}
          <span className="text-xs text-gray-500 hidden sm:block">{durStr}</span>
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-white/10 p-4 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Información', score: lead.analysis?.score_info_capture },
              { label: 'Objeciones', score: lead.analysis?.score_objection_handling },
              { label: 'Transferencia', score: lead.analysis?.score_warm_transfer },
              { label: 'Tono', score: lead.analysis?.score_tone },
            ].map(({ label, score }) => (
              <div key={label} className="bg-navy-800 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500 mb-1">{label}</div>
                <ScoreBadge score={score ?? null} />
              </div>
            ))}
          </div>

          {/* Info captured */}
          {lead.analysis?.info_captured && (
            <div>
              <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Datos capturados</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(lead.analysis.info_captured).map(([key, val]) => (
                  <span key={key} className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${val ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>
                    {val ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {key}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Lead details */}
          {(lead.tipo_servicio || lead.descripcion) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {lead.tipo_servicio && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">Servicio</div>
                  <div className="text-sm text-white">{lead.tipo_servicio}</div>
                </div>
              )}
              {lead.descripcion && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">Problema</div>
                  <div className="text-sm text-white">{lead.descripcion}</div>
                </div>
              )}
            </div>
          )}

          {/* Strengths and missed opportunities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {lead.analysis?.strengths && lead.analysis.strengths.length > 0 && (
              <div>
                <div className="text-xs text-green-500 mb-2 uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Fortalezas
                </div>
                <ul className="space-y-1">
                  {lead.analysis.strengths.map((s, i) => (
                    <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                      <span className="text-green-500 mt-0.5">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {lead.analysis?.missed_opportunities && lead.analysis.missed_opportunities.length > 0 && (
              <div>
                <div className="text-xs text-yellow-500 mb-2 uppercase tracking-wider flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Oportunidades perdidas
                </div>
                <ul className="space-y-1">
                  {lead.analysis.missed_opportunities.map((m, i) => (
                    <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                      <span className="text-yellow-500 mt-0.5">•</span> {m}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Transcript */}
          {lead.transcript && lead.transcript.length > 0 && (
            <div>
              <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Transcripción</div>
              <div className="bg-navy-800 rounded-lg p-3 max-h-64 overflow-y-auto space-y-2">
                {lead.transcript.map((msg, i) => (
                  <div key={i} className={`flex gap-2 ${msg.role === 'agent' ? '' : 'flex-row-reverse'}`}>
                    <div className={`flex-shrink-0 text-xs px-1.5 py-0.5 rounded font-mono ${msg.role === 'agent' ? 'bg-electric/20 text-electric' : 'bg-blue-900/40 text-blue-300'}`}>
                      {msg.role === 'agent' ? 'ANA' : 'CLIENTE'}
                    </div>
                    <div className={`text-xs text-gray-300 max-w-[80%] ${msg.role !== 'agent' ? 'text-right' : ''}`}>
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WhatsApp quick action */}
          {lead.telefono && (
            <a
              href={`https://wa.me/${lead.telefono.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${lead.nombre || ''}, habla Neno de MultiServicios El Seibo. ¿Cómo te puedo ayudar?`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm bg-[#25D366] text-white px-4 py-2 rounded-lg hover:bg-[#1da851] transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp a {lead.nombre || lead.telefono}
            </a>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main admin page ───────────────────────────────────────────────────────────

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [versions, setVersions] = useState<PromptVersion[]>([])
  const [weeklyInsights, setWeeklyInsights] = useState<WeeklyInsight[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'leads' | 'improvement' | 'history'>('leads')
  const [improvement, setImprovement] = useState<ImprovementData | null>(null)
  const [improvementLoading, setImprovementLoading] = useState(false)
  const [newPrompt, setNewPrompt] = useState('')
  const [applyingPrompt, setApplyingPrompt] = useState(false)
  const [applySuccess, setApplySuccess] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/stats')
      const data = await res.json()
      setStats(data.stats)
      setLeads(data.leads || [])
      setVersions(data.versions || [])
      setWeeklyInsights(data.weeklyInsights || [])
    } catch (err) {
      console.error('Error loading stats:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const loadImprovement = async () => {
    setImprovementLoading(true)
    try {
      const res = await fetch('/api/admin/improve-prompt')
      const data = await res.json()
      setImprovement(data)
      setNewPrompt('')
    } catch (err) {
      console.error('Error loading improvement:', err)
    } finally {
      setImprovementLoading(false)
    }
  }

  const applyPrompt = async () => {
    if (!newPrompt.trim()) return
    setApplyingPrompt(true)
    try {
      const res = await fetch('/api/admin/improve-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newPrompt: newPrompt.trim(),
          changeSummary: 'Mejora basada en análisis de llamadas',
        }),
      })
      const data = await res.json()
      if (data.success) {
        setApplySuccess(true)
        setTimeout(() => setApplySuccess(false), 3000)
        setNewPrompt('')
      }
    } catch (err) {
      console.error('Error applying prompt:', err)
    } finally {
      setApplyingPrompt(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-navy-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-electric rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-navy-950" />
            </div>
            <div>
              <div className="font-bold text-sm">Admin · MultiServicios El Seibo</div>
              <div className="text-xs text-gray-400">Panel de control de Ana</div>
            </div>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Stats bar */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Llamadas totales', value: stats.totalCalls, icon: Phone, color: 'text-electric' },
              { label: 'Leads capturados', value: `${stats.leadsWithPhone} (${stats.conversionRate}%)`, icon: Users, color: 'text-green-400' },
              { label: 'Score Ana (prom.)', value: stats.avgScore ? `${stats.avgScore}/10` : 'Sin datos', icon: Star, color: 'text-yellow-400' },
              { label: 'Auto-correcciones', value: stats.selfHealCount > 0 ? `${stats.selfHealCount}× auto-fix` : stats.totalVersions > 0 ? `v${stats.totalVersions} actual` : 'Sin versiones', icon: RefreshCw, color: stats.selfHealCount > 0 ? 'text-orange-400' : 'text-blue-400' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-navy-700 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span className="text-xs text-gray-400">{label}</span>
                </div>
                <div className="text-xl font-bold text-white">{value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-navy-800 rounded-xl w-fit">
          {[
            { id: 'leads', label: 'Llamadas & Leads' },
            { id: 'improvement', label: 'Mejorar a Ana' },
            { id: 'history', label: 'Historial' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as 'leads' | 'improvement' | 'history')
                if (tab.id === 'improvement' && !improvement) loadImprovement()
              }}
              className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${activeTab === tab.id ? 'bg-electric text-navy-950' : 'text-gray-400 hover:text-white'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab: Leads */}
        {activeTab === 'leads' && (
          <div className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-16 text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Cargando llamadas...
              </div>
            ) : leads.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <Phone className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Aún no hay llamadas registradas.</p>
                <p className="text-xs mt-1">Las llamadas aparecerán aquí automáticamente cuando Ana las complete.</p>
              </div>
            ) : (
              leads.map(lead => <LeadCard key={lead.id} lead={lead} />)
            )}
          </div>
        )}

        {/* Tab: Improvement */}
        {activeTab === 'improvement' && (
          <div className="space-y-6">
            {improvementLoading ? (
              <div className="flex items-center justify-center py-16 text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Analizando el desempeño de Ana con Claude...
              </div>
            ) : improvement ? (
              <>
                {/* Score overview */}
                <div className="bg-navy-700 border border-white/10 rounded-xl p-5">
                  <h2 className="text-sm font-semibold text-electric mb-4 uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Puntuaciones promedio ({improvement.totalCallsAnalyzed} llamadas)
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {Object.entries(improvement.avgScores).map(([key, val]) => {
                      const labels: Record<string, string> = {
                        overall: 'General',
                        info_capture: 'Captura info',
                        objection: 'Objeciones',
                        tone: 'Tono',
                        transfer: 'Transferencia',
                      }
                      const numVal = parseFloat(val)
                      const color = isNaN(numVal) ? 'text-gray-500' : numVal >= 8 ? 'text-green-400' : numVal >= 6 ? 'text-yellow-400' : 'text-red-400'
                      return (
                        <div key={key} className="bg-navy-800 rounded-lg p-3 text-center">
                          <div className="text-xs text-gray-500 mb-1">{labels[key] || key}</div>
                          <div className={`text-xl font-bold ${color}`}>{val}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Patterns */}
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { title: 'Oportunidades perdidas', data: improvement.topMissedOpportunities, color: 'text-yellow-400', icon: AlertCircle },
                    { title: 'Objeciones frecuentes', data: improvement.topObjections, color: 'text-red-400', icon: XCircle },
                    { title: 'Fortalezas de Ana', data: improvement.topStrengths, color: 'text-green-400', icon: CheckCircle2 },
                  ].map(({ title, data, color, icon: Icon }) => (
                    <div key={title} className="bg-navy-700 border border-white/10 rounded-xl p-4">
                      <h3 className={`text-xs font-semibold ${color} mb-3 uppercase tracking-wider flex items-center gap-1.5`}>
                        <Icon className="w-3.5 h-3.5" /> {title}
                      </h3>
                      {data.length === 0 ? (
                        <p className="text-xs text-gray-500">Sin datos suficientes</p>
                      ) : (
                        <ul className="space-y-1.5">
                          {data.map((item, i) => (
                            <li key={i} className="text-xs text-gray-300">{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>

                {/* Claude's suggestions */}
                <div className="bg-navy-700 border border-electric/20 rounded-xl p-5">
                  <h2 className="text-sm font-semibold text-electric mb-4 uppercase tracking-wider flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Sugerencias de Claude para mejorar a Ana
                  </h2>
                  <div className="prose prose-sm prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-gray-300 font-sans leading-relaxed">
                      {improvement.suggestions}
                    </pre>
                  </div>
                </div>

                {/* Apply new prompt */}
                <div className="bg-navy-700 border border-white/10 rounded-xl p-5">
                  <h2 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-electric" />
                    Aplicar nuevo prompt a Ana
                  </h2>
                  <p className="text-xs text-gray-400 mb-4">
                    Pega el nuevo prompt completo abajo. Se aplicará directamente al agente de ElevenLabs y se guardará en el historial de versiones.
                  </p>
                  <textarea
                    value={newPrompt}
                    onChange={e => setNewPrompt(e.target.value)}
                    placeholder="Pega aquí el nuevo prompt completo para Ana..."
                    className="w-full h-48 bg-navy-800 border border-white/10 rounded-lg p-3 text-sm text-gray-300 placeholder-gray-600 resize-none focus:outline-none focus:border-electric/50"
                  />
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={applyPrompt}
                      disabled={applyingPrompt || !newPrompt.trim()}
                      className="btn-electric text-sm px-5 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {applyingPrompt ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                      {applyingPrompt ? 'Aplicando...' : 'Aplicar prompt'}
                    </button>
                    {applySuccess && (
                      <span className="text-sm text-green-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> ¡Prompt actualizado! Versión {improvement.currentVersion + 1}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={loadImprovement}
                  disabled={improvementLoading}
                  className="text-sm text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Regenerar análisis
                </button>
              </>
            ) : (
              <div className="text-center py-16 text-gray-500">
                <Target className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Sin datos suficientes para generar sugerencias.</p>
                <p className="text-xs mt-1">Necesitas al menos 1 llamada analizada.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab: History */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            {/* Weekly reports */}
            <div>
              <h2 className="text-sm font-semibold text-electric mb-3 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Reportes semanales automáticos
              </h2>
              {weeklyInsights.length === 0 ? (
                <div className="bg-navy-700 border border-white/10 rounded-xl p-6 text-center text-gray-500">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">El primer reporte se generará el lunes a las 8am automáticamente.</p>
                  <p className="text-xs mt-1">Necesita al menos 3 llamadas analizadas en la semana.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {weeklyInsights.map(w => (
                    <div key={w.id} className="bg-navy-700 border border-white/10 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm font-medium text-white">
                          Semana del {new Date(w.week_start).toLocaleDateString('es-DO', { month: 'short', day: 'numeric' })} al {new Date(w.week_end).toLocaleDateString('es-DO', { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">{w.total_calls} llamadas · Score {w.avg_score_overall?.toFixed(1)}/10</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${w.prompt_applied ? 'bg-green-900/30 text-green-300 border-green-700' : 'bg-gray-800 text-gray-500 border-gray-600'}`}>
                            {w.prompt_applied ? '✓ Prompt actualizado' : 'Sin cambios'}
                          </span>
                        </div>
                      </div>
                      {w.prompt_suggestions && (
                        <p className="text-xs text-gray-400 line-clamp-2">{w.prompt_suggestions}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Prompt version history */}
            <div>
              <h2 className="text-sm font-semibold text-electric mb-3 uppercase tracking-wider flex items-center gap-2">
                <History className="w-4 h-4" /> Historial de versiones de Ana
              </h2>
              {versions.length === 0 ? (
                <div className="bg-navy-700 border border-white/10 rounded-xl p-6 text-center text-gray-500">
                  <History className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Aún no hay versiones guardadas.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {versions.map((v, i) => (
                    <div key={v.id} className={`bg-navy-700 border rounded-xl p-4 flex items-start gap-4 ${v.applied_by?.includes('self-heal') ? 'border-orange-500/40' : 'border-white/10'}`}>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-electric text-navy-950' : v.applied_by?.includes('self-heal') ? 'bg-orange-500/20 text-orange-400' : 'bg-navy-800 text-gray-400'}`}>
                        v{v.version}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white font-medium">{v.change_summary || 'Sin descripción'}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(v.created_at).toLocaleDateString('es-DO', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          {' · '}
                          {v.applied_by?.includes('self-heal') ? '🚨 Auto-corrección' : v.applied_by?.includes('cron') ? '🤖 Mejora semanal' : '👤 Manual'}
                        </div>
                        {v.performance_before && (
                          <div className="flex gap-3 mt-2">
                            {Object.entries(v.performance_before).map(([key, val]) => (
                              <span key={key} className="text-xs text-gray-500">
                                {key}: <span className="text-gray-300">{typeof val === 'number' ? val.toFixed(1) : val}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        {v.applied_by?.includes('self-heal:level-3') && (
                          <span className="text-xs bg-red-500/15 text-red-400 border border-red-500/40 px-2 py-0.5 rounded-full">
                            🚨 L3 Reconstrucción
                          </span>
                        )}
                        {v.applied_by?.includes('self-heal:level-2') && (
                          <span className="text-xs bg-orange-500/15 text-orange-400 border border-orange-500/40 px-2 py-0.5 rounded-full">
                            ⚠️ L2 Revisión
                          </span>
                        )}
                        {v.applied_by?.includes('self-heal:level-1') && (
                          <span className="text-xs bg-yellow-500/15 text-yellow-400 border border-yellow-500/40 px-2 py-0.5 rounded-full">
                            🔧 L1 Parche
                          </span>
                        )}
                        {i === 0 && (
                          <span className="text-xs bg-electric/10 text-electric border border-electric/30 px-2 py-0.5 rounded-full">
                            Actual
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
