'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Calendar, Phone, ArrowRight, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { Footer } from '@/components/Footer'

const serviceConfig = {
  'emergencia': {
    name: 'Emergencia Eléctrica',
    icon: '🚨',
    color: 'bg-red-50',
    fee: '4,000 - 8,000',
    description: 'Atención inmediata 24/7'
  },
  'instalacion': {
    name: 'Instalación Eléctrica', 
    icon: '🔌',
    color: 'bg-blue-50',
    fee: '3,000 - 6,000',
    description: 'Instalaciones nuevas y conexiones'
  },
  'mantenimiento': {
    name: 'Mantenimiento Eléctrico',
    icon: '🔧',
    color: 'bg-green-50',
    fee: '3,000 - 5,000',
    description: 'Mantenimiento preventivo'
  },
  'reparacion': {
    name: 'Reparación Eléctrica',
    icon: '⚡',
    color: 'bg-purple-50',
    fee: '3,000 - 7,000',
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
    technician: 'Neno Baez',
    date: 'Martes, 28 de Enero 2025',
    time: '2:00 PM - 4:00 PM',
    customerName: 'Cliente',
    customerEmail: ''
  })

  useEffect(() => {
    // Get Calendly event details from URL parameters
    const eventTypeName = searchParams.get('event_type_name') || searchParams.get('event') || 'Instalación Eléctrica'
    const inviteeName = searchParams.get('invitee') || 'Cliente'
    const inviteeEmail = searchParams.get('invitee_email') || ''
    const eventStartTime = searchParams.get('event_start_time') || searchParams.get('start_time')
    const eventEndTime = searchParams.get('event_end_time') || searchParams.get('end_time')
    
    // Determine service type from event name
    let serviceKey = 'instalacion'
    if (eventTypeName.toLowerCase().includes('emergencia')) serviceKey = 'emergencia'
    else if (eventTypeName.toLowerCase().includes('reparacion')) serviceKey = 'reparacion'
    else if (eventTypeName.toLowerCase().includes('mantenimiento')) serviceKey = 'mantenimiento'
    else if (eventTypeName.toLowerCase().includes('instalacion')) serviceKey = 'instalacion'
    
    const serviceInfo = serviceConfig[serviceKey as keyof typeof serviceConfig] || serviceConfig.instalacion
    
    // Format date and time from Calendly ISO strings
    let formattedDate = 'Fecha por confirmar'
    let formattedTime = 'Hora por confirmar'
    
    if (eventStartTime) {
      try {
        const startDate = new Date(eventStartTime)
        const endDate = eventEndTime ? new Date(eventEndTime) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000) // Default 2 hours
        
        formattedDate = startDate.toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long', 
          day: 'numeric'
        })
        
        formattedTime = `${startDate.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })} - ${endDate.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })}`
      } catch (error) {
        console.error('Error parsing Calendly date:', error)
      }
    }
    
    setBookingDetails({
      service: serviceInfo.name,
      serviceKey: serviceKey,
      evaluationFee: `RD$ ${serviceInfo.fee}`,
      icon: serviceInfo.icon,
      color: serviceInfo.color,
              technician: 'Neno Baez', // Default technician
      date: formattedDate,
      time: formattedTime,
      customerName: inviteeName,
      customerEmail: inviteeEmail
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
            <span>Etapa 3 de 5</span>
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
            ¡Reserva Confirmada{bookingDetails.customerName !== 'Cliente' ? `, ${bookingDetails.customerName}` : ''}!
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
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-blue-50 px-6 py-3 rounded-full border border-blue-200">
              <span className="text-2xl">📋</span>
              <h2 className="text-xl font-bold text-blue-900">
                Detalles de tu Cita
              </h2>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Service */}
            <div className={`flex items-center gap-4 p-6 ${bookingDetails.color} rounded-xl border border-blue-200 shadow-sm`}>
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-md">
                <span className="text-3xl">{bookingDetails.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-xl">{bookingDetails.service}</h3>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-blue-700">Evaluación técnica:</span>
                    <span className="text-sm font-bold text-blue-600">{bookingDetails.evaluationFee}</span>
                  </div>
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 px-3 py-2 rounded-lg">
                    <p className="text-sm font-bold text-green-800 flex items-center gap-2">
                      <span className="text-lg">🎉</span>
                      ¡GRATIS si contratas el servicio completo!
                    </p>
                    <p className="text-xs text-green-600 mt-1">El costo de evaluación se descuenta del total final</p>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="text-green-500">✅</span>
                    Confirmado vía WhatsApp
                  </p>
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <div className="p-3 bg-green-100 rounded-full">
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">Fecha y Hora Confirmada</h3>
                <p className="text-base font-medium text-green-700 mt-1">{bookingDetails.date}</p>
                <p className="text-sm text-green-600 font-medium">{bookingDetails.time}</p>
                <p className="text-xs text-gray-500 mt-1">📍 En tu ubicación • Llegada puntual garantizada</p>
              </div>
            </div>

            {/* Technician */}
            <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600">
                  <img 
                    src="/neno-baez-electrician.jpeg" 
                    alt="Neno Baez - Electricista Profesional trabajando"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to emoji if image not found
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const parent = target.parentElement!;
                      parent.innerHTML = '<span className="text-white text-xl font-bold flex items-center justify-center w-full h-full">👷‍♂️</span>';
                    }}
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">{bookingDetails.technician}</h3>
                <p className="text-sm font-medium text-blue-700">Técnico Especialista Certificado</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">15+ años experiencia</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Licenciado</span>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Seguro RD$500K</span>
                </div>
                <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                  <span className="text-green-600">📱</span>
                  <span>WhatsApp: +1 (809) 555-0123</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust & Credentials Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white">
          <h3 className="text-xl font-bold text-center mb-6">
            🏆 Tu Confianza es Nuestra Prioridad
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🛡️</span>
              </div>
              <h4 className="font-semibold mb-2">Seguro Total</h4>
              <p className="text-sm text-blue-100">Cobertura hasta RD$500,000</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📜</span>
              </div>
              <h4 className="font-semibold mb-2">Licenciado</h4>
              <p className="text-sm text-blue-100">Técnico certificado #ES-2024-001</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⭐</span>
              </div>
              <h4 className="font-semibold mb-2">15+ Años</h4>
              <p className="text-sm text-blue-100">Experiencia comprobada</p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-8 mb-8">
          <h3 className="font-bold text-xl text-amber-900 mb-6 text-center flex items-center justify-center gap-3">
            <span className="text-2xl">📋</span>
            Próximos Pasos
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-white bg-opacity-60 rounded-xl">
              <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <div className="flex-1">
                <h4 className="font-semibold text-amber-900">Confirmación Automática</h4>
                <p className="text-sm text-amber-800 mt-1">Recibirás confirmación por <strong>WhatsApp y email</strong> con todos los detalles</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-white bg-opacity-60 rounded-xl">
              <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
              <div className="flex-1">
                <h4 className="font-semibold text-amber-900">Contacto Previo</h4>
                <p className="text-sm text-amber-800 mt-1">El técnico <strong>Neno Baez</strong> te contactará por WhatsApp 24 horas antes</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-white bg-opacity-60 rounded-xl">
              <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
              <div className="flex-1">
                <h4 className="font-semibold text-amber-900">Preparación</h4>
                <p className="text-sm text-amber-800 mt-1">Ten preparado el área donde se realizará la evaluación</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-white bg-opacity-60 rounded-xl">
              <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
              <div className="flex-1">
                <h4 className="font-semibold text-amber-900">Cotización Sin Compromiso</h4>
                <p className="text-sm text-amber-800 mt-1">Después del diagnóstico, recibirás cotización detallada por WhatsApp</p>
              </div>
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
            className="px-8 py-4 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl font-semibold transition-all duration-200 text-center shadow-md hover:shadow-lg"
          >
            📝 Modificar Reserva
          </Link>
          <Link
            href={`/pre-service?service=${bookingDetails.serviceKey}&fee=${bookingDetails.evaluationFee.replace('RD$ ', '')}&technician=${encodeURIComponent(bookingDetails.technician)}&date=${encodeURIComponent(bookingDetails.date)}&time=${encodeURIComponent(bookingDetails.time)}`}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-200 text-center flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            🚛 Técnico en Camino
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <Footer />
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