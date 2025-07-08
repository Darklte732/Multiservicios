'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Clock, Phone, MessageCircle, MapPin, CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const serviceConfig = {
  'emergencia': {
    name: 'Emergencia Eléctrica',
    icon: '🚨',
    color: 'bg-red-50',
    description: 'Atención inmediata 24/7'
  },
  'instalacion': {
    name: 'Instalación Eléctrica', 
    icon: '🔌',
    color: 'bg-blue-50',
    description: 'Instalaciones nuevas y conexiones'
  },
  'mantenimiento': {
    name: 'Mantenimiento Eléctrico',
    icon: '🔧',
    color: 'bg-green-50',
    description: 'Mantenimiento preventivo'
  },
  'reparacion': {
    name: 'Reparación Eléctrica',
    icon: 'Pre-servicio',
    color: 'bg-purple-50',
    description: 'Reparación de fallas'
  }
}

function PreServiceContent() {
  const searchParams = useSearchParams()
  const [bookingDetails, setBookingDetails] = useState({
    service: 'Instalación Eléctrica',
    serviceKey: 'instalacion',
    evaluationFee: 'RD$ 400',
    icon: '🔌',
    color: 'bg-blue-50',
    technician: 'Juan Pérez',
    date: 'Martes, 28 de Enero 2025',
    time: '2:00 PM - 4:00 PM'
  })

  useEffect(() => {
    // Get service details from URL parameters
    const serviceParam = searchParams.get('service') || 'instalacion'
    const feeParam = searchParams.get('fee') || '400'
    const dateParam = searchParams.get('date') || 'Martes, 28 de Enero 2025'
    const timeParam = searchParams.get('time') || '2:00 PM - 4:00 PM'
    const technicianParam = searchParams.get('technician') || 'Juan Pérez'
    
    const serviceInfo = serviceConfig[serviceParam as keyof typeof serviceConfig] || serviceConfig.instalacion
    
    setBookingDetails({
      service: serviceInfo.name,
      serviceKey: serviceParam,
      evaluationFee: `RD$ ${feeParam}`,
      icon: serviceInfo.icon,
      color: serviceInfo.color,
      technician: technicianParam,
      date: dateParam,
      time: timeParam
    })
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              href={`/confirmation?service=${bookingDetails.serviceKey}&fee=${bookingDetails.evaluationFee.replace('RD$ ', '')}&technician=${encodeURIComponent(bookingDetails.technician)}&date=${encodeURIComponent(bookingDetails.date)}&time=${encodeURIComponent(bookingDetails.time)}`}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <span className="font-medium">← Volver a Confirmación</span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span className="text-xl font-bold text-blue-900">MultiServicios</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Etapa 4 de 5</span>
            <span>80% completado</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: '80%' }}
            ></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Status */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Técnico en Camino!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tu técnico te ha contactado y confirmado la cita. Está preparando todo para brindarte el mejor servicio eléctrico.
          </p>
        </div>

        {/* Technician Contact Confirmation */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
          <h3 className="font-bold text-lg text-green-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Contacto Realizado
          </h3>
          <div className="space-y-3 text-sm text-green-800">
            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">WhatsApp Confirmado</p>
                <p>El técnico {bookingDetails.technician} te contactó por WhatsApp con los detalles finales</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Ubicación Confirmada</p>
                <p>Dirección verificada y ruta optimizada para llegada puntual</p>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            Detalles de la Cita Confirmada
          </h2>
          
          <div className="space-y-6">
            {/* Service */}
            <div className={`flex items-center gap-4 p-4 ${bookingDetails.color} rounded-lg`}>
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <span className="text-2xl">{bookingDetails.icon}</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{bookingDetails.service}</h3>
                <p className="text-sm text-gray-600">Evaluación técnica: {bookingDetails.evaluationFee} • Confirmado vía WhatsApp</p>
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Fecha y Hora Confirmada</h3>
                <p className="text-sm text-gray-600">{bookingDetails.date}</p>
                <p className="text-sm text-gray-600">{bookingDetails.time}</p>
              </div>
            </div>

            {/* Technician */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{bookingDetails.technician.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{bookingDetails.technician} - Técnico Especialista</h3>
                <p className="text-sm text-gray-600">5 años de experiencia • WhatsApp: +1 (809) 555-0123</p>
              </div>
            </div>
          </div>
        </div>

        {/* Preparation Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
          <h3 className="font-bold text-lg text-yellow-900 mb-4">
            📝 Preparación para la Visita
          </h3>
          <div className="space-y-3 text-sm text-yellow-800">
            <div className="flex items-start gap-3">
              <span className="text-yellow-600 font-bold">✓</span>
              <span>Asegúrate de tener acceso libre al área donde se realizará el trabajo</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-yellow-600 font-bold">✓</span>
              <span>Ten disponible la información sobre el problema eléctrico específico</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-yellow-600 font-bold">✓</span>
              <span>Prepara el pago para la evaluación técnica ({bookingDetails.evaluationFee})</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-yellow-600 font-bold">✓</span>
              <span>Mantén tu WhatsApp activo para comunicación directa con el técnico</span>
            </div>
          </div>
        </div>

        {/* Service-Specific Preparation */}
        {bookingDetails.serviceKey === 'emergencia' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-lg text-red-900 mb-2">
              🚨 Servicio de Emergencia
            </h3>
            <p className="text-sm text-red-800">
              Dado que es un servicio de emergencia, el técnico priorizará la estabilización del sistema eléctrico y posterior evaluación completa.
            </p>
          </div>
        )}

        {/* What to Expect */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h3 className="font-bold text-lg text-blue-900 mb-4">
            🔍 Qué Esperar Durante la Visita
          </h3>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">1.</span>
              <span><strong>Llegada puntual:</strong> El técnico llegará en la ventana de tiempo confirmada</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">2.</span>
              <span><strong>Evaluación completa:</strong> Inspección detallada del problema eléctrico</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">3.</span>
              <span><strong>Diagnóstico profesional:</strong> Explicación clara del problema y soluciones</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">4.</span>
              <span><strong>Cotización transparente:</strong> Precios justos sin sorpresas adicionales</span>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
          <h3 className="font-bold text-lg text-red-900 mb-4">
            🚨 ¿Emergencia Antes de la Cita?
          </h3>
          <div className="text-center">
            <p className="text-sm text-red-800 mb-4">Si tienes una emergencia eléctrica antes de tu cita programada</p>
            <div className="flex items-center justify-center gap-2 text-red-600 bg-red-100 rounded-lg p-3">
              <Phone className="w-5 h-5" />
              <span className="font-medium">Emergencias 24/7: +1 (809) 555-9999</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/confirmation?service=${bookingDetails.serviceKey}&fee=${bookingDetails.evaluationFee.replace('RD$ ', '')}&technician=${encodeURIComponent(bookingDetails.technician)}&date=${encodeURIComponent(bookingDetails.date)}&time=${encodeURIComponent(bookingDetails.time)}`}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-center"
          >
            Ver Confirmación
          </Link>
          <Link
            href={`/service-complete?service=${bookingDetails.serviceKey}&fee=${bookingDetails.evaluationFee.replace('RD$ ', '')}&technician=${encodeURIComponent(bookingDetails.technician)}&date=${encodeURIComponent(bookingDetails.date)}&time=${encodeURIComponent(bookingDetails.time)}`}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-center flex items-center justify-center gap-2"
          >
            Servicio Completado
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function PreServicePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-blue-600">Cargando...</p>
      </div>
    </div>}>
      <PreServiceContent />
    </Suspense>
  )
} 