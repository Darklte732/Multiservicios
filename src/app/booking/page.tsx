'use client'

import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import CalendlyEmbed from '@/components/CalendlyEmbed'

const services = [
  {
    id: 'emergencia',
    name: 'Emergencia Eléctrica',
    description: 'Atención inmediata 24/7 para problemas críticos',
    icon: '🚨',
    color: 'bg-red-50 border-red-200 hover:bg-red-100',
    pricing: {
      diagnostic: 'RD$ 500',
      process: 'Evaluación de emergencia + reparación inmediata',
      included: [
        'Visita técnica especializada de emergencia',
        'Diagnóstico completo con equipo profesional',
        'Evaluación detallada del problema eléctrico',
        'Cotización transparente del trabajo necesario',
        'Cotización inmediata del trabajo de emergencia',
        'Garantía de 15 días en el trabajo realizado'
      ],
      note: 'Tarifa nocturna y fines de semana: +50% • El costo de materiales se cotiza por separado',
      clarification: 'Solo pagas la evaluación técnica. Si decides no continuar, no hay costos adicionales.'
    }
  },
  {
    id: 'instalacion',
    name: 'Instalación Eléctrica',
    description: 'Instalaciones nuevas, conexiones y cableado profesional',
    icon: '🔌',
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    pricing: {
      diagnostic: 'RD$ 400',
      process: 'Evaluación del proyecto + cotización detallada + instalación',
      included: [
        'Visita técnica y evaluación del sitio',
        'Análisis técnico completo del proyecto',
        'Medición y planificación de la instalación',
        'Cotización detallada de materiales y mano de obra',
        'Asesoría sobre mejores opciones y alternativas',
        'Garantía de 90 días en el trabajo completado'
      ],
      note: 'La evaluación RD$ 400 es independiente del proyecto • Materiales se cotizan según el proyecto',
      clarification: 'La evaluación te ayuda a conocer el costo exacto antes de decidir. Sin sorpresas.'
    }
  },
  {
    id: 'mantenimiento',
    name: 'Mantenimiento Eléctrico',
    description: 'Mantenimiento preventivo y revisiones periódicas',
    icon: '🔧',
    color: 'bg-green-50 border-green-200 hover:bg-green-100',
    pricing: {
      diagnostic: 'RD$ 350',
      process: 'Inspección completa + mantenimiento preventivo',
      included: [
        'Visita técnica programada a tu conveniencia',
        'Inspección completa de todo el sistema eléctrico',
        'Limpieza básica de breakers durante inspección',
        'Pruebas de seguridad y funcionamiento',
        'Reporte detallado del estado de tu instalación',
        'Recomendaciones para prevenir problemas futuros',
        'Garantía de 60 días en servicios realizados'
      ],
      note: '20% descuento en mantenimientos programados • Materiales de reemplazo se cotizan aparte',
      clarification: 'La evaluación RD$ 350 cubre el diagnóstico. Cualquier trabajo adicional se cotiza por separado.'
    }
  },
  {
    id: 'reparacion',
    name: 'Reparación Eléctrica',
    description: 'Reparación de fallas y problemas eléctricos',
    icon: '⚡',
    color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    pricing: {
      diagnostic: 'RD$ 400',
      process: 'Diagnóstico especializado + reparación del problema',
      included: [
        'Visita técnica con equipo de diagnóstico avanzado',
        'Identificación precisa de la falla eléctrica',
        'Evaluación de daños y causas del problema',
        'Cotización clara de la reparación necesaria',
        'Cotización detallada de toda reparación necesaria',
        'Pruebas de funcionamiento y seguridad',
        'Garantía de 45 días en la reparación'
      ],
      note: 'Si requiere materiales especiales, se cotizan por separado • Toda reparación se cotiza después del diagnóstico',
      clarification: 'La evaluación RD$ 400 identifica el problema. Cualquier reparación se cotiza por separado.'
    }
  }
]

export default function BookingPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Volver al Inicio</span>
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
            <span>Paso 2 de 5</span>
            <span>40% completado</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: '40%' }}
            ></div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedService ? (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Reserva tu Servicio Eléctrico
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Selecciona el tipo de servicio que necesitas. Nuestros técnicos certificados 
                te brindarán un diagnóstico profesional y cotización transparente.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${service.color}`}
                >
                  <div className="text-center">
                    <div className="flex justify-center items-center gap-2 mb-3">
                      <span className="text-3xl">{service.icon}</span>
                      <h3 className="font-bold text-lg text-gray-900">
                        {service.name}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      {service.description}
                    </p>
                    <div className="flex-1">
                      
                      {/* New Transparent Pricing Structure */}
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-gray-700">Solo Evaluación Técnica:</span>
                          <span className="font-bold text-lg text-blue-600">
                            {service.pricing.diagnostic}
                          </span>
                        </div>
                        
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-3">
                          <p className="text-xs text-yellow-800 font-medium">
                            ⚠️ {service.pricing.clarification}
                          </p>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-3">
                          <strong>Proceso:</strong> {service.pricing.process}
                        </div>
                        
                        <div className="mb-3">
                          <strong className="text-sm text-gray-700">Incluye:</strong>
                          <ul className="text-xs text-gray-600 mt-1 space-y-1">
                            {service.pricing.included.map((item, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <span className="text-green-500">✓</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="text-xs text-blue-600 font-medium border-t pt-2">
                          💡 {service.pricing.note}
                        </div>
                      </div>
                      
                      <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors">
                        Solicitar Servicio
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Trust Building Section */}
            <div className="bg-gray-50 rounded-xl p-6 mt-8">
              <h3 className="font-bold text-lg text-gray-900 mb-4 text-center">
                🛡️ Nuestra Garantía de Transparencia Total
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl mb-2">💰</div>
                  <div className="font-semibold text-gray-700">Precios Transparentes</div>
                  <div className="text-gray-600">Solo pagas lo que acordamos. Sin costos sorpresa al final del trabajo.</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">📋</div>
                  <div className="font-semibold text-gray-700">Cotización Detallada</div>
                  <div className="text-gray-600">Te explicamos cada material y hora de trabajo antes de comenzar.</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🔧</div>
                  <div className="font-semibold text-gray-700">Trabajo Garantizado</div>
                  <div className="text-gray-600">Si algo falla por nuestro trabajo, lo reparamos sin costo adicional.</div>
                </div>
              </div>
              
              {/* Additional trust elements */}
              <div className="border-t border-gray-200 mt-6 pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs text-gray-600">
                  <div className="flex flex-col items-center">
                    <span className="font-semibold text-green-700">✓ Materiales de Calidad</span>
                    <span>Marcas reconocidas</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-semibold text-blue-700">✓ Técnicos Certificados</span>
                    <span>Años de experiencia</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-semibold text-purple-700">✓ Diagnóstico Honesto</span>
                    <span>Te decimos lo que necesitas</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-semibold text-orange-700">✓ Precios Justos</span>
                    <span>Competitivos en El Seibo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <button
              onClick={() => setSelectedService(null)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
            >
              <ArrowLeft size={20} />
              Cambiar servicio
            </button>
            <CalendlyEmbed selectedService={selectedService} />
          </div>
        )}
      </div>
    </div>
  )
} 