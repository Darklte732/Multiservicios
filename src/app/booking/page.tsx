'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Zap, Star, Shield, Clock, CheckCircle,
  ArrowRight, Eye, Phone, MapPin
} from 'lucide-react'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'
import { capture } from '@/lib/analytics'
import Link from 'next/link'
import Image from 'next/image'
import { ImageLightbox } from '@/components/ui/ImageLightbox'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'

// ─── Service data ────────────────────────────
const bookingServices = [
  {
    id: 'emergencia',
    name: 'Emergencia Eléctrica',
    description: 'Atención inmediata 24/7. Cortocircuitos, apagones y fallas críticas en menos de 30 minutos.',
    icon: '🚨',
    priority: 'EMERGENCIA',
    priorityColor: 'bg-red-500',
    borderColor: 'border-red-500/30',
    responseTime: '< 30 min',
    rating: 4.9,
    isEmergency: true,
    images: [
      '/2394664b-563a-48aa-900e-7ff62152b422.jpeg',
      '/cf629f37-1d13-4d7b-8774-7a5ce95bf946.jpeg',
      '/db2d6452-ebcc-4f8a-8588-9df01d849b74.jpeg',
    ],
    badges: ['Disponible 24/7', 'Garantía 15 días', 'Respuesta Inmediata'],
    included: [
      'Atención inmediata las 24 horas, todos los días',
      'Estabilización del sistema eléctrico',
      'Diagnóstico de la falla crítica',
      'Reparación de emergencia',
      'Garantía de 15 días en el trabajo realizado',
    ],
  },
  {
    id: 'instalacion',
    name: 'Instalación Eléctrica',
    description: 'Instalaciones nuevas, paneles, conexiones y cableado profesional.',
    icon: '🔌',
    priority: 'ESTÁNDAR',
    priorityColor: 'bg-blue-500',
    borderColor: 'border-blue-500/30',
    responseTime: '< 2 horas',
    rating: 4.8,
    isEmergency: false,
    images: [
      '/41a4fd06-d34c-42a6-b234-46fa1debd1df.jpeg',
      '/43a0a5cf-6fea-49e8-b174-7382d6ebfa5d.jpeg',
      '/6bb20545-9b5b-43f9-b5f8-d7bbb4bcbd5b.jpeg',
    ],
    badges: ['Técnicos Certificados', 'Garantía 90 días', 'Materiales Premium'],
    included: [
      'Visita técnica y evaluación del sitio',
      'Análisis técnico completo del proyecto',
      'Medición y planificación de la instalación',
      'Cotización detallada de materiales y mano de obra',
      'Garantía de 90 días en el trabajo completado',
    ],
  },
  {
    id: 'mantenimiento',
    name: 'Mantenimiento Eléctrico',
    description: 'Revisión periódica de tu sistema eléctrico para prevenir fallas.',
    icon: '🔧',
    priority: 'PREVENTIVO',
    priorityColor: 'bg-green-500',
    borderColor: 'border-green-500/30',
    responseTime: '< 4 horas',
    rating: 4.7,
    isEmergency: false,
    images: [
      '/7108a911-e716-4416-a620-97be93f4c140.jpeg',
      '/7c810f87-294b-4352-a3f6-7b9ace4d39c3.jpeg',
      '/b420cfaa-cec4-47a5-a363-d8bebabcef4d.jpeg',
    ],
    badges: ['Inspección Completa', '20% Descuento', 'Prevención Total'],
    included: [
      'Inspección completa del sistema eléctrico',
      'Limpieza de breakers durante inspección',
      'Pruebas de seguridad y funcionamiento',
      'Reporte detallado del estado de tu instalación',
      'Garantía de 60 días en servicios realizados',
    ],
  },
  {
    id: 'reparacion',
    name: 'Reparación Eléctrica',
    description: 'Diagnóstico y reparación de fallas eléctricas en hogares y locales. Respuesta el mismo día.',
    icon: '⚡',
    priority: 'URGENTE',
    priorityColor: 'bg-purple-500',
    borderColor: 'border-purple-500/30',
    responseTime: '< 3 horas',
    rating: 4.8,
    isEmergency: false,
    images: [
      '/2394664b-563a-48aa-900e-7ff62152b422.jpeg',
      '/cf629f37-1d13-4d7b-8774-7a5ce95bf946.jpeg',
      '/cf856cdc-a1e1-40ef-b079-eeab55418c17.jpeg',
      '/db2d6452-ebcc-4f8a-8588-9df01d849b74.jpeg',
    ],
    badges: ['Diagnóstico Avanzado', 'Garantía 45 días', 'Reparación Experta'],
    included: [
      'Visita técnica con equipo de diagnóstico avanzado',
      'Identificación precisa de la falla eléctrica',
      'Evaluación de daños y causas del problema',
      'Cotización clara de la reparación necesaria',
      'Garantía de 45 días en la reparación',
    ],
  },
]

// ─── Portfolio images ────────────────────────
const portfolioImages = [
  { src: '/41a4fd06-d34c-42a6-b234-46fa1debd1df.jpeg', title: 'Instalación Moderna', category: 'Residencial' },
  { src: '/4ca1b64b-7b5f-4145-b7de-099d7806492f.jpeg', title: 'Panel Industrial', category: 'Comercial' },
  { src: '/ae496ec7-f200-41db-9e1d-54aa3de8fccd.jpeg', title: 'Cableado Completo', category: 'Industrial' },
  { src: '/2394664b-563a-48aa-900e-7ff62152b422.jpeg', title: 'Sistema de Respaldo', category: 'Reparación' },
  { src: '/43a0a5cf-6fea-49e8-b174-7382d6ebfa5d.jpeg', title: 'Iluminación LED', category: 'Eficiente' },
  { src: '/6bb20545-9b5b-43f9-b5f8-d7bbb4bcbd5b.jpeg', title: 'Mantenimiento', category: 'Preventivo' },
  { src: '/7108a911-e716-4416-a620-97be93f4c140.jpeg', title: 'Reparación Pro', category: 'Especializada' },
  { src: '/7c810f87-294b-4352-a3f6-7b9ace4d39c3.jpeg', title: 'Instalación Total', category: 'Completa' },
]

// ─── Service card ────────────────────────────
const ServiceCard = ({
  service,
  onSelect,
}: {
  service: typeof bookingServices[0]
  onSelect: (id: string) => void
}) => {
  const [imgIdx, setImgIdx] = useState(0)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (!hovered) return
    const interval = setInterval(() => {
      setImgIdx(i => (i + 1) % service.images.length)
    }, 1500)
    return () => clearInterval(interval)
  }, [hovered, service.images.length])

  return (
    <motion.div
      className="service-card-dark cursor-pointer"
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.97 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onSelect(service.id)}
    >
      {/* Priority badge */}
      <div className={`absolute top-4 right-4 ${service.priorityColor} text-white text-xs font-bold px-2 py-0.5 rounded-full z-20`}>
        {service.priority}
      </div>

      {/* Image carousel */}
      <div className="aspect-video rounded-xl overflow-hidden mb-4 relative bg-navy-600">
        <AnimatePresence mode="wait">
          <motion.img
            key={`${service.id}-${imgIdx}`}
            src={service.images[imgIdx]}
            alt={service.name}
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          />
        </AnimatePresence>
        <div className="absolute bottom-2 right-2 flex gap-1">
          {service.images.map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIdx ? 'bg-electric scale-125' : 'bg-white/40'}`} />
          ))}
        </div>
        {hovered && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
            <Eye className="h-3 w-3 text-white" />
            <span className="text-xs text-white">{imgIdx + 1}/{service.images.length}</span>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 bg-electric/10">
          {service.icon}
        </div>
        <div>
          <h3 className="font-bold text-white text-lg leading-tight">{service.name}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <Star className="h-3 w-3 fill-electric text-electric" />
            <span className="text-electric text-xs font-bold">{service.rating}</span>
            <span className="text-gray-500 text-xs">•</span>
            <Clock className="h-3 w-3 text-gray-500" />
            <span className="text-gray-500 text-xs">{service.responseTime}</span>
          </div>
        </div>
      </div>

      <p className="text-gray-400 text-sm leading-relaxed mb-3">{service.description}</p>

      {/* Availability indicator */}
      <div className="flex items-center gap-1.5 text-xs mb-4 text-green-400">
        <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-green-400" />
        <span className="font-semibold uppercase tracking-wide">
          Disponible hoy — llama para coordinar
        </span>
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {service.badges.map(badge => (
          <span key={badge} className="electric-badge-outline text-xs">{badge}</span>
        ))}
      </div>

      {/* CTA */}
      <div className="flex items-center justify-end pt-2 border-t border-white/5">
        <button className="btn-electric text-sm !py-2 !px-4">
          Ver cómo contactar
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  )
}

// ─── MAIN PAGE ───────────────────────────────
function BookingPageContent() {
  const searchParams = useSearchParams()
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [lightbox, setLightbox] = useState({ isOpen: false, currentIndex: 0 })

  // Pre-select service from ?service= query param (handoff from home redesign)
  useEffect(() => {
    const serviceParam = searchParams.get('service')
    if (!serviceParam) return
    const match = bookingServices.find(s => s.id === serviceParam)
    if (match) setSelectedService(match.id)
  }, [searchParams])

  const selected = bookingServices.find(s => s.id === selectedService)
  const urgencyParam = searchParams.get('urgency') // 'now' | '24h' | 'week' | null
  const phoneParam = searchParams.get('phone') ?? ''

  // Build WhatsApp prefilled message — incorporates the urgency + phone the
  // visitor entered in the home-page quote form so Neno gets full context.
  const buildWhatsAppHref = (serviceName: string) => {
    const urgencyText =
      urgencyParam === 'now'  ? ' (lo necesito hoy mismo)'   :
      urgencyParam === '24h'  ? ' (en las próximas 24 horas)' :
      urgencyParam === 'week' ? ' (esta semana)'              : ''
    const phoneText = phoneParam.trim() ? ` Mi número es ${phoneParam.trim()}.` : ''
    const msg = `¡Hola Neno! Vi tu sitio web y necesito un servicio de ${serviceName}${urgencyText}.${phoneText} ¿Está disponible?`
    return `https://wa.me/18092514329?text=${encodeURIComponent(msg)}`
  }

  const openLightbox = (index: number) => setLightbox({ isOpen: true, currentIndex: index })
  const closeLightbox = () => setLightbox(prev => ({ ...prev, isOpen: false }))
  const navigateLightbox = (dir: 'prev' | 'next') => {
    setLightbox(prev => ({
      ...prev,
      currentIndex: dir === 'prev'
        ? (prev.currentIndex - 1 + portfolioImages.length) % portfolioImages.length
        : (prev.currentIndex + 1) % portfolioImages.length,
    }))
  }

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      {/* Header */}
      <motion.header
        className="dark-nav sticky top-0 z-40"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {selectedService ? (
              <button
                onClick={() => setSelectedService(null)}
                className="flex items-center gap-2 text-electric hover:text-electric-bright transition-colors font-medium"
              >
                <ArrowLeft className="h-5 w-5" />
                Ver todos los servicios
              </button>
            ) : (
              <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-electric transition-colors font-medium">
                <ArrowLeft className="h-5 w-5" />
                Volver al Inicio
              </Link>
            )}

            <div className="flex items-center gap-3">
              <div className="p-2 bg-navy-700 rounded-xl shadow-glow-sm">
                <Zap className="h-5 w-5 text-electric" />
              </div>
              <div className="hidden sm:block">
                <h1
                  className="text-2xl font-black text-white leading-none"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Multi<span className="text-electric">Servicios</span>
                </h1>
                <p className="text-xs text-gray-500">El Seibo, Rep. Dom.</p>
              </div>
            </div>

            <a
              href="tel:+18092514329"
              onClick={() => capture('phone_clicked', { surface: 'booking_header' })}
              className="btn-electric text-sm !py-2 !px-3 sm:!px-4"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Llamar a Neno</span>
              <span className="sm:hidden">Llamar</span>
            </a>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <AnimatePresence mode="wait">

          {/* ── STEP 1: Service selection ── */}
          {!selectedService && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4 }}
              className="space-y-12"
            >
              {/* Header */}
              <div className="text-center">
                <span className="electric-badge mb-6 inline-flex">
                  <CheckCircle className="h-3 w-3" />
                  Evaluación GRATIS • Sin compromiso
                </span>
                <h1
                  className="text-6xl md:text-7xl font-black mb-4 leading-none tracking-tight"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  ¿Qué Servicio<br />
                  <span className="gradient-text-electric">Necesitas Hoy?</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  Selecciona el servicio y te mostramos cómo contactarnos directamente.
                  <br />
                  <strong className="text-electric">Respuesta garantizada en menos de 15 minutos.</strong>
                </p>

                {/* Trust stats */}
                <div className="mt-8 dark-card p-5 rounded-2xl max-w-2xl mx-auto">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    {[
                      { val: '4.9', label: 'Calificación', color: 'text-electric' },
                      { val: '< 15min', label: 'Respuesta', color: 'text-green-400' },
                      { val: '1,000+', label: 'Clientes', color: 'text-blue-400' },
                      { val: '15+', label: 'Años exp.', color: 'text-purple-400' },
                    ].map(s => (
                      <div key={s.label}>
                        <div className={`text-2xl font-black ${s.color}`}>{s.val}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* How it works — micro-process */}
              <div className="dark-card p-6 rounded-2xl max-w-3xl mx-auto">
                <p className="text-center text-xs text-gray-500 font-semibold uppercase tracking-widest mb-5">
                  ¿Cómo funciona?
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { num: '1', icon: '📋', label: 'Selecciona tu servicio', sub: 'Elige lo que necesitas abajo' },
                    { num: '2', icon: '📞', label: 'Llama o escribe', sub: 'Te atendemos en minutos' },
                    { num: '3', icon: '⚡', label: 'Neno llega hoy', sub: 'Con garantía incluida' },
                  ].map(step => (
                    <div key={step.num} className="flex flex-col items-center gap-2">
                      <div className="process-step-number">{step.num}</div>
                      <span className="text-xl">{step.icon}</span>
                      <p className="text-white text-xs font-semibold leading-tight">{step.label}</p>
                      <p className="text-gray-500 text-xs">{step.sub}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service cards */}
              <div className="bento-grid">
                {bookingServices.map((service, i) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                  >
                    <ServiceCard
                      service={service}
                      onSelect={(id) => {
                        capture('booking_service_selected', { service: id })
                        setSelectedService(id)
                      }}
                    />
                  </motion.div>
                ))}
              </div>

              {/* WhatsApp quick contact strip */}
              <div className="dark-card p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-white font-bold">¿Prefieres WhatsApp?</p>
                  <p className="text-gray-400 text-sm">Escríbenos y coordinamos tu cita al instante</p>
                </div>
                <a
                  href={`https://wa.me/18092514329?text=${encodeURIComponent('¡Hola Neno! Vi tu sitio web y me gustaría más información sobre tus servicios eléctricos. ¿Está disponible?')}`}
                  onClick={() => capture('whatsapp_clicked', { surface: 'booking_quick_strip' })}
                  className="btn-whatsapp flex-shrink-0"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Escribir por WhatsApp
                </a>
              </div>

              {/* Portfolio strip */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="electric-badge mb-1 inline-flex">📸 Portafolio</span>
                    <h2
                      className="text-4xl font-black text-white leading-none"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      Trabajos Recientes
                    </h2>
                  </div>
                  <Link href="/gallery" className="btn-outline-electric text-sm">
                    Ver Todo
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {portfolioImages.map((img, i) => (
                    <motion.div
                      key={i}
                      className="group relative rounded-xl overflow-hidden aspect-square cursor-pointer dark-card !p-0"
                      whileHover={{ y: -4 }}
                      onClick={() => openLightbox(i)}
                    >
                      <Image
                        src={img.src}
                        alt={img.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-2 left-2 right-2 translate-y-full group-hover:translate-y-0 transition-transform">
                        <p className="text-white text-xs font-semibold truncate">{img.title}</p>
                        <span className="electric-badge text-xs">{img.category}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Contact CTA */}
              <div className="bg-electric/5 border border-electric/20 rounded-2xl p-6 text-center">
                <h3 className="text-xl font-bold text-white mb-2">⚡ ¿Listo para coordinar?</h3>
                <p className="text-gray-400 mb-4">Llama o escríbenos — Neno te atiende directamente</p>
                <a
                  href="tel:+18092514329"
                  onClick={() => capture('phone_clicked', { surface: 'booking_contact_cta' })}
                  className="btn-electric inline-flex mb-4"
                >
                  <Phone className="h-5 w-5" />
                  Llamar: +1 (809) 251-4329
                </a>
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500 flex-wrap">
                  <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-electric text-electric" /> 4.9/5 en 200+ reseñas</span>
                  <span>•</span>
                  <span>Evaluación GRATIS</span>
                  <span>•</span>
                  <span>Licencia CDEEE</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: Call to book ── */}
          {selectedService && selected && (
            <motion.div
              key="call-to-book"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto space-y-6"
            >
              {/* Service selected badge */}
              <div className="text-center">
                {urgencyParam === 'now' && (
                  <span className="inline-flex items-center gap-1.5 mb-3 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-extrabold tracking-[0.12em] uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                    URGENTE — Hoy mismo
                  </span>
                )}
                <span className="electric-badge mb-4 inline-flex">
                  <CheckCircle className="h-3 w-3" />
                  Servicio seleccionado
                </span>
                <h2
                  className="text-5xl md:text-6xl font-black mb-3 leading-none"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {selected.icon} {selected.name}
                </h2>
                <p className="text-gray-400">{selected.description}</p>
              </div>

              {/* Main call CTA */}
              <motion.div
                className={`dark-card p-8 border ${selected.borderColor} text-center`}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5 bg-electric/10">
                  {selected.icon}
                </div>

                <h3
                  className="text-3xl font-black text-white mb-2"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Llama para Reservar
                </h3>
                <p className="text-gray-400 mb-6">
                  Neno te atiende personalmente y coordina tu cita de inmediato.
                </p>

                {/* Availability */}
                <div className="flex items-center justify-center gap-2 mb-6 text-sm font-semibold text-green-400">
                  <span className="w-2 h-2 rounded-full animate-pulse bg-green-400" />
                  Disponible hoy — agenda tu visita
                </div>

                <a
                  href="tel:+18092514329"
                  onClick={() => capture('phone_clicked', { surface: 'booking_call_to_book', service: selected.id })}
                  className="btn-electric w-full justify-center text-lg !py-4 mb-4"
                  style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem' }}
                >
                  <Phone className="h-6 w-6" />
                  +1 (809) 251-4329
                </a>

                <p className="text-xs text-gray-500">
                  Lunes a sábado · 8am–6pm · Respuesta garantizada
                </p>
              </motion.div>

              {/* WhatsApp alternative */}
              <motion.div
                className="dark-card p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <p className="text-gray-400 text-sm mb-4">¿Prefieres coordinar por WhatsApp?</p>
                <a
                  href={buildWhatsAppHref(selected.name)}
                  onClick={() => capture('whatsapp_clicked', {
                    surface: 'booking_call_to_book',
                    service: selected.id,
                    urgency: urgencyParam,
                    phone_provided: phoneParam.trim().length > 0,
                  })}
                  className="btn-whatsapp inline-flex"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Escribir por WhatsApp
                </a>
              </motion.div>

              {/* What's included */}
              <motion.div
                className="dark-card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32 }}
              >
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-4">
                  Qué incluye este servicio:
                </p>
                <div className="space-y-2.5">
                  {selected.included.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <CheckCircle className="h-4 w-4 text-electric mt-0.5 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Trust + location */}
              <motion.div
                className="grid grid-cols-3 gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {[
                  { icon: <Shield className="h-5 w-5 text-electric" />, label: 'Licencia CDEEE' },
                  { icon: <Star className="h-5 w-5 text-electric" />, label: 'Garantía incluida' },
                  { icon: <MapPin className="h-5 w-5 text-electric" />, label: 'El Seibo y alrededores' },
                ].map(({ icon, label }) => (
                  <div key={label} className="dark-card p-3 flex flex-col items-center gap-2 text-center">
                    {icon}
                    <span className="text-xs text-gray-400">{label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Lightbox */}
      <ImageLightbox
        isOpen={lightbox.isOpen}
        onClose={closeLightbox}
        imageSrc={portfolioImages[lightbox.currentIndex]?.src || ''}
        imageTitle={portfolioImages[lightbox.currentIndex]?.title || ''}
        imageCategory={portfolioImages[lightbox.currentIndex]?.category || ''}
        images={portfolioImages}
        currentIndex={lightbox.currentIndex}
        onNavigate={navigateLightbox}
      />

      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-navy-950 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-electric" />
            <p className="mt-3 text-electric">Cargando...</p>
          </div>
        </div>
      }
    >
      <BookingPageContent />
    </Suspense>
  )
}
