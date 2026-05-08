'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const ACCENT = '#F5B800'

const services = [
  { id: 'instalacion', label: 'Instalación', sub: 'Paneles, cableado, luminarias' },
  { id: 'reparacion', label: 'Reparación', sub: 'Falla, corto, sin luz' },
  { id: 'mantenimiento', label: 'Mantenimiento', sub: 'Revisión preventiva' },
  { id: 'emergencia', label: 'Emergencia 24/7', sub: 'Atención inmediata' },
] as const

const urgencies = [
  { id: 'now', label: 'Ahora mismo', sub: 'Sin luz / emergencia', tag: 'HOY', color: '#E63946' },
  { id: '24h', label: 'En 24 horas', sub: 'Lo antes posible', tag: 'MAÑANA', color: '#F5B800' },
  { id: 'week', label: 'Esta semana', sub: 'Puedo esperar', tag: 'FLEXIBLE', color: '#8a8a92' },
] as const

export function MobileQuoteCard() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [service, setService] = useState<string | null>(null)
  const [urgency, setUrgency] = useState<string | null>(null)
  const [phone, setPhone] = useState<string>('')

  const handleSubmit = () => {
    const params = new URLSearchParams()
    if (service) params.set('service', service)
    if (urgency) params.set('urgency', urgency)
    const trimmed = phone.trim()
    if (trimmed) params.set('phone', trimmed)
    window.location.href = `/booking?${params.toString()}`
  }

  return (
    <div
      style={{
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 22,
        padding: 18,
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 14,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: ACCENT,
            letterSpacing: 1,
            fontFamily: 'var(--font-sub)',
          }}
        >
          COTIZACIÓN GRATIS · 30 SEG
        </div>
        <div style={{ fontSize: 10, color: '#8a8a92' }}>{step}/3</div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 12, color: '#fff' }}>
              ¿Qué necesitas?
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              {services.map((s) => {
                const selected = service === s.id
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setService(s.id)
                      setStep(2)
                    }}
                    style={{
                      textAlign: 'left',
                      background: selected ? `${ACCENT}1a` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${selected ? ACCENT : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: 14,
                      padding: '14px 16px',
                      color: '#fff',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{s.label}</div>
                      <div style={{ fontSize: 11, color: '#8a8a92', marginTop: 2 }}>{s.sub}</div>
                    </div>
                    <span style={{ color: ACCENT, fontSize: 18 }}>→</span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 12, color: '#fff' }}>
              ¿Qué tan urgente?
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              {urgencies.map((o) => {
                const selected = urgency === o.id
                return (
                  <button
                    key={o.id}
                    onClick={() => {
                      setUrgency(o.id)
                      setStep(3)
                    }}
                    style={{
                      textAlign: 'left',
                      background: selected ? `${o.color}1a` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${selected ? o.color : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: 14,
                      padding: '14px 16px',
                      color: '#fff',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{o.label}</div>
                      <div style={{ fontSize: 11, color: '#8a8a92', marginTop: 2 }}>{o.sub}</div>
                    </div>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 800,
                        color: o.color,
                        border: `1px solid ${o.color}55`,
                        padding: '3px 7px',
                        borderRadius: 6,
                        letterSpacing: 0.6,
                      }}
                    >
                      {o.tag}
                    </span>
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => setStep(1)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#8a8a92',
                fontSize: 12,
                marginTop: 10,
                padding: 6,
                cursor: 'pointer',
              }}
            >
              ← Atrás
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6, color: '#fff' }}>
              ¿A qué número te enviamos la cotización?
            </div>
            <div style={{ fontSize: 12, color: '#8a8a92', marginBottom: 14 }}>
              Te respondemos por WhatsApp en menos de 15 minutos.
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 12,
                padding: '14px 14px',
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>🇩🇴 +1</span>
              <input
                type="tel"
                inputMode="tel"
                placeholder="809 251 4329"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 600,
                  width: '100%',
                }}
              />
            </div>
            <button
              onClick={handleSubmit}
              style={{
                width: '100%',
                marginTop: 12,
                background: ACCENT,
                color: '#000',
                border: 'none',
                borderRadius: 14,
                padding: 16,
                fontSize: 15,
                fontWeight: 800,
                letterSpacing: 0.4,
                boxShadow: '0 10px 30px rgba(245,184,0,0.4)',
                cursor: 'pointer',
              }}
            >
              RECIBIR MI COTIZACIÓN GRATIS →
            </button>
            <div
              style={{
                marginTop: 10,
                fontSize: 10,
                color: '#8a8a92',
                textAlign: 'center',
              }}
            >
              🔒 Sin spam · Sin compromiso · 100% gratis si no contratas
            </div>
            <button
              onClick={() => setStep(2)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#8a8a92',
                fontSize: 12,
                marginTop: 6,
                padding: 6,
                cursor: 'pointer',
                width: '100%',
                textAlign: 'center',
              }}
            >
              ← Atrás
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
