'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Zap, Wrench, Thermometer, Droplets, Hammer, Shield, LogIn, UserPlus } from 'lucide-react'
import { AuthModal } from '@/components/AuthModal'
import { useAuthStore } from '@/store/auth'

export default function HomePage() {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean
    defaultTab?: 'login' | 'register'
    defaultUserType?: 'customer' | 'technician'
  }>({
    isOpen: false
  })
  
  const { user, logout } = useAuthStore()
  const currentStep = 1
  const totalSteps = 5

  const serviceCategories = [
    {
      id: 'electrical',
      icon: Zap,
      title: 'Servicios Eléctricos',
      subtitle: 'Instalaciones, reparaciones y emergencias',
      description: 'Técnicos certificados para instalaciones eléctricas, reparaciones, mantenimiento y servicios de emergencia 24/7.',
      color: 'border-blue-200 hover:border-blue-300 hover:bg-blue-50',
      iconColor: 'text-blue-600',
      available: true,
      badge: 'Disponible'
    },
    {
      id: 'plumbing',
      icon: Droplets,
      title: 'Servicios de Plomería',
      subtitle: 'Instalaciones y reparaciones de tuberías',
      description: 'Reparación de fugas, instalación de tuberías, destapado de drenajes y servicios de fontanería.',
      color: 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
      iconColor: 'text-gray-400',
      available: false,
      badge: 'Próximamente'
    },
    {
      id: 'hvac',
      icon: Thermometer,
      title: 'Aire Acondicionado',
      subtitle: 'Instalación y mantenimiento de A/C',
      description: 'Instalación, reparación y mantenimiento de sistemas de aire acondicionado y climatización.',
      color: 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
      iconColor: 'text-gray-400',
      available: false,
      badge: 'Próximamente'
    },
    {
      id: 'general',
      icon: Hammer,
      title: 'Servicios Generales',
      subtitle: 'Reparaciones y mantenimiento del hogar',
      description: 'Carpintería, pintura, reparaciones menores y servicios generales de mantenimiento.',
      color: 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
      iconColor: 'text-gray-400',
      available: false,
      badge: 'Próximamente'
    },
    {
      id: 'security',
      icon: Shield,
      title: 'Seguridad',
      subtitle: 'Cámaras y sistemas de seguridad',
      description: 'Instalación de cámaras de seguridad, alarmas y sistemas de monitoreo para hogar y empresa.',
      color: 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
      iconColor: 'text-gray-400',
      available: false,
      badge: 'Próximamente'
    },
    {
      id: 'appliances',
      icon: Wrench,
      title: 'Electrodomésticos',
      subtitle: 'Reparación de electrodomésticos',
      description: 'Reparación y mantenimiento de lavadoras, refrigeradoras, estufas y otros electrodomésticos.',
      color: 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
      iconColor: 'text-gray-400',
      available: false,
      badge: 'Próximamente'
    }
  ]

  const handleServiceSelect = async (serviceId: string) => {
    const service = serviceCategories.find(s => s.id === serviceId)
    if (!service?.available) return
    
    setSelectedService(serviceId)
    setIsNavigating(true)
    
    // Small delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Navigate to booking page for electrical services
    if (serviceId === 'electrical') {
      window.location.href = `/booking`
    }
  }

  const openAuthModal = (tab: 'login' | 'register', userType?: 'customer' | 'technician') => {
    setAuthModal({
      isOpen: true,
      defaultTab: tab,
      defaultUserType: userType
    })
  }

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-blue-600 text-white py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Zap className="h-8 w-8 text-yellow-300" />
              <div>
                <h1 className="text-3xl font-bold">MultiServicios</h1>
                <p className="text-blue-100 text-lg">Servicios Profesionales para el Hogar</p>
              </div>
            </div>
            
            {/* Authentication Buttons */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link
                    href={user.user_type === 'technician' ? '/dashboard' : '/customer-dashboard'}
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors font-medium"
                  >
                    Mi Panel
                  </Link>
                  <button
                    onClick={logout}
                    className="px-4 py-2 border border-blue-300 hover:bg-blue-700 rounded-lg transition-colors font-medium"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="flex items-center space-x-2 px-4 py-2 border border-blue-300 hover:bg-blue-700 rounded-lg transition-colors font-medium"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Iniciar Sesión</span>
                  </button>
                  <button
                    onClick={() => openAuthModal('register')}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors font-medium"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Registrarse</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Paso {currentStep} de {totalSteps}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}% completado</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              ¿Qué tipo de servicio necesita?
            </h2>
            <p className="text-gray-600">
              Seleccione la categoría de servicio que necesita para su hogar o negocio
            </p>
          </div>

          {/* Service Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {serviceCategories.map((service) => {
              const Icon = service.icon
              const isSelected = selectedService === service.id
              const isAvailable = service.available
              
              return (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id)}
                  disabled={isNavigating || !isAvailable}
                  className={`
                    relative p-6 border-2 rounded-lg text-left transition-all duration-200
                    ${isSelected 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : isAvailable
                        ? `border-gray-200 bg-white hover:shadow-md ${service.color}`
                        : 'border-gray-200 bg-gray-50 opacity-75'
                    }
                    ${isNavigating || !isAvailable ? 'cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {/* Service Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      isAvailable 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {service.badge}
                    </span>
                  </div>

                  {/* Service Icon */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`
                      w-12 h-12 rounded-lg flex items-center justify-center
                      ${isSelected ? 'bg-blue-100' : isAvailable ? 'bg-gray-100' : 'bg-gray-50'}
                    `}>
                      <Icon className={`
                        w-6 h-6 
                        ${isSelected ? 'text-blue-600' : service.iconColor}
                      `} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`
                        text-lg font-semibold
                        ${isSelected ? 'text-blue-900' : isAvailable ? 'text-gray-900' : 'text-gray-500'}
                      `}>
                        {service.title}
                      </h3>
                      <p className={`
                        text-sm
                        ${isSelected ? 'text-blue-700' : isAvailable ? 'text-gray-600' : 'text-gray-400'}
                      `}>
                        {service.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Service Description */}
                  <p className={`
                    text-sm leading-relaxed
                    ${isSelected ? 'text-blue-800' : isAvailable ? 'text-gray-600' : 'text-gray-400'}
                  `}>
                    {service.description}
                  </p>

                  {/* "Coming Soon" Overlay for unavailable services */}
                  {!isAvailable && (
                    <div className="absolute inset-0 rounded-lg bg-gray-50 bg-opacity-90 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-lg font-medium text-gray-600 mb-1">Próximamente</p>
                        <p className="text-sm text-gray-500">Este servicio estará disponible pronto</p>
                      </div>
                    </div>
                  )}

                  {/* Selection Indicator for available services */}
                  {isSelected && isAvailable && (
                    <div className="absolute inset-0 rounded-lg border-2 border-blue-500 pointer-events-none">
                      <div className="absolute top-3 left-3 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        {isNavigating ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        ) : (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Loading State */}
          {isNavigating && (
            <div className="text-center py-4">
              <div className="inline-flex items-center text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Redirigiendo a servicios eléctricos...
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => openAuthModal('login', 'technician')}
              className={`text-gray-600 hover:text-gray-800 font-medium transition-colors ${
                isNavigating ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              ¿Eres técnico? Accede al panel
            </button>
            
            {!user && (
              <div className="text-sm text-gray-500">
                ¿Ya tienes cuenta?{' '}
                <button
                  onClick={() => openAuthModal('login')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Inicia sesión
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm font-bold">!</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Expandiendo Nuestros Servicios
              </h3>
              <p className="text-blue-800 mb-3">
                Actualmente ofrecemos servicios eléctricos profesionales. Próximamente añadiremos plomería, 
                aire acondicionado, seguridad y otros servicios para el hogar.
              </p>
              <p className="text-sm text-blue-700">
                ¿Necesita alguno de estos servicios? Contáctenos por WhatsApp y le ayudaremos a encontrar 
                un proveedor confiable en su área.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        defaultTab={authModal.defaultTab}
        defaultUserType={authModal.defaultUserType}
      />
    </div>
  )
} 