'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Clock, Phone, MapPin, CheckCircle, ArrowRight } from 'lucide-react'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'

const serviceConfig = {
  emergencia: { name: 'Emergencia Eléctrica', icon: '🚨', fee: '4,000 - 8,000', borderColor: 'border-red-500/40', bgColor: 'bg-red-900/20' },
  instalacion: { name: 'Instalación Eléctrica', icon: '🔌', fee: '3,000 - 6,000', borderColor: 'border-electric/40', bgColor: 'bg-electric/10' },
  mantenimiento: { name: 'Mantenimiento Eléctrico', icon: '🔧', fee: '3,000 - 5,000', borderColor: 'border-green-500/40', bgColor: 'bg-green-900/20' },
  reparacion: { name: 'Reparación Eléctrica', icon: '⚡', fee: '3,000 - 7,000', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-900/20' },
}

function PreServiceContent() {
  const searchParams = useSearchParams()
  const [booking, setBooking] = useState({
    service: 'Instalación Eléctrica',
    serviceKey: 'instalacion',
    evaluationFee: 'RD$ 3,000',
    icon: '🔌',
    borderColor: 'border-electric/40',
    bgColor: 'bg-electric/10',
    technician: 'Neno Báez',
    date: 'Martes, 28 de Enero 2025',
    time: '2:00 PM - 4:00 PM',
  })

  useEffect(() => {
    const serviceParam = searchParams.get('service') || 'instalacion'
    const feeParam = searchParams.get('fee') || '3,000'
    const dateParam = searchParams.get('date') || 'Martes, 28 de Enero 2025'
    const timeParam = searchParams.get('time') || '2:00 PM - 4:00 PM'
    const technicianParam = searchParams.get('technician') || 'Neno Báez'

    const info = serviceConfig[serviceParam as keyof typeof serviceConfig] || serviceConfig.instalacion

    setBooking({
      service: info.name,
      serviceKey: serviceParam,
      evaluationFee: `RD$ ${feeParam}`,
      icon: info.icon,
      borderColor: info.borderColor,
      bgColor: info.bgColor,
      technician: technicianParam,
      date: dateParam,
      time: timeParam,
    })
  }, [searchParams])

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      {/* Header */}
      <div className="dark-nav border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href={`/confirmation?service=${booking.serviceKey}&fee=${booking.evaluationFee.replace('RD$ ', '')}&technician=${encodeURIComponent(booking.technician)}&date=${encodeURIComponent(booking.date)}&time=${encodeURIComponent(booking.time)}`}
              className="flex items-center gap-2 text-electric hover:text-electric-bright transition-colors font-medium"
            >
              ← Volver a Confirmación
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-electric text-xl">✓</span>
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
            <span className="text-gray-400">Etapa 4 de 5</span>
            <span className="text-electric font-bold">80% completado</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: '80%' }} />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-electric/10 border-2 border-electric/40 rounded-full mb-6 shadow-glow-sm">
            <Clock className="w-10 h-10 text-electric" />
          </div>
          <h1
            className="text-6xl md:text-7xl font-black mb-4 leading-none tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            ¡Técnico en Camino!
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Tu técnico ha confirmado la cita y está preparando todo para brindarte el mejor servicio eléctrico.
          </p>
        </div>

        {/* Contact confirmed */}
        <div className="dark-card border-l-4 border-green-500 p-6 mb-6 !rounded-l-none">
          <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Contacto Realizado
          </h3>
          <div className="space-y-3 text-sm text-gray-400">
            <div className="flex items-start gap-3">
              <WhatsAppIcon className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-white">WhatsApp Confirmado</p>
                <p>El técnico {booking.technician} te contactó con los detalles finales</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-white">Ubicación Confirmada</p>
                <p>Dirección verificada y ruta optimizada para llegada puntual</p>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment details */}
        <div className="dark-card p-8 mb-6">
          <h2
            className="text-3xl font-black text-white mb-6 text-center leading-none"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Detalles de la Cita Confirmada
          </h2>
          <div className="space-y-4">
            {/* Service */}
            <div className={`flex items-center gap-4 p-4 ${booking.bgColor} rounded-xl border ${booking.borderColor}`}>
              <div className="w-12 h-12 bg-navy-700 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                {booking.icon}
              </div>
              <div>
                <h3 className="font-semibold text-white">{booking.service}</h3>
                <p className="text-sm text-gray-400">Evaluación técnica: {booking.evaluationFee} • Confirmado vía WhatsApp</p>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-4 p-4 bg-navy-700 rounded-xl border border-white/5">
              <Clock className="w-6 h-6 text-electric flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white">Fecha y Hora Confirmada</h3>
                <p className="text-sm text-electric">{booking.date}</p>
                <p className="text-sm text-gray-400">{booking.time}</p>
              </div>
            </div>

            {/* Technician */}
            <div className="flex items-center gap-4 p-4 bg-navy-700 rounded-xl border border-white/5">
              <div className="w-10 h-10 bg-electric rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-navy-950 font-bold text-sm">NB</span>
              </div>
              <div>
                <h3 className="font-semibold text-white">{booking.technician} — Técnico Especialista</h3>
                <p className="text-sm text-gray-400">15+ años de experiencia • WhatsApp: +1 (809) 251-4329</p>
              </div>
            </div>
          </div>
        </div>

        {/* Preparation */}
        <div className="dark-card border-l-4 border-electric p-6 mb-6 !rounded-l-none">
          <h3 className="font-bold text-lg text-white mb-4">📝 Preparación para la Visita</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            {[
              'Asegúrate de tener acceso libre al área donde se realizará el trabajo',
              'Ten disponible la información sobre el problema eléctrico específico',
              `Prepara el pago para la evaluación técnica (${booking.evaluationFee})`,
              'Mantén tu WhatsApp activo para comunicación directa con el técnico',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-electric font-bold flex-shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Emergency service note */}
        {booking.serviceKey === 'emergencia' && (
          <div className="dark-card border-l-4 border-red-500 p-6 mb-6 !rounded-l-none">
            <h3 className="font-bold text-lg text-red-400 mb-2">🚨 Servicio de Emergencia</h3>
            <p className="text-sm text-gray-400">
              El técnico priorizará la estabilización del sistema eléctrico antes de la evaluación completa.
            </p>
          </div>
        )}

        {/* What to expect */}
        <div className="dark-card border-l-4 border-blue-500 p-6 mb-6 !rounded-l-none">
          <h3 className="font-bold text-lg text-white mb-4">🔍 Qué Esperar Durante la Visita</h3>
          <div className="space-y-3 text-sm text-gray-400">
            {[
              { num: '1', title: 'Llegada puntual:', desc: 'El técnico llegará en la ventana de tiempo confirmada' },
              { num: '2', title: 'Evaluación completa:', desc: 'Inspección detallada del problema eléctrico' },
              { num: '3', title: 'Diagnóstico profesional:', desc: 'Explicación clara del problema y soluciones disponibles' },
              { num: '4', title: 'Cotización transparente:', desc: 'Precios justos sin sorpresas adicionales' },
            ].map(step => (
              <div key={step.num} className="flex items-start gap-3">
                <span className="text-electric font-bold flex-shrink-0">{step.num}.</span>
                <span><strong className="text-white">{step.title}</strong> {step.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency before appointment */}
        <div className="dark-card border-l-4 border-red-500 p-6 mb-8 !rounded-l-none">
          <h3 className="font-bold text-lg text-red-400 mb-4">🚨 ¿Emergencia Antes de la Cita?</h3>
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-4">Si tienes una emergencia eléctrica antes de tu cita programada</p>
            <a
              href="tel:+18092514329"
              className="btn-emergency inline-flex"
            >
              <Phone className="w-5 h-5" />
              Emergencias 24/7: +1 (809) 251-4329
            </a>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/confirmation?service=${booking.serviceKey}&fee=${booking.evaluationFee.replace('RD$ ', '')}&technician=${encodeURIComponent(booking.technician)}&date=${encodeURIComponent(booking.date)}&time=${encodeURIComponent(booking.time)}`}
            className="btn-outline-electric justify-center"
          >
            Ver Confirmación
          </Link>
          <Link
            href={`/service-complete?service=${booking.serviceKey}&fee=${booking.evaluationFee.replace('RD$ ', '')}&technician=${encodeURIComponent(booking.technician)}&date=${encodeURIComponent(booking.date)}&time=${encodeURIComponent(booking.time)}`}
            className="btn-electric justify-center"
          >
            Servicio Completado
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default function PreServicePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-electric"></div>
          <p className="mt-3 text-electric">Cargando...</p>
        </div>
      </div>
    }>
      <PreServiceContent />
    </Suspense>
  )
}
