'use client'

import { useEffect, useMemo, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Star, Shield, ArrowLeft, UserPlus } from 'lucide-react'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'
import { capture } from '@/lib/analytics'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { generateServiceCode } from '@/lib/serviceCode'

const serviceConfig = {
  'emergencia': {
    name: 'Emergencia Eléctrica',
    icon: '🚨',
    color: 'bg-red-50',
    baseFee: '4,000 - 8,000',
    description: 'Atención inmediata 24/7'
  },
  'instalacion': {
    name: 'Instalación Eléctrica', 
    icon: '🔌',
    color: 'bg-blue-50',
    baseFee: '3,000 - 6,000',
    description: 'Instalaciones nuevas y conexiones'
  },
  'mantenimiento': {
    name: 'Mantenimiento Eléctrico',
    icon: '🔧',
    color: 'bg-green-50',
    baseFee: '3,000 - 5,000',
    description: 'Mantenimiento preventivo'
  },
  'reparacion': {
    name: 'Reparación Eléctrica',
    icon: '⚡',
    color: 'bg-purple-50',
    baseFee: '3,000 - 7,000',
    description: 'Reparación de fallas'
  }
}

// Service-specific work details
const serviceWorkDetails = {
  'emergencia': [
    'Estabilización del sistema eléctrico',
    'Reparación de falla crítica', 
    'Verificación de seguridad',
    'Pruebas de funcionamiento'
  ],
  'instalacion': [
    'Instalación de toma de 220V',
    'Cableado nuevo con protección',
    'Pruebas de seguridad',
    'Certificación técnica'
  ],
  'mantenimiento': [
    'Inspección completa del sistema',
    'Limpieza de contactos',
    'Verificación de conexiones',
    'Reporte de mantenimiento'
  ],
  'reparacion': [
    'Diagnóstico del problema',
    'Reparación de componentes',
    'Reemplazo de piezas',
    'Pruebas de funcionamiento'
  ]
}

function ServiceCompleteContent() {
  const searchParams = useSearchParams()
  const [rating, setRating] = useState(5)
  // Stable service code generated once on mount — uses MS-YYYY-XXXXX format
  const serviceCode = useMemo(() => generateServiceCode(), [])
  const [bookingDetails, setBookingDetails] = useState({
    service: 'Instalación Eléctrica',
    serviceKey: 'instalacion',
    evaluationFee: 400,
    totalCost: 1250,
    icon: '🔌',
    color: 'bg-blue-50',
    technician: 'Juan Pérez',
    date: 'Martes, 28 de Enero 2025',
    startTime: '2:00 PM',
    endTime: '4:30 PM',
    duration: '2 horas 30 minutos',
    workDetails: [
      'Instalación de toma de 220V',
      'Cableado nuevo con protección',
      'Pruebas de seguridad',
      'Certificación técnica'
    ]
  })

  useEffect(() => {
    // Get service details from URL parameters
    const serviceParam = searchParams.get('service') || 'instalacion'
    const feeParam = parseInt(searchParams.get('fee') || '400')
    const dateParam = searchParams.get('date') || 'Martes, 28 de Enero 2025'
    const timeParam = searchParams.get('time') || '2:00 PM - 4:00 PM'
    const technicianParam = searchParams.get('technician') || 'Juan Pérez'
    
    const serviceInfo = serviceConfig[serviceParam as keyof typeof serviceConfig] || serviceConfig.instalacion
    
    // Parse time range
    const timeRange = timeParam.split(' - ')
    const startTime = timeRange[0] || '2:00 PM'
    const endTime = timeRange[1] || '4:00 PM'
    
    // Calculate realistic total cost (evaluation + service work)
    const serviceMultiplier = serviceParam === 'emergencia' ? 2.5 : 
                             serviceParam === 'instalacion' ? 3.1 :
                             serviceParam === 'mantenimiento' ? 2.0 : 2.8
    const totalCost = Math.round(feeParam * serviceMultiplier)
    
    // Calculate duration
    const calculateDuration = (start: string, end: string) => {
      // Simple duration calculation for common time formats
      const startHour = parseInt(start.split(':')[0])
      const endHour = parseInt(end.split(':')[0])
      const isEndPM = end.includes('PM')
      const isStartPM = start.includes('PM')
      
      let duration = endHour - startHour
      if (isEndPM && !isStartPM && endHour !== 12) duration += 12
      if (duration < 0) duration += 12
      
      const minutes = end.includes('30') ? 30 : 0
      return `${duration} horas${minutes > 0 ? ' 30 minutos' : ''}`
    }
    
    setBookingDetails({
      service: serviceInfo.name,
      serviceKey: serviceParam,
      evaluationFee: feeParam,
      totalCost: totalCost,
      icon: serviceInfo.icon,
      color: serviceInfo.color,
      technician: technicianParam,
      date: dateParam,
      startTime: startTime,
      endTime: endTime,
      duration: calculateDuration(startTime, endTime),
      workDetails: serviceWorkDetails[serviceParam as keyof typeof serviceWorkDetails] || serviceWorkDetails.instalacion
    })
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              href={`/pre-service?service=${bookingDetails.serviceKey}&fee=${bookingDetails.evaluationFee}&technician=${encodeURIComponent(bookingDetails.technician)}&date=${encodeURIComponent(bookingDetails.date)}&time=${encodeURIComponent(bookingDetails.startTime)} - ${encodeURIComponent(bookingDetails.endTime)}`}
              className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Estado Anterior</span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span className="text-xl font-bold text-green-900">MultiServicios</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Etapa 5 de 5</span>
            <span>100% completado</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: '100%' }}
            ></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ¡Servicio Completado! 🎉
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tu <strong>{bookingDetails.service}</strong> ha sido realizada exitosamente por nuestro técnico especialista {bookingDetails.technician}.
          </p>
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mt-4">
            <Shield className="w-5 h-5" />
            <span className="font-medium">Garantía de 6 meses incluida</span>
          </div>
        </div>

        {/* Service Summary */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Resumen del Servicio Realizado
          </h2>

          {/* Service Header */}
          <div className={`flex items-center gap-4 p-6 ${bookingDetails.color} rounded-lg mb-6`}>
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
              <span className="text-3xl">{bookingDetails.icon}</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">{bookingDetails.service} Completada</h3>
              <p className="text-gray-600">Costo total: RD$ {bookingDetails.totalCost.toLocaleString()} (incluye evaluación + instalación)</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>✓ Pagado</span>
                <span>✓ Garantía activada</span>
              </div>
            </div>
          </div>

          {/* Work Details Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Work Performed */}
            <div>
              <h4 className="font-bold text-lg text-gray-900 mb-4">Trabajo Realizado</h4>
              <div className="space-y-3">
                {bookingDetails.workDetails.map((work, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">•</span>
                    <span className="text-gray-700">{work}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Time */}
            <div>
              <h4 className="font-bold text-lg text-gray-900 mb-4">Tiempo de Servicio</h4>
              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between">
                  <span>Inicio:</span>
                  <span className="font-medium">{bookingDetails.startTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Finalización:</span>
                  <span className="font-medium">{bookingDetails.endTime}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span>Total:</span>
                  <span className="font-bold text-green-600">{bookingDetails.duration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technician Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            👨‍🔧 Tu Técnico Especialista
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">{bookingDetails.technician.split(' ').map(n => n[0]).join('')}</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{bookingDetails.technician}</h4>
              <p className="text-sm text-gray-600">Electricista Certificado • 5 años de experiencia</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600">4.9/5 calificación promedio</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Section */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
          <h3 className="font-bold text-lg text-yellow-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5" />
            ¡Ayúdanos a Mejorar!
          </h3>
          <p className="text-sm text-yellow-800 mb-4">
            Tu opinión es muy importante para nosotros. ¿Cómo calificarías el servicio recibido?
          </p>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-yellow-800">Calificación:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`w-8 h-8 rounded ${
                  star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                } hover:text-yellow-400 transition-colors`}
              >
                <Star className="w-full h-full" />
              </button>
            ))}
          </div>
          <a
            href={`https://wa.me/18092514329?text=${encodeURIComponent('¡Hola Neno! Quería compartir mi comentario sobre el servicio que recibí.')}`}
            onClick={() => capture('service_complete_feedback_submitted', { rating, surface: 'whatsapp' })}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <WhatsAppIcon className="w-5 h-5" />
            Enviar Comentario por WhatsApp
          </a>
        </div>

        {/* Warranty Information */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-8">
          <h3 className="font-bold text-lg text-purple-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Información de Garantía
          </h3>
          <div className="space-y-3 text-sm text-purple-800">
            <div className="flex items-start gap-3">
              <span className="text-purple-600 font-bold">📅</span>
              <div>
                <p className="font-medium">Garantía por 6 meses</p>
                <p>Cubre materiales y mano de obra utilizada en la instalación</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-600 font-bold">📱</span>
              <div>
                <p className="font-medium">Soporte técnico gratuito</p>
                <p>Contacto directo vía WhatsApp para consultas sobre el trabajo realizado</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-600 font-bold">🔧</span>
              <div>
                <p className="font-medium">Mantenimiento recomendado</p>
                <p>Te contactaremos en 6 meses para mantenimiento preventivo opcional</p>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h3 className="font-bold text-lg text-blue-900 mb-4 flex items-center gap-2">
            🔮 ¿Qué Sigue?
          </h3>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">📱</span>
              <span>Guarda nuestro WhatsApp (+1 809 251-4329) para futuras consultas</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">🏠</span>
              <span>Disfruta de tu nueva instalación eléctrica con total seguridad</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">⭐</span>
              <span>Recomiéndanos a tus familiares y amigos que necesiten servicios eléctricos</span>
            </div>
          </div>
        </div>

        {/* Account Creation Prompt */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-8 mb-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserPlus className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-indigo-900 mb-4">
              ¡Únete a MultiServicios y Obtén Beneficios Exclusivos!
            </h3>
            <p className="text-indigo-700 mb-6 max-w-2xl mx-auto">
              Crea tu cuenta ahora y disfruta de descuentos, seguimiento de garantías, 
              historial completo de servicios y prioridad en reservas futuras.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white bg-opacity-50 rounded-lg p-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600 font-bold">10%</span>
                </div>
                <p className="text-sm font-medium text-indigo-800">
                  Descuento en tu próximo servicio
                </p>
              </div>
              <div className="bg-white bg-opacity-50 rounded-lg p-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-indigo-800">
                  Seguimiento automático de garantías
                </p>
              </div>
              <div className="bg-white bg-opacity-50 rounded-lg p-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-sm font-medium text-indigo-800">
                  Historial completo de servicios
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/account-creation?service=${bookingDetails.serviceKey}&fee=${bookingDetails.evaluationFee}&code=${serviceCode}&name=${encodeURIComponent(bookingDetails.technician)}&auto=true`}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Crear Mi Cuenta Gratis
              </Link>
              <button className="px-6 py-4 bg-white hover:bg-gray-50 text-indigo-600 border border-indigo-200 rounded-lg font-medium transition-colors">
                Continuar Sin Cuenta
              </button>
            </div>
            
            <p className="text-sm text-indigo-600 mt-4">
              Tu servicio será vinculado automáticamente a tu nueva cuenta
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-center flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al Inicio
          </Link>
          <Link
            href="/booking"
            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-center flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Agendar Otro Servicio
          </Link>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default function ServiceCompletePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p className="mt-2 text-green-600">Cargando...</p>
      </div>
    </div>}>
      <ServiceCompleteContent />
    </Suspense>
  )
} 