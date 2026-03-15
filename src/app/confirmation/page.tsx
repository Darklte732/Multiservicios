'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Calendar, Phone, ArrowRight, MessageCircle, Star, Award, Shield } from 'lucide-react'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'

// ─── Confetti ───────────────────────────────
const ConfettiAnimation = () => {
  const [show, setShow] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 3500)
    return () => clearTimeout(t)
  }, [])
  if (!show) return null

  const colors = ['#EAB308', '#FFFFFF', '#25D366', '#EF4444', '#F5C518']

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(60)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-10px`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
            transform: `translateY(100vh) rotate(${Math.random() * 360}deg)`,
          }}
        >
          <div
            className="w-2 h-2 rounded-sm"
            style={{ backgroundColor: colors[Math.floor(Math.random() * colors.length)] }}
          />
        </div>
      ))}
    </div>
  )
}

// ─── Testimonials ────────────────────────────
const testimonials = [
  {
    name: 'María González',
    rating: 5,
    text: 'Excelente servicio. Neno llegó puntual y resolvió el problema en menos de 2 horas. Muy profesional.',
    service: 'Reparación de Emergencia',
    location: 'El Seibo',
  },
  {
    name: 'Carlos Rodríguez',
    rating: 5,
    text: 'Instalación perfecta de mi panel eléctrico. Trabajo limpio, explicó todo el proceso. 100% recomendado.',
    service: 'Instalación Eléctrica',
    location: 'Hato Mayor',
  },
  {
    name: 'Ana Pérez',
    rating: 5,
    text: 'Servicio excepcional. Muy honesto con los precios y la calidad del trabajo es de primera.',
    service: 'Mantenimiento Preventivo',
    location: 'Miches',
  },
]

// ─── Service config ──────────────────────────
const serviceConfig = {
  emergencia: { name: 'Emergencia Eléctrica', icon: '🚨', fee: '4,000 - 8,000', description: 'Atención inmediata 24/7' },
  instalacion: { name: 'Instalación Eléctrica', icon: '🔌', fee: '3,000 - 6,000', description: 'Instalaciones nuevas y conexiones' },
  mantenimiento: { name: 'Mantenimiento Eléctrico', icon: '🔧', fee: '3,000 - 5,000', description: 'Mantenimiento preventivo' },
  reparacion: { name: 'Reparación Eléctrica', icon: '⚡', fee: '3,000 - 7,000', description: 'Reparación de fallas' },
}

// ─── Main content ────────────────────────────
function ConfirmationContent() {
  const searchParams = useSearchParams()
  const [booking, setBooking] = useState({
    service: 'Instalación Eléctrica',
    serviceKey: 'instalacion',
    evaluationFee: 'RD$ 3,000',
    icon: '🔌',
    technician: 'Neno Báez',
    date: 'Fecha por confirmar',
    time: 'Hora por confirmar',
    customerName: 'Cliente',
    customerEmail: '',
  })

  useEffect(() => {
    const eventTypeName = searchParams.get('event_type_name') || searchParams.get('event') || 'Instalación Eléctrica'
    const inviteeName = searchParams.get('invitee') || 'Cliente'
    const inviteeEmail = searchParams.get('invitee_email') || ''
    const eventStartTime = searchParams.get('event_start_time') || searchParams.get('start_time')
    const eventEndTime = searchParams.get('event_end_time') || searchParams.get('end_time')

    let serviceKey = 'instalacion'
    if (eventTypeName.toLowerCase().includes('emergencia')) serviceKey = 'emergencia'
    else if (eventTypeName.toLowerCase().includes('reparacion')) serviceKey = 'reparacion'
    else if (eventTypeName.toLowerCase().includes('mantenimiento')) serviceKey = 'mantenimiento'

    const info = serviceConfig[serviceKey as keyof typeof serviceConfig] || serviceConfig.instalacion

    let formattedDate = 'Fecha por confirmar'
    let formattedTime = 'Hora por confirmar'

    if (eventStartTime) {
      try {
        const start = new Date(eventStartTime)
        const end = eventEndTime ? new Date(eventEndTime) : new Date(start.getTime() + 2 * 60 * 60 * 1000)
        formattedDate = start.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        formattedTime = `${start.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true })} - ${end.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true })}`
      } catch { /* ignore */ }
    }

    setBooking({
      service: info.name,
      serviceKey,
      evaluationFee: `RD$ ${info.fee.split(' - ')[0]}`,
      icon: info.icon,
      technician: 'Neno Báez',
      date: formattedDate,
      time: formattedTime,
      customerName: inviteeName,
      customerEmail: inviteeEmail,
    })
  }, [searchParams])

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      <ConfettiAnimation />

      {/* Header */}
      <div className="dark-nav border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/booking" className="flex items-center gap-2 text-electric hover:text-electric-bright transition-colors font-medium">
              ← Volver a Servicios
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-2xl text-electric animate-pulse">✓</span>
              <span
                className="text-2xl font-black leading-none"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Multi<span className="text-electric">Servicios</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-navy-900 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-400 font-medium">Etapa 3 de 5: Cita Confirmada</span>
            <span className="text-electric font-bold">60% completado ✨</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: '60%' }} />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span className="text-electric">✅ Servicio</span>
            <span className="text-electric">✅ Horario</span>
            <span className="text-electric font-bold">✅ Confirmado</span>
            <span>⏳ En camino</span>
            <span>⏳ Completado</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-electric/10 border-2 border-electric/40 mb-6 shadow-glow-md animate-pulse">
            <CheckCircle className="w-12 h-12 text-electric" />
          </div>
          <h1
            className="text-6xl md:text-7xl font-black mb-4 leading-none tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            🎉 ¡Reserva Confirmada{booking.customerName !== 'Cliente' ? `, ${booking.customerName}` : ''}!
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Tu cita de <strong className="text-electric">{booking.service}</strong> ha sido programada.
            Recibirás confirmación por <strong className="text-green-400">WhatsApp y email</strong>.
          </p>

          {/* Quick stats */}
          <div className="flex justify-center gap-10 mt-8">
            {[
              { value: '15+', label: 'Años experiencia', color: 'text-electric' },
              { value: '99%', label: 'Satisfacción', color: 'text-green-400' },
              { value: '24/7', label: 'Disponibilidad', color: 'text-blue-400' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className={`font-black text-2xl ${s.color}`}>{s.value}</div>
                <div className="text-gray-500 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp CTA */}
        <div className="bg-green-900/30 border border-green-500/30 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h3 className="text-xl font-bold mb-1">💬 ¿Tienes alguna pregunta?</h3>
              <p className="text-green-400 text-sm">Contacta a Neno directamente por WhatsApp</p>
            </div>
            <a
              href={`https://wa.me/18095550123?text=Hola! Tengo una cita confirmada para ${booking.service} el ${booking.date}.`}
              className="btn-whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-5 h-5" />
              Contactar Ahora
            </a>
          </div>
        </div>

        {/* Booking details card */}
        <div className="dark-card p-8 mb-6">
          <div className="text-center mb-6">
            <span className="electric-badge text-sm">📋 Detalles de tu Cita</span>
          </div>

          <div className="space-y-4">
            {/* Service */}
            <div className="flex items-center gap-4 p-5 bg-navy-700 rounded-xl border border-white/5">
              <div className="w-14 h-14 bg-navy-600 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                {booking.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg">{booking.service}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="electric-badge-outline text-xs">Evaluación: {booking.evaluationFee}</span>
                  <span className="text-xs bg-green-900/40 text-green-400 border border-green-500/30 px-3 py-1 rounded-full">
                    🎉 GRATIS si contratas el servicio
                  </span>
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-center gap-4 p-5 bg-navy-700 rounded-xl border border-white/5">
              <div className="p-3 bg-electric/10 rounded-full flex-shrink-0">
                <Calendar className="w-6 h-6 text-electric" />
              </div>
              <div>
                <h3 className="font-bold text-white">Fecha y Hora Confirmada</h3>
                <p className="text-electric font-medium">{booking.date}</p>
                <p className="text-gray-400 text-sm">{booking.time}</p>
                <p className="text-gray-500 text-xs mt-1">📍 En tu ubicación • Llegada puntual garantizada</p>
              </div>
            </div>

            {/* Technician */}
            <div className="flex items-center gap-4 p-5 bg-navy-700 rounded-xl border border-white/5">
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-navy-600 border-2 border-electric/40">
                  <img
                    src="/neno-baez-electrician.jpeg"
                    alt="Neno Báez"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-navy-700 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg">{booking.technician}</h3>
                <p className="text-electric text-sm font-medium">Técnico Especialista Certificado</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="electric-badge-outline text-xs">15+ años</span>
                  <span className="electric-badge-outline text-xs">Licenciado CDEEE</span>
                  <span className="electric-badge-outline text-xs">Seguro RD$500K</span>
                </div>
                <p className="text-gray-400 text-sm mt-2">📱 WhatsApp: +1 (809) 555-0123</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust section */}
        <div className="bg-gradient-to-r from-navy-800 to-navy-700 border border-electric/20 rounded-2xl p-8 mb-6">
          <h3
            className="text-4xl font-black text-center mb-8 leading-none"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            🏆 Tu Confianza es Nuestra Prioridad
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Shield className="w-7 h-7 text-electric" />, title: 'Seguro Total', sub: 'Cobertura RD$500,000' },
              { icon: <Award className="w-7 h-7 text-electric" />, title: 'Certificado', sub: 'Licencia CDEEE' },
              { icon: <Star className="w-7 h-7 text-electric fill-electric" />, title: '15+ Años', sub: 'Experiencia comprobada' },
              { icon: <Phone className="w-7 h-7 text-electric" />, title: '24/7', sub: 'Soporte disponible' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 bg-electric/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  {item.icon}
                </div>
                <p className="font-bold text-white">{item.title}</p>
                <p className="text-gray-400 text-xs mt-1">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="dark-card p-8 mb-6">
          <h3
            className="text-4xl font-black text-center mb-2 leading-none"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            ⭐ Lo que dicen nuestros clientes
          </h3>
          <div className="flex items-center justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-electric text-electric" />)}
            <span className="ml-2 text-xl font-black text-electric">4.9/5</span>
            <span className="text-gray-500 ml-1 text-sm">• 200+ servicios</span>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-navy-700 rounded-xl p-4 border border-white/5">
                <div className="flex gap-1 mb-2">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-electric text-electric" />)}
                </div>
                <p className="text-gray-300 text-sm italic mb-3">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <span className="electric-badge-outline text-xs">{t.location}</span>
                </div>
                <p className="text-electric text-xs mt-1">{t.service}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Next steps */}
        <div className="bg-navy-800 border border-electric/20 rounded-2xl p-8 mb-6">
          <h3
            className="font-black text-4xl text-center mb-8 leading-none"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            📋 Próximos Pasos
          </h3>
          <div className="space-y-4">
            {[
              { num: '✓', color: 'bg-green-500', title: 'Confirmación Automática', desc: 'Recibirás confirmación por WhatsApp y email', badge: '✅ Completado' },
              { num: '2', color: 'bg-electric', title: 'Contacto Previo (24h antes)', desc: `Neno Báez te contactará por WhatsApp para confirmar hora exacta`, badge: '⏳ Próximamente' },
              { num: '3', color: 'bg-blue-500', title: 'Día del Servicio', desc: 'Neno llegará puntualmente para la evaluación técnica completa', badge: '🏠 En tu ubicación' },
              { num: '4', color: 'bg-purple-500', title: 'Cotización Detallada', desc: 'Después del diagnóstico, recibirás cotización completa por WhatsApp', badge: '💰 Sin compromiso' },
            ].map((step, i) => (
              <div key={i} className="flex gap-4 p-4 bg-navy-700 rounded-xl">
                <div className={`w-10 h-10 ${step.color} text-white rounded-full flex items-center justify-center font-bold flex-shrink-0`}>
                  {step.num}
                </div>
                <div>
                  <h4 className="font-bold text-white">{step.title}</h4>
                  <p className="text-gray-400 text-sm mt-1">{step.desc}</p>
                  <span className="text-xs bg-navy-600 text-gray-400 px-2 py-0.5 rounded-full mt-2 inline-block">{step.badge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link href="/booking" className="btn-outline-electric justify-center">
            📝 Modificar Reserva
          </Link>
          <Link
            href={`/pre-service?service=${booking.serviceKey}&fee=${booking.evaluationFee.replace('RD$ ', '')}&technician=${encodeURIComponent(booking.technician)}&date=${encodeURIComponent(booking.date)}&time=${encodeURIComponent(booking.time)}`}
            className="btn-electric justify-center"
          >
            🚛 Técnico en Camino
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Final reassurance */}
        <div className="bg-green-900/30 border border-green-500/30 rounded-2xl p-8 text-center mb-8">
          <h3 className="text-2xl font-bold mb-3">🌟 ¡Gracias por confiar en nosotros!</h3>
          <p className="text-green-400">Has elegido el mejor servicio eléctrico de la región Este de República Dominicana</p>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-electric"></div>
          <p className="mt-3 text-electric">Cargando...</p>
        </div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  )
}
