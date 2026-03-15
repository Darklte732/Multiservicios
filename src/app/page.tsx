'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import {
  Zap, Shield, LogIn, UserPlus, Settings, Menu, X, Star,
  ArrowRight, CheckCircle, Phone, MapPin, Calendar,
  ShieldCheck, MessageCircle, Award, Clock, ChevronDown
} from 'lucide-react'
import { AuthModal } from '@/components/AuthModal'
import { SettingsModal } from '@/components/SettingsModal'
import { ElevenLabsWidget } from '@/components/ElevenLabsWidget'
import { useAuthStore } from '@/store/auth'
import { NotificationBell } from '@/components/notifications/NotificationBell'
import { SEO, generateLocalBusinessStructuredData, StructuredData } from '@/components/SEO'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { EmergencyBanner } from '@/components/EmergencyBanner'
import { FAQAccordion } from '@/components/FAQAccordion'
import { TestimonialsSection } from '@/components/TestimonialsSection'
import { ServiceAreaMap } from '@/components/ServiceAreaMap'
import { services, type Service } from '@/data/services'

// ──────────────────────────────────────────
// ANIMATED COUNTER
// ──────────────────────────────────────────
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0, margin: '0px 0px -80px 0px' })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1800
    const step = 16
    const increment = target / (duration / step)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, step)
    return () => clearInterval(timer)
  }, [inView, target])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// ──────────────────────────────────────────
// WORK PHOTOS STRIP DATA
// ──────────────────────────────────────────
const workPhotos = [
  { src: '/41a4fd06-d34c-42a6-b234-46fa1debd1df.jpeg', title: 'Instalación Residencial', category: 'Residencial' },
  { src: '/4ca1b64b-7b5f-4145-b7de-099d7806492f.jpeg', title: 'Panel Eléctrico Comercial', category: 'Comercial' },
  { src: '/cf629f37-1d13-4d7b-8774-7a5ce95bf946.jpeg', title: 'Tablero Principal', category: 'Paneles' },
  { src: '/cf856cdc-a1e1-40ef-b079-eeab55418c17.jpeg', title: 'Conexiones Seguras', category: 'Instalación' },
  { src: '/db2d6452-ebcc-4f8a-8588-9df01d849b74.jpeg', title: 'Acabados Profesionales', category: 'Acabados' },
  { src: '/6bb20545-9b5b-43f9-b5f8-d7bbb4bcbd5b.jpeg', title: 'Mantenimiento', category: 'Mantenimiento' },
]

const servicePhotos: Record<string, string[]> = {
  emergencia:    ['/2394664b-563a-48aa-900e-7ff62152b422.jpeg', '/6bb20545-9b5b-43f9-b5f8-d7bbb4bcbd5b.jpeg'],
  instalacion:   ['/41a4fd06-d34c-42a6-b234-46fa1debd1df.jpeg', '/43a0a5cf-6fea-49e8-b174-7382d6ebfa5d.jpeg'],
  mantenimiento: ['/7108a911-e716-4416-a620-97be93f4c140.jpeg', '/6bb20545-9b5b-43f9-b5f8-d7bbb4bcbd5b.jpeg'],
  reparacion:    ['/cf856cdc-a1e1-40ef-b079-eeab55418c17.jpeg', '/7c810f87-294b-4352-a3f6-7b9ace4d39c3.jpeg'],
}

// ──────────────────────────────────────────
// SERVICE CARD
// ──────────────────────────────────────────
const ServiceCard = ({ service, onSelect }: { service: Service; onSelect: (id: string) => void }) => {
  const [photoIdx, setPhotoIdx] = useState(0)
  const [email, setEmail] = useState('')
  const photos = service.status === 'active' ? (servicePhotos[service.id] || []) : []

  useEffect(() => {
    if (!photos.length) return
    const t = setInterval(() => setPhotoIdx(p => (p + 1) % photos.length), 2800)
    return () => clearInterval(t)
  }, [photos.length])

  if (service.status === 'coming_soon') {
    return (
      <div className="service-card-dark coming-soon relative overflow-hidden">
        <div className="coming-soon-overlay-dark">
          <span className="electric-badge text-xs">🔜 Próximamente</span>
          <p className="text-white font-semibold text-sm mt-1">{service.name}</p>
          <p className="text-gray-400 text-xs text-center px-4 leading-snug">{service.shortDesc}</p>
          <div className="flex gap-2 mt-2 px-2 w-full max-w-xs">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="input-dark text-xs py-1.5 px-3 flex-1 min-w-0"
            />
            <button className="btn-electric text-xs !py-1.5 !px-3">Avísame</button>
          </div>
        </div>
        <div className="opacity-25 pointer-events-none select-none">
          <div className="text-4xl mb-3">{service.icon}</div>
          <h3 className="text-lg font-bold text-white">{service.name}</h3>
          <p className="text-gray-400 text-sm mt-1">{service.shortDesc}</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className={`service-card-dark ${service.emergencyCard ? 'featured-emergency' : ''}`}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(service.id)}
    >
      {/* Photo carousel */}
      {photos.length > 0 && (
        <div className="aspect-video rounded-xl overflow-hidden mb-4 relative bg-navy-600">
          <AnimatePresence mode="wait">
            <motion.img
              key={photoIdx}
              src={photos[photoIdx]}
              alt={service.name}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          </AnimatePresence>
          {/* badge */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              service.emergencyCard
                ? 'bg-red-500 text-white'
                : 'bg-electric text-navy-950'
            }`} style={{ fontFamily: 'var(--font-sub)', letterSpacing:'0.05em', textTransform:'uppercase' }}>
              {service.emergencyCard ? '🚨 Emergencia' : '⭐ Calidad'}
            </span>
          </div>
          {/* dots */}
          <div className="absolute bottom-2 right-2.5 flex gap-1 z-10">
            {photos.map((_, i) => (
              <div key={i} className={`carousel-dot ${i === photoIdx ? 'active' : ''}`} />
            ))}
          </div>
        </div>
      )}

      {/* Body */}
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
          service.emergencyCard ? 'bg-red-900/40' : 'bg-electric/10'
        }`}>
          {service.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white text-lg leading-tight">{service.name}</h3>
          {service.emergencyCard && (
            <p className="text-red-400 text-xs font-bold uppercase tracking-wide" style={{fontFamily:'var(--font-sub)'}}>Disponible 24/7</p>
          )}
        </div>
      </div>

      <p className="text-gray-400 text-sm leading-relaxed mb-3">{service.description}</p>

      {/* Urgency / availability indicator */}
      <div className={`flex items-center gap-1.5 text-xs mb-4 ${service.emergencyCard ? 'text-red-400' : 'text-green-400'}`}>
        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${service.emergencyCard ? 'bg-red-400' : 'bg-green-400'}`} />
        <span className="font-semibold" style={{ fontFamily: 'var(--font-sub)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {service.emergencyCard ? 'Disponible ahora — respuesta < 30 min' : 'Próxima cita: disponible hoy'}
        </span>
      </div>

      <div className="flex items-center justify-end pt-3 border-t border-white/5 mt-auto">
        <button className={`${service.emergencyCard ? 'btn-emergency' : 'btn-electric'} text-xs !py-2 !px-4`}>
          {service.emergencyCard ? <><Phone className="h-3.5 w-3.5" /> Llamar Ahora</> : <>Ver Servicio <ArrowRight className="h-3.5 w-3.5" /></>}
        </button>
      </div>
    </motion.div>
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
    window.location.href = `/booking?service=${id}`
  }

  const structuredData = generateLocalBusinessStructuredData()

  return (
    <div className="min-h-screen bg-navy-950 text-white overflow-x-hidden">
      <SEO
        title="MultiServicios El Seibo – Electricistas de Confianza"
        description="Servicios eléctricos profesionales en El Seibo, Rep. Dom. Reserva en línea, respuesta en 15 min, 24/7."
      />
      <StructuredData data={structuredData} />

      {/* ═══════════════════════════════════════
          EMERGENCY BANNER
      ═══════════════════════════════════════ */}
      <EmergencyBanner />

      {/* ═══════════════════════════════════════
          NAVIGATION
      ═══════════════════════════════════════ */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'dark-nav' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-9 h-9 bg-electric rounded-xl flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-md transition-all">
                  <Zap className="h-5 w-5 text-navy-950" strokeWidth={2.5} />
                </div>
              </div>
              <div className="hidden sm:block">
                <span
                  className="text-xl font-black tracking-tight text-white"
                  style={{ fontFamily: 'var(--font-sub)', textTransform: 'uppercase', letterSpacing: '0.04em' }}
                >
                  Multi<span className="text-electric">Servicios</span>
                </span>
                <p className="text-xs text-gray-500 -mt-0.5 font-medium">El Seibo, Rep. Dom.</p>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {[
                { href: '#servicios', label: 'Servicios' },
                { href: '/gallery', label: 'Trabajos' },
                { href: '#nosotros', label: 'Nosotros' },
                { href: '#contacto', label: 'Contacto' },
              ].map(l => (
                <a key={l.href} href={l.href} className="nav-link">{l.label}</a>
              ))}
            </nav>

            {/* CTA cluster */}
            <div className="hidden lg:flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <NotificationBell />
                  <button onClick={() => setShowSettings(true)} className="p-2 text-gray-400 hover:text-electric transition-colors">
                    <Settings className="h-5 w-5" />
                  </button>
                  <button onClick={logout} className="btn-outline-electric text-sm !py-2">Salir</button>
                </>
              ) : (
                <>
                  <button onClick={() => { setAuthMode('login'); setShowAuth(true) }} className="btn-outline-electric text-sm !py-2">
                    <LogIn className="h-4 w-4" /> Entrar
                  </button>
                </>
              )}
              <Link href="/booking" className="btn-electric">
                Reservar Ahora <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="tel:+18095550123" className="hero-phone-cta">
                <Phone className="h-4 w-4 text-electric" />
                <div>
                  <p className="text-xs text-gray-500 leading-none">Emergencias</p>
                  <p className="text-white font-bold text-sm leading-tight" style={{ fontFamily: 'var(--font-sub)' }}>
                    (809) 555-0123
                  </p>
                </div>
              </a>
            </div>

            {/* Mobile */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 text-gray-400 hover:text-electric transition-colors">
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
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
                  { href: '/gallery', label: 'Trabajos' },
                  { href: '#nosotros', label: 'Nosotros' },
                  { href: '#contacto', label: 'Contacto' },
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
                  <a
                    href="https://wa.me/18095550123?text=Hola,%20necesito%20un%20servicio%20eléctrico"
                    className="btn-whatsapp w-full justify-center"
                    target="_blank" rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                  <a href="tel:+18095550123" className="btn-emergency w-full justify-center">
                    <Phone className="h-4 w-4" /> Emergencias 24/7
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ═══════════════════════════════════════
          HERO
      ═══════════════════════════════════════ */}
      <section className="relative min-h-[95vh] flex items-center section-primary overflow-hidden">
        {/* circuit grid */}
        <div className="circuit-overlay" />
        {/* radial yellow glow */}
        <div
          className="absolute top-1/2 left-1/3 -translate-y-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: '900px', height: '700px',
            background: 'radial-gradient(ellipse, rgba(234,179,8,0.08) 0%, transparent 65%)',
          }}
        />
        {/* bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navy-950 to-transparent pointer-events-none z-10" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* LEFT: Copy */}
            <div>
              {/* overline badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="mb-5"
              >
                <span className="electric-badge">
                  <CheckCircle className="h-3 w-3" /> 1,000+ Trabajos Completados
                </span>
              </motion.div>

              {/* H1 — Bebas Neue */}
              <motion.div
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
              >
                <h1 className="hero-headline text-white mb-1">
                  Electricistas
                </h1>
                <h1 className="hero-headline gradient-text-electric mb-2">
                  de Confianza
                </h1>
                <p
                  className="text-slate-400 text-xl font-semibold mb-8 tracking-wide"
                  style={{ fontFamily: 'var(--font-sub)', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                >
                  El Seibo · Rep. Dom.
                </p>
              </motion.div>

              {/* Response time callout */}
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                className="flex items-center gap-2 mb-4"
              >
                <span className="inline-flex items-center gap-1.5 bg-electric/10 border border-electric/30 text-electric text-sm font-bold px-3 py-1.5 rounded-full" style={{ fontFamily: 'var(--font-sub)' }}>
                  <Zap className="h-3.5 w-3.5" />
                  RESPUESTA EN 15 MINUTOS
                </span>
              </motion.div>

              {/* Body copy */}
              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-400 text-lg leading-relaxed mb-8 max-w-lg"
              >
                Instalaciones, reparaciones y emergencias eléctricas con
                garantía escrita. <span className="text-white font-semibold">Evaluación 100% gratis</span> si contratas.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 }}
                className="flex flex-wrap gap-3 mb-8"
              >
                <Link href="/booking" className="btn-electric text-base !py-4 !px-8">
                  Ver Nuestros Servicios <ArrowRight className="h-5 w-5" />
                </Link>
                <a
                  href="https://wa.me/18095550123?text=Hola,%20necesito%20un%20servicio%20eléctrico"
                  className="btn-whatsapp text-base !py-4 !px-8"
                  target="_blank" rel="noopener noreferrer"
                >
                  <MessageCircle className="h-5 w-5" /> WhatsApp
                </a>
              </motion.div>

              {/* Mobile-only direct call button */}
              <motion.a
                href="tel:+18095550123"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="lg:hidden flex items-center justify-center gap-3 w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 px-6 rounded-xl transition-colors border border-red-400/30"
                style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', letterSpacing: '0.05em' }}
              >
                <Phone className="h-5 w-5" />
                LLAMAR AHORA — EMERGENCIAS 24/7
              </motion.a>

              {/* Trust chips */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.38 }}
                className="flex flex-wrap gap-2"
              >
                {[
                  { icon: <Shield className="h-3.5 w-3.5" />, label: 'Asegurado RD$500k' },
                  { icon: <Zap className="h-3.5 w-3.5" />, label: '15+ Años' },
                  { icon: <CheckCircle className="h-3.5 w-3.5" />, label: 'Licencia CDEEE' },
                  { icon: <Clock className="h-3.5 w-3.5" />, label: '24/7 Emergencias' },
                ].map(b => (
                  <span key={b.label} className="electric-badge-outline">
                    {b.icon} {b.label}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* RIGHT: Photo collage panel */}
            <motion.div
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 80 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* 2x2 photo mosaic */}
                <div className="grid grid-cols-2 gap-3 rounded-2xl overflow-hidden">
                  <div className="rounded-xl overflow-hidden aspect-[4/3] border border-electric/10">
                    <Image src="/41a4fd06-d34c-42a6-b234-46fa1debd1df.jpeg" alt="Instalación residencial" width={280} height={210} className="object-cover w-full h-full hover:scale-105 transition-transform duration-500" priority />
                  </div>
                  <div className="rounded-xl overflow-hidden aspect-[4/3] border border-electric/10 mt-6">
                    <Image src="/4ca1b64b-7b5f-4145-b7de-099d7806492f.jpeg" alt="Panel eléctrico" width={280} height={210} className="object-cover w-full h-full hover:scale-105 transition-transform duration-500" priority />
                  </div>
                  <div className="rounded-xl overflow-hidden aspect-[4/3] border border-electric/10 -mt-6">
                    <Image src="/ae496ec7-f200-41db-9e1d-54aa3de8fccd.jpeg" alt="Cableado profesional" width={280} height={210} className="object-cover w-full h-full hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="rounded-xl overflow-hidden aspect-[4/3] border border-electric/10">
                    <Image src="/cf629f37-1d13-4d7b-8774-7a5ce95bf946.jpeg" alt="Tablero principal" width={280} height={210} className="object-cover w-full h-full hover:scale-105 transition-transform duration-500" />
                  </div>
                </div>
                {/* Floating card: years */}
                <div
                  className="absolute -bottom-6 -left-6 bg-electric text-navy-950 rounded-2xl p-4 shadow-glow-md z-10"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  <p className="text-5xl font-black leading-none">15+</p>
                  <p className="text-sm font-bold uppercase tracking-widest leading-tight">Años de<br />Experiencia</p>
                </div>
                {/* Floating card: rating */}
                <div className="absolute -top-4 -right-4 dark-card !rounded-xl p-3 shadow-card z-10">
                  <div className="flex items-center gap-1 mb-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-electric text-electric" />)}
                  </div>
                  <p className="text-white font-black text-lg leading-none" style={{ fontFamily: 'var(--font-display)' }}>4.9 / 5</p>
                  <p className="text-gray-400 text-xs">200+ Reseñas</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p className="text-gray-500 text-xs uppercase tracking-widest" style={{ fontFamily: 'var(--font-sub)' }}>Explorar</p>
          <ChevronDown className="h-5 w-5 text-electric" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════
          STATS BAR
      ═══════════════════════════════════════ */}
      <section className="section-secondary py-10 border-y border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/5">
            {[
              { value: 1000, suffix: '+', label: 'Clientes Atendidos', icon: '👥' },
              { value: 15,   suffix: ' min', label: 'Respuesta Promedio', icon: '⚡' },
              { value: 49,   suffix: '/5 ★', label: 'Calificación', icon: '⭐', isDecimal: true },
              { value: 15,   suffix: '+ años', label: 'Experiencia', icon: '🏆' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="stat-card !rounded-none !border-0 !border-b-0 py-6"
              >
                <p className="text-2xl mb-2">{stat.icon}</p>
                <p className="stat-number">
                  {stat.isDecimal
                    ? <span>4.9</span>
                    : <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  }
                </p>
                <p className="text-gray-500 text-sm mt-1 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          WORK PHOTOS STRIP
      ═══════════════════════════════════════ */}
      <section className="section-primary py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="electric-badge mb-3 inline-flex">📸 Portafolio</span>
              <h2 className="section-headline text-white">Nuestros Trabajos</h2>
            </div>
            <Link href="/gallery" className="btn-outline-electric whitespace-nowrap">
              Ver Galería <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-navy-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-navy-950 to-transparent z-10 pointer-events-none" />

          <div className="flex gap-4 overflow-x-auto pb-3 px-4 lg:px-8" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {workPhotos.map((photo, i) => (
              <Link
                key={i}
                href="/gallery"
                className="flex-shrink-0 group relative rounded-2xl overflow-hidden border border-white/5 hover:border-electric/40 transition-all"
                style={{ width: '260px', height: '185px' }}
              >
                <Image
                  src={photo.src}
                  alt={photo.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-106"
                  sizes="260px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-xs font-bold uppercase tracking-wide" style={{ fontFamily: 'var(--font-sub)' }}>
                    {photo.title}
                  </p>
                  <span className="electric-badge text-xs mt-1">{photo.category}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SERVICES SECTION
      ═══════════════════════════════════════ */}
      <section id="servicios" className="section-secondary py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="electric-badge mb-4 inline-flex"><Zap className="h-3 w-3" /> Servicios</span>
            <h2 className="section-headline text-white mb-4">¿Qué necesitas hoy?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Selecciona tu servicio y agenda en <span className="text-electric font-semibold">menos de 2 minutos</span>.
              Evaluación GRATIS si contratas.
            </p>
          </div>

          {/* Active services */}
          <div className="bento-grid mb-10">
            {services.filter(s => s.status === 'active').map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <ServiceCard service={service} onSelect={handleServiceSelect} />
              </motion.div>
            ))}
          </div>

          {/* Coming soon */}
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-gray-500 text-sm font-bold uppercase tracking-widest" style={{ fontFamily: 'var(--font-sub)' }}>
                Próximamente
              </span>
              <div className="flex-1 h-px bg-white/5" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {services.filter(s => s.status === 'coming_soon').map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <ServiceCard service={service} onSelect={handleServiceSelect} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TRUST STRIP
      ═══════════════════════════════════════ */}
      <section className="section-primary py-8 border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: '🏛️', label: 'Licencia CDEEE Verificada' },
              { icon: '🛡️', label: 'Seguro Responsabilidad Civil' },
              { icon: '⭐', label: '4.9/5 – 200+ Reseñas' },
              { icon: '⚡', label: '15+ Años Experiencia' },
              { icon: '✅', label: 'Garantía Escrita 30 Días' },
              { icon: '📞', label: 'Soporte 24/7' },
            ].map(t => (
              <div key={t.label} className="trust-badge">
                <span>{t.icon}</span> {t.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          ABOUT NENO
      ═══════════════════════════════════════ */}
      <section id="nosotros" className="section-secondary py-24 relative overflow-hidden">
        {/* background accent */}
        <div className="section-glow" style={{ width: '600px', height: '600px', top: '-100px', right: '-100px' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: Photo */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden border-2 border-electric/25 electric-glow-ring">
                {/* Photo mosaic representing Neno's work */}
                <div className="grid grid-cols-2 gap-0.5 bg-navy-700">
                  <Image src="/7108a911-e716-4416-a620-97be93f4c140.jpeg" alt="Trabajo de Neno" width={280} height={320} className="object-cover w-full h-64" />
                  <Image src="/b420cfaa-cec4-47a5-a363-d8bebabcef4d.jpeg" alt="Instalación eléctrica" width={280} height={320} className="object-cover w-full h-64" />
                  <Image src="/cf856cdc-a1e1-40ef-b079-eeab55418c17.jpeg" alt="Panel eléctrico" width={280} height={320} className="object-cover w-full h-48 col-span-2" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent" />
              </div>

              {/* Credential bar on photo */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="dark-card p-3 !rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 bg-electric rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="h-4 w-4 text-navy-950" />
                  </div>
                  <div>
                    <p className="text-electric text-xs font-bold uppercase tracking-wide" style={{ fontFamily: 'var(--font-sub)' }}>
                      Verificado CDEEE
                    </p>
                    <p className="text-gray-400 text-xs">Licencia #ES-2024-001</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Copy */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <span className="electric-badge">👷 El Especialista</span>

              <h2 className="section-headline text-white">
                Neno Báez,<br />
                <span className="gradient-text-electric">Tu Electricista</span>
              </h2>

              <p className="text-gray-400 leading-relaxed text-lg">
                Con más de <span className="text-white font-semibold">15 años de experiencia</span> en El Seibo y la región Este,
                Neno Báez es el electricista de confianza de cientos de hogares y negocios.
              </p>

              <p className="text-gray-400 leading-relaxed">
                Cada trabajo viene respaldado por <span className="text-electric font-semibold">garantía escrita</span>,
                precios transparentes y atención personalizada. Sin sorpresas. Sin letra pequeña.
              </p>

              {/* Credential pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                {['Licencia CDEEE', 'Asegurado RD$500k', '1,000+ Proyectos', '24/7 Disponible'].map(c => (
                  <span key={c} className="electric-badge-outline">{c}</span>
                ))}
              </div>

              {/* Mini stats row */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { n: '1,000+', l: 'Proyectos' },
                  { n: '4.9★', l: 'Calificación' },
                  { n: '30 días', l: 'Garantía' },
                ].map(s => (
                  <div key={s.l} className="dark-card-accent p-3 text-center">
                    <p className="text-electric font-black text-xl" style={{ fontFamily: 'var(--font-display)' }}>{s.n}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{s.l}</p>
                  </div>
                ))}
              </div>

              <Link href="/booking" className="btn-electric inline-flex mt-2">
                Reservar con Neno <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════ */}
      <section className="section-primary py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="electric-badge mb-4 inline-flex">⚡ Proceso</span>
            <h2 className="section-headline text-white">Así de simple</h2>
            <p className="text-gray-400 mt-3 text-lg">3 pasos, sin complicaciones</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* connector lines desktop */}
            <div className="hidden md:block absolute top-14 left-[calc(16.66%+1.75rem)] right-[calc(16.66%+1.75rem)] h-0.5 bg-gradient-to-r from-electric/50 via-electric/20 to-electric/50" />

            {[
              {
                num: '1',
                icon: <Calendar className="h-7 w-7" />,
                title: 'Contacta a Neno',
                sub: 'Llama o escribe por WhatsApp',
                desc: 'Selecciona tu servicio y llámanos o escríbenos. Te respondemos en minutos y coordinamos tu visita.',
              },
              {
                num: '2',
                icon: <MapPin className="h-7 w-7" />,
                title: 'Neno Llega',
                sub: 'Puntual, con equipo completo',
                desc: 'Confirmación por WhatsApp. Llegamos en la ventana acordada, con todo el equipo necesario.',
              },
              {
                num: '3',
                icon: <ShieldCheck className="h-7 w-7" />,
                title: 'Trabajo Garantizado',
                sub: 'Sin sorpresas en el precio',
                desc: 'Cotización antes de comenzar. Pagas solo lo acordado. Garantía escrita de 30 días.',
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="dark-card p-8 text-center relative"
              >
                {/* Step number circle */}
                <div className="process-step-number mx-auto mb-5">{step.num}</div>
                {/* Icon box */}
                <div className="w-14 h-14 bg-electric/10 border border-electric/20 rounded-2xl flex items-center justify-center mx-auto mb-5 text-electric">
                  {step.icon}
                </div>
                <h3
                  className="text-xl font-black text-white mb-1 uppercase tracking-tight"
                  style={{ fontFamily: 'var(--font-sub)' }}
                >
                  {step.title}
                </h3>
                <p className="text-electric text-xs font-bold uppercase tracking-wider mb-3" style={{ fontFamily: 'var(--font-sub)' }}>
                  {step.sub}
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SERVICE AREA
      ═══════════════════════════════════════ */}
      <ServiceAreaMap />

      {/* ═══════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════ */}
      <TestimonialsSection />

      {/* ═══════════════════════════════════════
          FAQ
      ═══════════════════════════════════════ */}
      <section className="section-secondary py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="electric-badge mb-4 inline-flex">❓ FAQ</span>
            <h2 className="section-headline text-white mb-3">Preguntas Frecuentes</h2>
            <p className="text-gray-400 text-lg">Todo lo que necesitas saber antes de reservar</p>
          </div>
          <FAQAccordion />
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════ */}
      <section id="contacto" className="section-primary py-28 relative overflow-hidden">
        {/* Giant yellow radial behind */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(234,179,8,0.1) 0%, transparent 70%)',
          }}
        />
        {/* Circuit grid */}
        <div className="circuit-overlay opacity-40" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="electric-badge mb-6 inline-flex">⚡ Listo para Ayudarte</span>

            <h2 className="hero-headline text-white mb-2">¿Tienes un</h2>
            <h2 className="hero-headline gradient-text-electric mb-8">problema eléctrico?</h2>

            <p className="text-gray-400 text-xl mb-10 font-medium">
              Sin compromiso &nbsp;•&nbsp; Evaluación GRATIS &nbsp;•&nbsp; Respuesta en 15 minutos
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/booking" className="btn-electric text-base !py-4 !px-10">
                Ver Nuestros Servicios <ArrowRight className="h-5 w-5" />
              </Link>
              <a href="tel:+18095550123" className="btn-emergency text-base !py-4 !px-10">
                <Phone className="h-5 w-5" /> Emergencia – Llamar Ahora
              </a>
            </div>

            {/* Large phone display */}
            <a
              href="tel:+18095550123"
              className="inline-flex items-center gap-3 group"
            >
              <div className="w-12 h-12 bg-electric/10 border border-electric/30 rounded-full flex items-center justify-center group-hover:bg-electric/20 transition-all">
                <Phone className="h-5 w-5 text-electric" />
              </div>
              <span
                className="text-electric text-3xl font-black"
                style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}
              >
                (809) 555-0123
              </span>
            </a>
            <p className="text-gray-500 text-sm mt-2">Emergencias disponibles 24 horas, 7 días a la semana</p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          ELEVENLABS + FOOTER
      ═══════════════════════════════════════ */}
      <ElevenLabsWidget />
      <Footer />
      <WhatsAppButton />

      {/* Modals */}
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} defaultTab={authMode} />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  )
}
