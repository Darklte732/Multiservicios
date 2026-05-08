'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import {
  Zap, LogIn, Settings, Menu, X,
  ArrowRight, Phone, MapPin,
  ChevronRight,
} from 'lucide-react'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'

// Pre-populated WhatsApp opener — same friendly intro every customer
// gets so Neno can identify a fresh website lead at a glance.
const WHATSAPP_OPENER_GENERIC = encodeURIComponent(
  '¡Hola Neno! Vi tu sitio web y me gustaría más información sobre tus servicios eléctricos. ¿Está disponible?'
)
const WHATSAPP_OPENER_QUOTE = encodeURIComponent(
  '¡Hola Neno! Vi tu sitio web y necesito una cotización para un servicio eléctrico. ¿Puede ayudarme?'
)
import { AuthModal } from '@/components/AuthModal'
import { SettingsModal } from '@/components/SettingsModal'
import { useAuthStore } from '@/store/auth'
import { NotificationBell } from '@/components/notifications/NotificationBell'
import { SEO, generateLocalBusinessStructuredData, StructuredData } from '@/components/SEO'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { EmergencyBanner } from '@/components/EmergencyBanner'
import { FAQAccordion } from '@/components/FAQAccordion'
import { services, type Service } from '@/data/services'
import { HeroCollage } from '@/components/redesign/HeroCollage'
import { CoverageMap } from '@/components/redesign/CoverageMap'
import { TestimonialsRedesign } from '@/components/redesign/TestimonialsRedesign'
import { MobileQuoteCard } from '@/components/redesign/MobileQuoteCard'
import { StickyThumbBar } from '@/components/redesign/StickyThumbBar'

// ──────────────────────────────────────────
// LOGO LOCKUP — bolt SVG path verbatim from design
// ──────────────────────────────────────────
function LogoMark({ size = 44 }: { size?: number }) {
  const innerSize = size === 44 ? 24 : 22
  return (
    <div
      style={{
        width: size, height: size, borderRadius: size === 44 ? 12 : 10,
        position: 'relative',
        background: 'linear-gradient(135deg, #F5B800 0%, #F5B800dd 100%)',
        boxShadow: '0 6px 20px rgba(245,184,0,0.33), inset 0 1px 0 rgba(255,255,255,0.4)',
        display: 'grid', placeItems: 'center', overflow: 'hidden',
      }}
    >
      <svg width={innerSize} height={innerSize} viewBox="0 0 32 32" fill="none">
        <path d="M19 3 L7 18 L14 18 L12 29 L25 13 L17 13 L19 3 Z"
          fill="#0A0A0B" stroke="#0A0A0B" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.18) 100%)',
      }} />
    </div>
  )
}

// ──────────────────────────────────────────
// DESKTOP INLINE QUOTE FORM (single-shot, hero right side)
// ──────────────────────────────────────────
const QUOTE_SERVICES = [
  { id: 'reparacion',    label: 'Reparación eléctrica' },
  { id: 'instalacion',   label: 'Instalación nueva' },
  { id: 'mantenimiento', label: 'Mantenimiento' },
  { id: 'emergencia',    label: 'Emergencia 24/7' },
] as const

const QUOTE_URGENCIES = [
  { id: 'now',  label: '⚡ Hoy mismo',    tag: 'HOY' },
  { id: '24h',  label: '📅 En 24 horas', tag: 'MAÑANA' },
  { id: 'week', label: '🗓 Esta semana', tag: 'FLEXIBLE' },
] as const

function DesktopInlineQuote() {
  const [serviceId, setServiceId] = useState<string>('reparacion')
  const [urgencyId, setUrgencyId] = useState<string>('now')
  const [phone, setPhone] = useState('')
  const [openMenu, setOpenMenu] = useState<'service' | 'urgency' | null>(null)

  const service = QUOTE_SERVICES.find(s => s.id === serviceId)!
  const urgency = QUOTE_URGENCIES.find(u => u.id === urgencyId)!

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams({ service: serviceId, urgency: urgencyId })
    if (phone.trim()) params.set('phone', phone.trim())
    window.location.href = `/booking?${params.toString()}`
  }

  return (
    <form onSubmit={handleSubmit} className="quote-card p-6 max-w-[580px]">
      <div
        className="text-xs font-extrabold mb-3.5"
        style={{ color: '#F5B800', letterSpacing: '0.15em', fontFamily: 'var(--font-sub)' }}
      >
        COTIZACIÓN GRATIS · 30 SEGUNDOS
      </div>

      <div className="grid grid-cols-2 gap-2.5 mb-3 relative">
        <button
          type="button"
          className="quote-pill is-active text-left"
          onClick={() => setOpenMenu(openMenu === 'service' ? null : 'service')}
        >
          <div className="quote-pill-label">Servicio</div>
          <div className="quote-pill-value flex items-center justify-between">
            <span className="truncate">{service.label}</span>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400 ml-2 flex-shrink-0" />
          </div>
        </button>
        <button
          type="button"
          className="quote-pill text-left"
          onClick={() => setOpenMenu(openMenu === 'urgency' ? null : 'urgency')}
        >
          <div className="quote-pill-label">Urgencia</div>
          <div className="quote-pill-value flex items-center justify-between">
            <span className="truncate">{urgency.label}</span>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400 ml-2 flex-shrink-0" />
          </div>
        </button>

        <AnimatePresence>
          {openMenu === 'service' && (
            <motion.div
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              className="absolute top-full left-0 right-0 mt-1.5 z-30 bg-navy-800 border border-white/10 rounded-xl p-1.5 shadow-xl"
            >
              {QUOTE_SERVICES.map(s => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => { setServiceId(s.id); setOpenMenu(null) }}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    s.id === serviceId
                      ? 'bg-electric/15 text-electric font-bold'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </motion.div>
          )}
          {openMenu === 'urgency' && (
            <motion.div
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              className="absolute top-full right-0 left-0 mt-1.5 z-30 bg-navy-800 border border-white/10 rounded-xl p-1.5 shadow-xl"
            >
              {QUOTE_URGENCIES.map(u => (
                <button
                  type="button"
                  key={u.id}
                  onClick={() => { setUrgencyId(u.id); setOpenMenu(null) }}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    u.id === urgencyId
                      ? 'bg-electric/15 text-electric font-bold'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  {u.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-2.5">
        <div className="quote-input">
          <span className="text-sm font-bold flex-shrink-0">🇩🇴 +1</span>
          <input
            type="tel"
            inputMode="tel"
            placeholder="809 251 4329"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            aria-label="Número de teléfono"
          />
        </div>
        <button
          type="submit"
          className="btn-electric whitespace-nowrap !px-5 !py-3.5 text-sm"
          style={{ fontFamily: 'var(--font-sub)' }}
        >
          RECIBIR COTIZACIÓN <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-[11px] text-gray-500 font-medium">
        <span>🔒 Sin spam</span>
        <span>✓ Sin compromiso</span>
        <span>⚡ Respuesta &lt; 15 min</span>
      </div>
    </form>
  )
}

// ──────────────────────────────────────────
// SERVICE CARD (CRO — availability dot + Desde pricing + full-width VER SERVICIO)
// ──────────────────────────────────────────
function ServiceCard({ service, onSelect }: { service: Service; onSelect: (id: string) => void }) {
  const isEmergency = !!service.featured
  const lowerFee = service.fee?.split('-')[0]?.replace(/[^0-9,]/g, '').trim()
  const fromLabel = service.id === 'emergencia'
    ? 'Tarifa fija RD$2,000'
    : lowerFee
      ? `Desde RD$${lowerFee}`
      : 'Cotización gratis'

  return (
    <button
      onClick={() => onSelect(service.id)}
      className="text-left rounded-[20px] p-[22px] relative h-full flex flex-col group transition-transform hover:-translate-y-1"
      style={{
        background: isEmergency
          ? 'linear-gradient(180deg, rgba(230,57,70,0.10), rgba(230,57,70,0.02))'
          : 'rgba(255,255,255,0.03)',
        border: `1px solid ${isEmergency ? 'rgba(230,57,70,0.35)' : 'rgba(255,255,255,0.08)'}`,
      }}
    >
      <span
        className={`absolute top-4 right-4 availability-dot ${isEmergency ? 'is-now' : 'is-today'}`}
      >
        {isEmergency ? 'AHORA' : 'HOY'}
      </span>

      <div
        className="w-[52px] h-[52px] rounded-[14px] grid place-items-center text-2xl"
        style={{
          background: 'rgba(245,184,0,0.10)',
          color: '#F5B800',
          border: '1px solid rgba(245,184,0,0.20)',
        }}
      >
        {service.icon}
      </div>

      <h3 className="text-[18px] font-extrabold text-white mt-4 leading-tight">{service.name}</h3>
      <p className="text-[12px] font-extrabold mt-1" style={{ color: '#F5B800', fontFamily: 'var(--font-sub)', letterSpacing: '0.04em' }}>
        {fromLabel}
      </p>
      <p className="text-gray-400 text-[13px] leading-[1.5] mt-3 mb-[18px] flex-1">
        {service.description}
      </p>

      <span
        className="block text-center w-full text-white text-[12px] font-bold tracking-[0.04em] py-2.5 rounded-[10px] border border-white/15 group-hover:border-electric/50 transition-colors mt-auto"
        style={{ fontFamily: 'var(--font-sub)' }}
      >
        VER SERVICIO →
      </span>
    </button>
  )
}

// ──────────────────────────────────────────
// HOME PAGE
// ──────────────────────────────────────────
export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [showSettings, setShowSettings] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const { status, logout } = useAuthStore()
  const isAuthenticated = status === 'authenticated'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const handleServiceSelect = (id: string) => {
    const params = new URLSearchParams({ service: id })
    window.location.href = `/booking?${params.toString()}`
  }

  const activeServices = services.filter(s => s.status === 'active')
  const comingSoonServices = services.filter(s => s.status === 'coming_soon')
  const structuredData = generateLocalBusinessStructuredData()

  // Mobile-only recent jobs (per handoff §1 item 9 — mobile design only)
  const recentJobs = [
    { tag: 'Hoy · 2:14 PM', barrio: 'Santa Cruz, El Seibo', svc: 'Reparación de panel', tone: '#eab308', src: '/7108a911-e716-4416-a620-97be93f4c140.jpeg' },
    { tag: 'Ayer',          barrio: 'Miches',              svc: 'Instalación 220V',     tone: '#22c55e', src: '/7c810f87-294b-4352-a3f6-7b9ace4d39c3.jpeg' },
    { tag: 'Hace 2 días',   barrio: 'Hato Mayor',          svc: 'Mantenimiento comercial', tone: '#06b6d4', src: '/b420cfaa-cec4-47a5-a363-d8bebabcef4d.jpeg' },
  ]

  return (
    <div className="min-h-screen bg-navy-950 text-white overflow-x-hidden pb-32 lg:pb-0">
      <SEO
        title="MultiServicios El Seibo – Electricistas de Confianza"
        description="Servicios eléctricos profesionales en El Seibo, Rep. Dom. Reserva en línea, respuesta en 15 min, 24/7."
      />
      <StructuredData data={structuredData} />

      <EmergencyBanner />

      {/* ═══════════════════════════════════════
          TOP UTILITY BAR — desktop only (handoff §2 item 1)
      ═══════════════════════════════════════ */}
      <div className="utility-bar hidden md:block">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5">
              <span>📍</span> Calle Duarte #45, El Seibo · Rep. Dom.
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span>🕐</span> Lun–Sáb 7am–7pm · Domingos solo emergencias
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="utility-bar-online text-green-400 font-semibold">
              3 técnicos disponibles ahora
            </span>
            <span className="text-gray-400">🇩🇴 ES</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          MAIN NAV
      ═══════════════════════════════════════ */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'dark-nav' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-[60px]">
          <div className="flex items-center justify-between h-16 lg:h-20">

            <Link href="/" className="flex items-center gap-3 group">
              <LogoMark size={44} />
              <div className="hidden sm:block leading-tight">
                <div
                  className="font-extrabold text-white"
                  style={{ fontSize: 17, letterSpacing: 0.3 }}
                >
                  MULTI<span style={{ color: '#F5B800' }}>SERVICIOS</span>
                </div>
                <p className="text-[11px] text-gray-500 -mt-0.5 font-medium">El Seibo · Rep. Dom.</p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold">
              {[
                { href: '#servicios', label: 'Servicios' },
                { href: '/gallery',   label: 'Trabajos' },
                { href: '#cobertura', label: 'Cobertura' },
                { href: '#garantia',  label: 'Garantía' },
                { href: '#nosotros',  label: 'Nosotros' },
                { href: '#contacto',  label: 'Contacto' },
              ].map(l => (
                <a key={l.href} href={l.href} className="text-gray-300 hover:text-electric transition-colors">{l.label}</a>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <NotificationBell />
                  <button onClick={() => setShowSettings(true)} className="p-2 text-gray-400 hover:text-electric transition-colors">
                    <Settings className="h-5 w-5" />
                  </button>
                  <button onClick={logout} className="btn-outline-electric text-sm !py-2">Salir</button>
                </>
              ) : (
                <button onClick={() => { setAuthMode('login'); setShowAuth(true) }} className="btn-outline-electric text-sm !py-2">
                  <LogIn className="h-4 w-4" /> Entrar
                </button>
              )}
              <a href="tel:+18092514329" className="hidden xl:block text-right">
                <p className="text-[11px] text-gray-500 leading-tight">Emergencias 24/7</p>
                <p className="text-white font-extrabold text-base leading-tight">(809) 251-4329</p>
              </a>
              <Link
                href="/booking"
                className="text-black font-extrabold text-[13px] px-[22px] py-[14px] rounded-[12px] inline-flex items-center gap-2"
                style={{
                  background: '#F5B800',
                  boxShadow: '0 6px 20px rgba(245,184,0,0.33)',
                  fontFamily: 'var(--font-sub)',
                  letterSpacing: '0.04em',
                }}
              >
                RESERVAR AHORA <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 text-gray-400 hover:text-electric transition-colors">
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden border-t border-white/10 bg-navy-900"
            >
              <div className="px-4 py-5 space-y-2">
                {[
                  { href: '#servicios', label: 'Servicios' },
                  { href: '/gallery',   label: 'Trabajos' },
                  { href: '#cobertura', label: 'Cobertura' },
                  { href: '#garantia',  label: 'Garantía' },
                  { href: '#contacto',  label: 'Contacto' },
                ].map(l => (
                  <a
                    key={l.href}
                    href={l.href}
                    className="block py-2.5 text-gray-300 hover:text-electric font-semibold uppercase text-sm tracking-wider transition-colors"
                    style={{ fontFamily: 'var(--font-sub)' }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {l.label}
                  </a>
                ))}
                <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                  <Link href="/booking" className="btn-electric w-full justify-center" onClick={() => setMenuOpen(false)}>
                    Reservar Ahora <ArrowRight className="h-4 w-4" />
                  </Link>
                  {!isAuthenticated && (
                    <button
                      onClick={() => { setAuthMode('login'); setShowAuth(true); setMenuOpen(false) }}
                      className="btn-outline-electric w-full justify-center"
                    >
                      <LogIn className="h-4 w-4" /> Entrar
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ═══════════════════════════════════════
          HERO — split: copy + form / collage
      ═══════════════════════════════════════ */}
      <section className="relative overflow-visible pt-8 lg:pt-10 pb-16 lg:pb-20" style={{ background: '#0A0A0B' }}>
        <div className="ambient-glow-tr" />
        <div className="ambient-glow-tl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-[60px]">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-[60px] items-start">

            {/* LEFT */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
              >
                <span className="live-pill">
                  <span className="dot" />
                  <span style={{ fontFamily: 'var(--font-sub)' }}>
                    DISPONIBLES AHORA · RESPUESTA EN 15 MINUTOS
                  </span>
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white mt-5"
                style={{
                  fontFamily: '"Bebas Neue", Impact, sans-serif',
                  fontSize: 'clamp(4rem, 10.5vw, 8.25rem)',
                  lineHeight: 0.88,
                  letterSpacing: '-0.02em',
                  fontWeight: 400,
                  textTransform: 'uppercase',
                }}
              >
                Electricistas<br />
                <span style={{ color: '#F5B800' }}>de Confianza</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                className="text-[#cfcfd6] mt-6 max-w-[540px]"
                style={{ fontSize: 'clamp(1rem, 1.4vw, 1.375rem)', lineHeight: 1.45 }}
              >
                Instalaciones, reparaciones y emergencias eléctricas en El Seibo con{' '}
                <strong className="text-white">garantía escrita de 1 año</strong>.
                Llegamos a tu casa o negocio en menos de 60 minutos. Evaluación 100% gratis si contratas.
              </motion.p>

              {/* 2x2 promise grid */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-7 max-w-[540px]"
              >
                {[
                  'Cotización en 30 segundos',
                  'Técnico certificado CDEEE',
                  'Sin costo si no contratas',
                  'Pago al terminar el trabajo',
                ].map(b => (
                  <div key={b} className="flex items-center gap-2 text-[14px] text-[#cfcfd6]">
                    <span style={{ color: '#F5B800', fontWeight: 800 }}>✓</span>
                    <span>{b}</span>
                  </div>
                ))}
              </motion.div>

              {/* Inline quote — desktop one-shot, mobile 3-step */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32 }}
                className="mt-8"
              >
                <div className="hidden md:block">
                  <DesktopInlineQuote />
                </div>
                <div className="md:hidden">
                  <MobileQuoteCard />
                </div>
              </motion.div>

              {/* Mobile-only direct call (in-flow, not the sticky bar) */}
              <motion.a
                href="tel:+18092514329"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="md:hidden flex items-center justify-center gap-3 w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 px-6 rounded-xl transition-colors border border-red-400/30 mt-5"
                style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', letterSpacing: '0.05em' }}
              >
                <Phone className="h-5 w-5" />
                LLAMAR AHORA — EMERGENCIAS 24/7
              </motion.a>

              {/* Authority bar — desktop only */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="hidden lg:flex flex-wrap items-center gap-3 mt-7 pt-6 border-t border-white/8"
              >
                <div
                  className="text-[11px] font-extrabold tracking-[0.08em] leading-tight pr-1"
                  style={{ color: '#5a5a62', fontFamily: 'var(--font-sub)' }}
                >
                  CERTIFICADOS<br />Y ASEGURADOS
                </div>
                {['CDEEE', 'PRO-CONSUMIDOR', 'CÁMARA DE COMERCIO', 'SEGUROS UNIVERSAL'].map(label => (
                  <span key={label} className="authority-badge" style={{ fontFamily: 'var(--font-sub)' }}>
                    {label}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* RIGHT — photo collage with floating cards (desktop only per spec) */}
            <motion.div
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 80 }}
              className="hidden lg:block"
            >
              <HeroCollage />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          5-STAT TRUST STRIP — also serves as "Nosotros" anchor
      ═══════════════════════════════════════ */}
      <section id="nosotros" className="border-y border-white/[0.06] py-10 lg:py-12 relative z-10 bg-navy-900/40 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-[60px]">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-10">
            {[
              { v: '15 min', l: 'Tiempo de respuesta promedio' },
              { v: '1,000+', l: 'Trabajos completados' },
              { v: '4.9 / 5', l: '200+ reseñas verificadas' },
              { v: '15+ años', l: 'En El Seibo y la región' },
              { v: '24 / 7', l: 'Emergencias eléctricas' },
            ].map((s, i) => (
              <motion.div
                key={s.l}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`${i > 0 ? 'lg:pl-6 lg:border-l lg:border-white/[0.08]' : ''}`}
              >
                <p className="trust-number">{s.v}</p>
                <p className="text-gray-400 text-[13px] mt-2 leading-snug">{s.l}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SERVICES — handoff §2 item 5
      ═══════════════════════════════════════ */}
      <section id="servicios" className="py-24 lg:py-[100px] relative scroll-mt-24" style={{ background: '#0A0A0B' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-[60px]">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-10">
            <div>
              <span
                className="text-xs font-extrabold tracking-[0.2em]"
                style={{ color: '#F5B800', fontFamily: 'var(--font-sub)' }}
              >
                SERVICIOS
              </span>
              <h2
                className="text-white mt-2"
                style={{
                  fontFamily: '"Bebas Neue", Impact, sans-serif',
                  fontSize: 'clamp(3rem, 6.5vw, 5rem)',
                  lineHeight: 0.95,
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                  fontWeight: 400,
                }}
              >
                ¿Qué necesitas<br />
                <span style={{ color: '#F5B800' }}>hoy?</span>
              </h2>
            </div>
            <p className="text-[#cfcfd6] max-w-[360px] text-base lg:text-right leading-[1.5]">
              Selecciona el servicio y agenda en menos de 2 minutos. Evaluación gratis si contratas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeServices.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <ServiceCard service={service} onSelect={handleServiceSelect} />
              </motion.div>
            ))}
          </div>

          {/* Próximamente strip */}
          <div className="coming-strip mt-6 p-5">
            <div
              className="text-[11px] font-extrabold tracking-[0.18em] mb-3"
              style={{ color: '#8a8a92', fontFamily: 'var(--font-sub)' }}
            >
              PRÓXIMAMENTE — RESERVA TU LUGAR
            </div>
            <div className="flex flex-wrap gap-2.5">
              {comingSoonServices.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleServiceSelect(s.id)}
                  className="coming-strip-pill hover:border-electric/40 transition-colors"
                >
                  {s.icon} {s.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HOW IT WORKS — 4 steps (handoff §2 item 6)
      ═══════════════════════════════════════ */}
      <section className="py-16 lg:py-[60px] relative" style={{ background: '#0A0A0B' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-[60px]">
          <div className="mb-10">
            <span
              className="text-xs font-extrabold tracking-[0.2em]"
              style={{ color: '#F5B800', fontFamily: 'var(--font-sub)' }}
            >
              CÓMO FUNCIONA
            </span>
            <h2
              className="text-white mt-2"
              style={{
                fontFamily: '"Bebas Neue", Impact, sans-serif',
                fontSize: 'clamp(2.25rem, 5vw, 4rem)',
                lineHeight: 1,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                fontWeight: 400,
              }}
            >
              Del problema al técnico en 4 pasos
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { n: '01', t: 'Cotización',   d: 'Cuéntanos qué pasa por WhatsApp o el formulario. 30 segundos.' },
              { n: '02', t: 'Confirmación', d: 'Te enviamos precio claro y hora de llegada en menos de 15 min.' },
              { n: '03', t: 'Trabajo',      d: 'Técnico certificado realiza el trabajo. Tú apruebas el resultado.' },
              { n: '04', t: 'Garantía',     d: 'Pagas al terminar. Garantía escrita de 1 año en cada trabajo.' },
            ].map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-[18px] p-[22px]"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <p
                  style={{
                    fontFamily: '"Bebas Neue", Impact, sans-serif',
                    fontSize: 64,
                    color: '#F5B800',
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                    fontWeight: 400,
                  }}
                >
                  {s.n}
                </p>
                <h3 className="text-[18px] font-extrabold text-white mt-3">{s.t}</h3>
                <p className="text-gray-400 text-[13px] leading-[1.5] mt-2">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          MOBILE-ONLY — Recent jobs strip (mobile spec §1 item 9)
      ═══════════════════════════════════════ */}
      <section className="lg:hidden py-12 overflow-hidden" style={{ background: '#0A0A0B' }}>
        <div className="px-4 mb-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span
                className="text-[10px] font-extrabold tracking-[0.18em]"
                style={{ color: '#F5B800', fontFamily: 'var(--font-sub)' }}
              >
                EN VIVO
              </span>
              <h2
                className="text-white mt-1"
                style={{
                  fontFamily: '"Bebas Neue", Impact, sans-serif',
                  fontSize: 28,
                  letterSpacing: '-0.5px',
                  fontWeight: 400,
                }}
              >
                TRABAJOS RECIENTES
              </h2>
            </div>
            <Link href="/gallery" className="text-[11px] font-bold" style={{ color: '#F5B800' }}>
              VER TODOS →
            </Link>
          </div>
        </div>
        <div className="flex gap-2.5 px-4 overflow-x-auto pb-2 no-scrollbar">
          {recentJobs.map((j, i) => (
            <Link
              key={i}
              href="/gallery"
              className="flex-shrink-0 rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.03]"
              style={{ width: 220 }}
            >
              <div className="relative h-[110px] w-full">
                <Image src={j.src} alt={j.svc} fill sizes="220px" className="object-cover" />
              </div>
              <div className="p-3">
                <p className="text-[11px] font-bold flex items-center gap-1.5" style={{ color: j.tone }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: j.tone }} />
                  {j.tag}
                </p>
                <p className="text-[13px] font-bold text-white mt-1">{j.svc}</p>
                <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {j.barrio}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TESTIMONIALS — handoff §2 item 7
      ═══════════════════════════════════════ */}
      <div style={{ background: '#0A0A0B' }}>
        <TestimonialsRedesign />
      </div>

      {/* ═══════════════════════════════════════
          COVERAGE — handoff §2 item 8
      ═══════════════════════════════════════ */}
      <div id="cobertura" className="scroll-mt-24" style={{ background: '#0A0A0B' }}>
        <CoverageMap />
      </div>

      {/* ═══════════════════════════════════════
          GUARANTEE BAND — handoff §2 item 9
      ═══════════════════════════════════════ */}
      <section id="garantia" className="py-16 lg:py-[60px] scroll-mt-24" style={{ background: '#0A0A0B' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-[60px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="guarantee-band p-8 lg:p-10 grid lg:grid-cols-[1fr_2fr] gap-8 lg:gap-10 items-center"
          >
            <p
              style={{
                fontFamily: '"Bebas Neue", Impact, sans-serif',
                fontSize: 'clamp(4rem, 8vw, 7.5rem)',
                color: '#F5B800',
                lineHeight: 0.9,
                letterSpacing: '-0.02em',
                fontWeight: 400,
              }}
            >
              1 AÑO<br />DE GARANTÍA
            </p>
            <div>
              <h3 className="text-2xl lg:text-[28px] font-extrabold text-white leading-tight">
                Si vuelve a fallar lo que arreglamos, lo arreglamos sin costo.
              </h3>
              <p className="text-[#cfcfd6] text-[15px] leading-[1.55] mt-3 max-w-2xl">
                Garantía escrita en cada trabajo. Cubre mano de obra y los componentes que instalamos.
                Sin letra pequeña — la firmamos contigo el día del servicio.
              </p>
              <div className="flex flex-wrap gap-3 mt-5">
                <Link
                  href="/booking"
                  className="text-black font-extrabold text-[14px] px-[22px] py-[14px] rounded-[12px] inline-flex items-center gap-2"
                  style={{
                    background: '#F5B800',
                    fontFamily: 'var(--font-sub)',
                    letterSpacing: '0.04em',
                  }}
                >
                  VER LA GARANTÍA <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={`https://wa.me/18092514329?text=${WHATSAPP_OPENER_GENERIC}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-white text-[14px] font-extrabold px-[22px] py-[14px] rounded-[12px] inline-flex items-center gap-2 border border-white/20 hover:border-white/40 transition-colors"
                  style={{ fontFamily: 'var(--font-sub)', letterSpacing: '0.04em' }}
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  HABLAR CON UN TÉCNICO
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FAQ
      ═══════════════════════════════════════ */}
      <section className="py-20 lg:py-24" style={{ background: '#0A0A0B' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span
              className="text-xs font-extrabold tracking-[0.2em]"
              style={{ color: '#F5B800', fontFamily: 'var(--font-sub)' }}
            >
              FAQ
            </span>
            <h2
              className="text-white mt-2"
              style={{
                fontFamily: '"Bebas Neue", Impact, sans-serif',
                fontSize: 'clamp(2.25rem, 4.6vw, 3.5rem)',
                lineHeight: 1,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                fontWeight: 400,
              }}
            >
              Preguntas Frecuentes
            </h2>
            <p className="text-gray-400 text-base lg:text-lg mt-3">Todo lo que necesitas saber antes de reservar</p>
          </div>
          <FAQAccordion />
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FINAL CTA — handoff §2 item 10
      ═══════════════════════════════════════ */}
      <section id="contacto" className="py-16 lg:py-[60px] pb-24 lg:pb-[100px] scroll-mt-24" style={{ background: '#0A0A0B' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-[60px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="cta-white-card p-8 lg:p-[60px] grid lg:grid-cols-[1.5fr_1fr] gap-10 items-center"
          >
            <div className="relative">
              <p
                className="text-[11px] font-extrabold tracking-[0.2em]"
                style={{ color: '#5a5a62', fontFamily: 'var(--font-sub)' }}
              >
                EL SEIBO · REP. DOM.
              </p>
              <h2
                style={{
                  fontFamily: '"Bebas Neue", Impact, sans-serif',
                  fontSize: 'clamp(3rem, 7vw, 6rem)',
                  margin: '8px 0 16px',
                  letterSpacing: '-0.02em',
                  lineHeight: 0.92,
                  fontWeight: 400,
                  color: '#0A0A0B',
                  textTransform: 'uppercase',
                }}
              >
                ¿Listo para<br />arreglarlo hoy?
              </h2>
              <p className="text-gray-700 text-[16px] lg:text-[18px] leading-[1.5] max-w-[540px]">
                Cotización gratis en 30 segundos. Respuesta por WhatsApp en menos de 15 minutos.
                Sin compromiso.
              </p>
            </div>

            <div className="relative grid gap-3">
              <a
                href={`https://wa.me/18092514329?text=${WHATSAPP_OPENER_QUOTE}`}
                target="_blank" rel="noopener noreferrer"
                className="cta-stack-btn is-whatsapp"
                style={{ fontFamily: 'var(--font-sub)', letterSpacing: '0.04em' }}
              >
                <span className="flex items-center gap-3"><WhatsAppIcon className="h-5 w-5" /> WHATSAPP DIRECTO</span>
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="tel:+18092514329"
                className="cta-stack-btn is-phone"
                style={{ fontFamily: 'var(--font-sub)', letterSpacing: '0.04em' }}
              >
                <span className="flex items-center gap-3"><Phone className="h-5 w-5" /> (809) 251-4329</span>
                <ArrowRight className="h-5 w-5" />
              </a>
              <Link
                href="/booking"
                className="cta-stack-btn is-quote"
                style={{ fontFamily: 'var(--font-sub)', letterSpacing: '0.04em' }}
              >
                <span className="flex items-center gap-3"><Zap className="h-5 w-5" /> COTIZAR EN 30 SEG</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER + GLOBAL OVERLAYS
      ═══════════════════════════════════════ */}
      <Footer />

      {/* Floating WhatsApp button — desktop only (mobile uses sticky thumb bar) */}
      <div className="hidden lg:block">
        <WhatsAppButton />
      </div>

      {/* Sticky mobile thumb-zone CTA bar */}
      <StickyThumbBar />

      {/* Modals */}
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} defaultTab={authMode} />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  )
}
