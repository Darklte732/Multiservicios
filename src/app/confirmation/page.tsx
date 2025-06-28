'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Calendar, Phone, ArrowRight, MessageCircle } from 'lucide-react'
import Link from 'next/link'

const serviceConfig = {
  'emergencia': {
    name: 'Emergencia Eléctrica',
    icon: '🚨',
    color: 'bg-red-50',
    fee: 500,
    description: 'Atención inmediata 24/7'
  },
  'instalacion': {
    name: 'Instalación Eléctrica', 
    icon: '🔌',
    color: 'bg-blue-50',
    fee: 400,
    description: 'Instalaciones nuevas y conexiones'
  },
  'mantenimiento': {
    name: 'Mantenimiento Eléctrico',
    icon: '🔧',
    color: 'bg-green-50',
    fee: 350,
    description: 'Mantenimiento preventivo'
  },
  'reparacion': {
    name: 'Reparación Eléctrica',
    icon: '⚡',
    color: 'bg-purple-50',
    fee: 400,
    description: 'Reparación de fallas'
  }
}

function ConfirmationContent() {
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
              href="/booking" 
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <span className="font-medium">← Volver a Servicios</span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span className="text-xl font-bold text-blue-900">MultiServicios</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Paso 3 de 5</span>
            <span>60% completado</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: '60%' }}
            ></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Reserva Confirmada!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tu cita de <strong>{bookingDetails.service}</strong> ha sido programada exitosamente. 
            Recibirás confirmación por <strong>email y WhatsApp</strong> con todos los detalles.
          </p>
        </div>

        {/* WhatsApp + Email Confirmation */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
          <h3 className="font-bold text-lg text-green-900 mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            📧 Confirmación Enviada
          </h3>
          <div className="space-y-3 text-sm text-green-800">
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">📱</span>
              <div>
                <p className="font-medium">WhatsApp:</p>
                <p>Te enviaremos un mensaje de confirmación con los detalles de tu cita</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">📧</span>
              <div>
                <p className="font-medium">Email:</p>
                <p>Revisa tu bandeja de entrada para la confirmación de Calendly</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            Detalles de tu Cita
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
              <Calendar className="w-6 h-6 text-blue-600" />
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

        {/* Next Steps */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
          <h3 className="font-bold text-lg text-yellow-900 mb-4">
            📋 Próximos Pasos
          </h3>
          <div className="space-y-3 text-sm text-yellow-800">
            <div className="flex items-start gap-3">
              <span className="text-yellow-600 font-bold">1.</span>
              <span>Recibirás confirmación por <strong>WhatsApp y email</strong> con el tipo de servicio, fecha y hora exacta</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-yellow-600 font-bold">2.</span>
              <span>El técnico te contactará por <strong>WhatsApp</strong> 24 horas antes de la cita</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-yellow-600 font-bold">3.</span>
              <span>Ten preparado el área donde se realizará la evaluación</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-yellow-600 font-bold">4.</span>
              <span>Después del diagnóstico, recibirás una cotización detallada por WhatsApp sin compromiso</span>
            </div>
          </div>
        </div>

        {/* Pricing Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h3 className="font-bold text-lg text-blue-900 mb-2">
            💰 Información de Precios
          </h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p><strong>Evaluación Técnica:</strong> {bookingDetails.evaluationFee}</p>
            <p><strong>Costo Total:</strong> Se cotiza después del diagnóstico técnico</p>
            <p className="text-xs italic">*El técnico explicará todos los costos antes de proceder</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="font-bold text-lg text-gray-900 mb-4 text-center">
            📞 ¿Necesitas cambiar tu cita?
          </h3>
          <div className="text-center space-y-4">
            <p className="text-gray-600">Contáctanos para reprogramar o cancelar</p>
            
            {/* WhatsApp Contact */}
            <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 rounded-lg p-3">
              <MessageCircle className="w-5 h-5" />
              <div>
                <p className="font-medium">WhatsApp: +1 (809) 555-0123</p>
                <p className="text-xs text-green-700">Respuesta más rápida</p>
              </div>
            </div>
            
            {/* Phone Contact */}
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <Phone className="w-4 h-4" />
              <span className="font-medium">Teléfono: +1 (809) 555-0123</span>
            </div>
            
            <p className="text-sm text-gray-500">Lunes a Sábado: 8:00 AM - 6:00 PM</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/booking"
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-center"
          >
            Modificar Reserva
          </Link>
          <Link
            href={`/pre-service?service=${bookingDetails.serviceKey}&fee=${bookingDetails.evaluationFee.replace('RD$ ', '')}&technician=${encodeURIComponent(bookingDetails.technician)}&date=${encodeURIComponent(bookingDetails.date)}&time=${encodeURIComponent(bookingDetails.time)}`}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-center flex items-center justify-center gap-2"
          >
            Técnico en Camino
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-blue-600">Cargando...</p>
      </div>
    </div>}>
      <ConfirmationContent />
    </Suspense>
  )
} 