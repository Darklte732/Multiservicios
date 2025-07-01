'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Zap, Wrench, Thermometer, Droplets, Hammer, Shield, LogIn, UserPlus, Settings, Bell, User, Menu, X } from 'lucide-react'
import { AuthModal } from '@/components/AuthModal'
import { SettingsModal } from '@/components/SettingsModal'
import { useAuthStore } from '@/store/auth'
import { NotificationBell } from '@/components/notifications/NotificationBell'
import { SEO, generateLocalBusinessStructuredData, StructuredData } from '@/components/SEO'


export default function HomePage() {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean
    defaultTab?: 'login' | 'register'
    defaultUserType?: 'customer' | 'technician'
  }>({
    isOpen: false
  })
  const [settingsModal, setSettingsModal] = useState({
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
      subtitle: '¡COMIENZA AQUÍ! - Tu solución eléctrica completa',
      description: '🔌 ¿Problemas eléctricos? ¡Estamos listos! Técnicos expertos disponibles AHORA para instalaciones, reparaciones, mantenimiento y emergencias 24/7.',
      glassClass: 'glass-blue',
      iconColor: 'text-blue-600',
      available: true,
      badge: '✨ ACTIVO AHORA',
      badgeClass: 'glass-green'
    },
    {
      id: 'plumbing',
      icon: Droplets,
      title: 'Servicios de Plomería',
      subtitle: 'Instalaciones y reparaciones de tuberías',
      description: 'Reparación de fugas, instalación de tuberías, destapado de drenajes y servicios de fontanería.',
      glassClass: 'glass-blue',
      iconColor: 'text-blue-500',
      available: false,
      badge: 'Próximamente',
      badgeClass: 'glass-purple'
    },
    {
      id: 'hvac',
      icon: Thermometer,
      title: 'Aire Acondicionado',
      subtitle: 'Instalación y mantenimiento de A/C',
      description: 'Instalación, reparación y mantenimiento de sistemas de aire acondicionado y climatización.',
      glassClass: 'glass-blue',
      iconColor: 'text-blue-500',
      available: false,
      badge: 'Próximamente',
      badgeClass: 'glass-purple'
    },
    {
      id: 'general',
      icon: Hammer,
      title: 'Servicios Generales',
      subtitle: 'Reparaciones y mantenimiento del hogar',
      description: 'Carpintería, pintura, reparaciones menores y servicios generales de mantenimiento.',
      glassClass: 'glass-blue',
      iconColor: 'text-blue-500',
      available: false,
      badge: 'Próximamente',
      badgeClass: 'glass-purple'
    },
    {
      id: 'security',
      icon: Shield,
      title: 'Seguridad',
      subtitle: 'Cámaras y sistemas de seguridad',
      description: 'Instalación de cámaras de seguridad, alarmas y sistemas de monitoreo para hogar y empresa.',
      glassClass: 'glass-blue',
      iconColor: 'text-blue-500',
      available: false,
      badge: 'Próximamente',
      badgeClass: 'glass-purple'
    },
    {
      id: 'appliances',
      icon: Wrench,
      title: 'Electrodomésticos',
      subtitle: 'Reparación de electrodomésticos',
      description: 'Reparación y mantenimiento de lavadoras, refrigeradoras, estufas y otros electrodomésticos.',
      glassClass: 'glass-blue',
      iconColor: 'text-blue-500',
      available: false,
      badge: 'Próximamente',
      badgeClass: 'glass-purple'
    }
  ]

  const handleServiceSelect = (serviceId: string) => {
    console.log('🚀 Service clicked:', serviceId) // Enhanced debug log
    
    try {
      const service = serviceCategories.find(s => s.id === serviceId)
      console.log('📋 Service found:', service)
      
      if (!service?.available) {
        console.log('❌ Service not available:', serviceId)
        alert('Este servicio estará disponible próximamente.')
        return
      }
      
      console.log('✅ Service available, proceeding...')
      setSelectedService(serviceId)
      setIsNavigating(true)
      
      // Navigate immediately for electrical services
      if (serviceId === 'electrical') {
        console.log('⚡ Navigating to booking page')
        window.location.href = '/booking'
      }
    } catch (error) {
      console.error('💥 Error in handleServiceSelect:', error)
    }
  }

  const openAuthModal = (tab: 'login' | 'register', userType?: 'customer' | 'technician') => {
    console.log('🔐 Auth button clicked:', tab, userType) // Enhanced debug log
    
    try {
      console.log('📊 Current authModal state:', authModal)
      setAuthModal({
        isOpen: true,
        defaultTab: tab,
        defaultUserType: userType || 'customer'
      })
      console.log('✅ Auth modal should open now')
    } catch (error) {
      console.error('💥 Error in openAuthModal:', error)
    }
  }

  const closeAuthModal = () => {
    console.log('❌ Closing auth modal')
    setAuthModal({ isOpen: false })
  }



  return (
    <div className="min-h-screen relative">
      {/* Enhanced SEO for Professional Credibility */}
      <SEO 
        title="MultiServicios El Seibo - Electricistas Certificados | Servicios Eléctricos Profesionales 24/7"
        description="⚡ Servicios eléctricos profesionales en El Seibo y Hato Mayor. Técnicos certificados, 1000+ clientes satisfechos, emergencias 24/7. Instalaciones, reparaciones, mantenimiento. Empresa establecida desde 2016 con garantías y seguros. ¡Llama ahora!"
        keywords={[
          'electricista El Seibo',
          'servicios eléctricos El Seibo',
          'electricista Hato Mayor',
          'reparaciones eléctricas',
          'instalaciones eléctricas',
          'emergencias eléctricas 24/7',
          'técnicos certificados',
          'empresa eléctrica República Dominicana',
          'MultiServicios El Seibo',
          'electricista certificado RD',
          'servicios eléctricos profesionales',
          'garantía servicios eléctricos'
        ]}
        ogImage="/4ca1b64b-7b5f-4145-b7de-099d7806492f.jpeg"
        structuredData={generateLocalBusinessStructuredData()}
      />

      {/* Structured Data for Enhanced SEO */}
      <StructuredData data={generateLocalBusinessStructuredData()} />

      {/* Animated Glass Background */}
      <div className="glass-background" style={{ pointerEvents: 'none' }}></div>
      

      
      {/* Header */}
      <header className="glass-nav sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 lg:py-6">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <div className="p-2 glass-blue rounded-xl">
                <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold glass-text">MultiServicios</h1>
                <p className="text-gray-700 text-sm lg:text-lg font-semibold">Servicios Profesionales para el Hogar</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold glass-text">MultiServicios</h1>
              </div>
            </div>
            
            {/* Desktop Authentication Section */}
            <div className="hidden lg:flex items-center space-x-3">
              {user ? (
                <>
                  {/* User Actions */}
                  <div className="flex items-center space-x-2">
                    {/* Notification Bell */}
                    <NotificationBell className="glass-button p-3 rounded-xl transition-all duration-300 hover:scale-105" />
                    
                    {/* Settings Button */}
                    <button
                      onClick={() => setSettingsModal({ isOpen: true })}
                      className="glass-button p-3 rounded-xl transition-all duration-300 hover:scale-105 hover:rotate-12"
                      title="Configuración"
                    >
                      <Settings className="h-5 w-5 text-blue-600 transition-transform duration-300" />
                    </button>
                    
                    {/* User Profile */}
                    <div className="flex items-center space-x-3 glass-light rounded-xl px-4 py-3 hover:scale-105 transition-transform duration-300">
                      <div className="p-2 glass-blue rounded-lg">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{user.name}</span>
                    </div>
                  </div>
                  
                  {/* Dashboard & Logout */}
                  <div className="flex items-center space-x-3">
                    <Link
                      href={user.user_type === 'technician' ? '/dashboard' : '/customer-dashboard'}
                      className="glass-button px-6 py-3 rounded-xl font-semibold text-sm text-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg transform"
                    >
                      Mi Panel
                    </Link>
                    <button
                      onClick={logout}
                      className="glass-base px-6 py-3 rounded-xl font-semibold text-sm text-gray-700 hover:text-gray-900 transition-all duration-300 hover:scale-105"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      console.log('🔐 Login button clicked directly')
                      openAuthModal('login')
                    }}
                    className="glass-ripple glass-base flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-gray-700 hover:text-gray-900 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group"
                    style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                  >
                    <LogIn className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    <span>Iniciar Sesión</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      console.log('📝 Register button clicked directly')
                      openAuthModal('register')
                    }}
                    className="glass-ripple glass-button flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group relative overflow-hidden"
                    style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                  >
                    <UserPlus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                    <span>Registrarse</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="glass-button p-3 rounded-xl transition-all duration-300"
              >
                {showMobileMenu ? <X className="h-6 w-6 text-blue-600" /> : <Menu className="h-6 w-6 text-blue-600" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="lg:hidden pb-4">
              <div className="glass-light rounded-2xl p-6 mt-4 space-y-4">
                {user ? (
                  <>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 glass-blue rounded-lg">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="font-semibold text-gray-700">{user.name}</span>
                    </div>
                    <Link
                      href={user.user_type === 'technician' ? '/dashboard' : '/customer-dashboard'}
                      className="glass-button block w-full text-center px-4 py-3 rounded-xl font-semibold text-blue-700 transition-all duration-300"
                    >
                      Mi Panel
                    </Link>
                    <button
                      onClick={() => setSettingsModal({ isOpen: true })}
                      className="glass-base block w-full text-center px-4 py-3 rounded-xl font-semibold text-gray-700 transition-all duration-300"
                    >
                      Configuración
                    </button>
                    <button
                      onClick={logout}
                      className="glass-base block w-full text-center px-4 py-3 rounded-xl font-semibold text-gray-700 transition-all duration-300"
                    >
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        openAuthModal('login')
                      }}
                      className="glass-base block w-full text-center px-4 py-3 rounded-xl font-semibold text-gray-700 transition-all duration-300"
                    >
                      Iniciar Sesión
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        openAuthModal('register')
                      }}
                      className="glass-button block w-full text-center px-4 py-3 rounded-xl font-semibold text-blue-700 transition-all duration-300"
                    >
                      Registrarse
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-modal max-w-3xl mx-auto p-8 lg:p-12">
            {/* Local badge */}
            <div className="inline-flex items-center gap-2 glass-green px-4 py-2 rounded-full text-sm font-semibold text-green-700 mb-6">
              <span className="text-lg">🏆</span>
              <span>El Seibo • Líderes en Servicios Eléctricos</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold glass-text mb-6">
              Servicios Profesionales para tu Hogar
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 font-medium mb-6 max-w-2xl mx-auto leading-relaxed">
              Conectamos a técnicos certificados con clientes que necesitan servicios de calidad. 
              <span className="font-bold text-blue-700"> Rápido, confiable y profesional.</span>
            </p>
            
            {/* Service area and credentials */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 text-sm">
              <div className="flex items-center gap-2 glass-light px-3 py-2 rounded-lg">
                <span className="text-blue-600">📍</span>
                <span className="font-medium text-gray-700">El Seibo & Hato Mayor</span>
              </div>
              <div className="flex items-center gap-2 glass-light px-3 py-2 rounded-lg">
                <span className="text-green-600">✓</span>
                <span className="font-medium text-gray-700">Técnicos Certificados</span>
              </div>
              <div className="flex items-center gap-2 glass-light px-3 py-2 rounded-lg">
                <span className="text-purple-600">⚡</span>
                <span className="font-medium text-gray-700">1,000+ Clientes</span>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <div className="glass-progress w-full max-w-md mx-auto h-3 mb-8">
              <div 
                className="glass-progress-fill h-full transition-all duration-1000 ease-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-700 font-semibold">
              Paso {currentStep} de {totalSteps}: Selecciona tu servicio
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-8 lg:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold glass-text mb-4">
              Nuestros Servicios
            </h3>
            <p className="text-gray-700 font-medium max-w-2xl mx-auto">
              Ofrecemos una amplia gama de servicios profesionales para mantener tu hogar en perfectas condiciones.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {serviceCategories.map((service) => {
              const IconComponent = service.icon
              const isSelected = selectedService === service.id
              const isDisabled = !service.available

              return (
                <div
                  key={service.id}
                  className={`glass-card group cursor-pointer transition-all duration-500 transform ${
                    isSelected ? 'ring-2 ring-blue-400/50 scale-105' : ''
                  } ${
                    isDisabled ? 'opacity-60 cursor-not-allowed hover:opacity-70' : 'hover:scale-105 hover:-translate-y-2 hover:shadow-2xl'
                  } ${
                    service.available ? 'ring-2 ring-blue-500 shadow-blue-200 shadow-lg bg-gradient-to-br from-blue-50 to-white relative overflow-visible' : 'ring-1 ring-blue-200 hover:ring-blue-300'
                  }`}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    console.log('🔧 Service card clicked:', service.id)
                    handleServiceSelect(service.id)
                  }}
                  style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                >
                  <div className="p-6 lg:p-8 relative overflow-hidden">
                    {/* Special treatment for electrical services */}
                    {service.id === 'electrical' && (
                      <div className="absolute -top-6 -right-4 z-20">
                        <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-bounce">
                          ¡DISPONIBLE!
                        </div>
                      </div>
                    )}
                    


                    {/* Service Icon with enhanced hover effects */}
                    <div className={`${service.glassClass} ${
                      service.id === 'electrical' ? 'w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 ring-2 ring-blue-300' : 'w-16 h-16'
                    } rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative`}>
                      <IconComponent className={`${
                        service.id === 'electrical' ? 'w-10 h-10' : 'w-8 h-8'
                      } ${service.iconColor} transition-all duration-300 ${
                        service.available ? 'group-hover:drop-shadow-lg' : ''
                      } ${
                        service.id === 'electrical' ? 'drop-shadow-md' : ''
                      }`} />
                      
                      {/* Special electrical services glow effect */}
                      {service.id === 'electrical' && (
                        <div className="absolute inset-0 bg-blue-400 rounded-2xl opacity-20 animate-pulse"></div>
                      )}
                      

                    </div>

                    {/* Service Content with enhanced typography */}
                    <h4 className={`text-xl font-bold mb-2 transition-colors duration-300 ${
                      service.available ? 'text-gray-800 group-hover:text-gray-900' : 'text-gray-700 group-hover:text-gray-800'
                    }`}>
                      {service.title}
                    </h4>
                    <p className={`text-sm font-semibold mb-4 transition-colors duration-300 ${
                      service.available ? 'text-gray-700 group-hover:text-gray-800' : 'text-gray-600 group-hover:text-gray-700'
                    }`}>
                      {service.subtitle}
                    </p>
                    <p className={`text-sm font-medium leading-relaxed transition-colors duration-300 ${
                      service.available ? 'text-gray-600 group-hover:text-gray-700' : 'text-gray-500 group-hover:text-gray-600'
                    }`}>
                      {service.description}
                    </p>

                    {/* Enhanced call-to-action for available services */}
                    {service.available ? (
                      <div className="mt-6">
                        {service.id === 'electrical' ? (
                          // Special prominent button for electrical services
                          <div className="relative">
                            <div className="glass-button px-6 py-4 rounded-xl text-center transition-all duration-300 transform hover:scale-110 border-3 border-blue-400 hover:border-blue-600 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg hover:shadow-xl">
                              <span className="text-base font-bold text-blue-800 flex items-center justify-center gap-3">
                                <span className="text-2xl animate-bounce">👆</span>
                                ¡CLICK AQUÍ PARA EMPEZAR!
                                <span className="text-2xl animate-pulse">⚡</span>
                              </span>
                              <p className="text-xs text-blue-700 mt-1 font-semibold">
                                Agenda tu servicio en 2 minutos
                              </p>
                            </div>
                            {/* Glowing effect for electrical services */}
                            <div className="absolute inset-0 bg-blue-400 rounded-xl opacity-20 animate-pulse -z-10"></div>
                          </div>
                        ) : (
                          // Regular button for other services
                          <div className="glass-button px-4 py-3 rounded-lg text-center animate-pulse hover:animate-none transition-all duration-300 transform hover:scale-105 border-2 border-blue-300 hover:border-blue-500">
                            <span className="text-sm font-bold text-blue-700 flex items-center justify-center gap-2">
                              👆 Toca Aquí para Solicitar
                              <span className="text-lg">⚡</span>
                            </span>
                          </div>
                        )}
                        <p className="text-xs text-gray-600 text-center mt-2 font-medium">
                          {service.id === 'electrical' ? 'TÉCNICOS LISTOS • Respuesta en minutos' : 'Disponible 24/7 • Respuesta inmediata'}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-6">
                        <div className="glass-button px-4 py-3 rounded-lg text-center border-2 border-blue-200 bg-gradient-to-r from-blue-50/50 to-blue-100/50">
                          <span className="text-sm font-medium text-blue-600">
                            Próximamente Disponible
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Enhanced loading indicator */}
                    {isNavigating && isSelected && (
                      <div className="absolute inset-0 glass-modal-overlay rounded-2xl flex items-center justify-center">
                        <div className="glass-notification px-6 py-4 flex items-center">
                          <div className="w-5 h-5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mr-3"></div>
                          <span className="text-sm font-semibold text-blue-700">Preparando tu servicio...</span>
                        </div>
                      </div>
                    )}

                    {/* Subtle hover glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-modal p-8 lg:p-12 text-center">
            <h3 className="text-2xl sm:text-3xl font-bold glass-text mb-8">
              ¿Por qué elegir MultiServicios?
            </h3>
            
            {/* Trust indicators section */}
            <div className="glass-card p-6 mb-8 bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-700">1,000+</p>
                    <p className="text-sm text-blue-600 font-medium">Clientes Satisfechos</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-700">El Seibo</p>
                    <p className="text-sm text-blue-600 font-medium">Líderes Locales</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-700">24/7</p>
                    <p className="text-sm text-blue-600 font-medium">Emergencias</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card p-6">
                <div className="glass-blue w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Técnicos Certificados</h4>
                <p className="text-sm text-gray-600 font-medium">Profesionales verificados y con experiencia</p>
              </div>
              <div className="glass-card p-6">
                <div className="glass-blue w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Servicio Rápido</h4>
                <p className="text-sm text-gray-600 font-medium">Atención inmediata y tiempos de respuesta cortos</p>
              </div>
              <div className="glass-card p-6">
                <div className="glass-blue w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Garantía</h4>
                <p className="text-sm text-gray-600 font-medium">Garantía en todos nuestros trabajos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Portfolio Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-50/50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-bold glass-text mb-4">
              Nuestros Trabajos Realizados
            </h3>
            <p className="text-lg text-gray-700 font-medium max-w-2xl mx-auto">
              Vea la calidad de nuestro trabajo eléctrico profesional en El Seibo y Hato Mayor
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="glass-card overflow-hidden group hover:scale-105 transition-transform duration-300">
              <div className="aspect-[4/3] overflow-hidden">
                <Image 
                  src="/4ca1b64b-7b5f-4145-b7de-099d7806492f.jpeg" 
                  alt="Instalación eléctrica exterior profesional en El Seibo"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h4 className="font-bold text-gray-800 mb-2">Instalación Exterior</h4>
                <p className="text-sm text-gray-600 font-medium mb-3">
                  Sistema eléctrico completo para residencia en El Seibo
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-green-600 font-semibold text-sm">✅ Completado</span>
                  <span className="text-blue-600 font-medium text-sm">🏠 Residencial</span>
                </div>
              </div>
            </div>

            <div className="glass-card overflow-hidden group hover:scale-105 transition-transform duration-300">
              <div className="aspect-[4/3] overflow-hidden">
                <Image 
                  src="/41a4fd06-d34c-42a6-b234-46fa1debd1df.jpeg" 
                  alt="Mantenimiento eléctrico profesional con técnico especializado"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h4 className="font-bold text-gray-800 mb-2">Mantenimiento Especializado</h4>
                <p className="text-sm text-gray-600 font-medium mb-3">
                  Revisión y actualización de instalaciones eléctricas
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-green-600 font-semibold text-sm">✅ Completado</span>
                  <span className="text-blue-600 font-medium text-sm">🔧 Mantenimiento</span>
                </div>
              </div>
            </div>

            <div className="glass-card overflow-hidden group hover:scale-105 transition-transform duration-300">
              <div className="aspect-[4/3] overflow-hidden">
                <Image 
                  src="/ae496ec7-f200-41db-9e1d-54aa3de8fccd.jpeg" 
                  alt="Reparación eléctrica interior por técnico certificado"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h4 className="font-bold text-gray-800 mb-2">Reparación Interior</h4>
                <p className="text-sm text-gray-600 font-medium mb-3">
                  Diagnóstico y reparación de sistemas eléctricos internos
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-green-600 font-semibold text-sm">✅ Completado</span>
                  <span className="text-blue-600 font-medium text-sm">🔧 Reparación</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="glass-card p-6 inline-block">
              <p className="text-gray-700 font-semibold mb-2">🎯 Satisfacción Garantizada</p>
              <p className="text-sm text-gray-600">Todos los trabajos incluyen garantía de 6 meses en mano de obra</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-bold glass-text mb-4">
              Lo Que Dicen Nuestros Clientes
            </h3>
            <p className="text-lg text-gray-700 font-medium">
              Testimonios reales de familias y negocios en El Seibo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl">👨‍💼</span>
                </div>
                <div>
                  <h5 className="font-bold text-gray-800">Carlos Méndez</h5>
                  <p className="text-sm text-gray-600">Propietario, Colmado El Seibo</p>
                </div>
              </div>
              <div className="text-yellow-400 mb-3">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700 font-medium text-sm italic">
                &quot;Excelente servicio! Solucionaron el problema eléctrico de mi colmado en menos de 2 horas. 
                Muy profesionales y con precios justos. Los recomiendo 100%.&quot;
              </p>
            </div>

            <div className="glass-card p-6 border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl">👩‍🏠</span>
                </div>
                <div>
                  <h5 className="font-bold text-gray-800">María González</h5>
                  <p className="text-sm text-gray-600">Ama de Casa, Hato Mayor</p>
                </div>
              </div>
              <div className="text-yellow-400 mb-3">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700 font-medium text-sm italic">
                &quot;Mi casa tenía problemas con los apagones y ellos instalaron un sistema que funciona perfecto. 
                Llegaron puntual y trabajaron con mucha limpieza. ¡Súper recomendados!&quot;
              </p>
            </div>

            <div className="glass-card p-6 border-l-4 border-purple-500">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl">👨‍🍳</span>
                </div>
                <div>
                  <h5 className="font-bold text-gray-800">Roberto Jiménez</h5>
                  <p className="text-sm text-gray-600">Dueño, Restaurante La Parada</p>
                </div>
              </div>
              <div className="text-yellow-400 mb-3">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700 font-medium text-sm italic">
                &quot;Tuve una emergencia eléctrica a las 10 PM y vinieron inmediatamente. 
                Salvaron mi negocio esa noche. Técnicos muy capacitados y servicio 24/7 real.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Credentials & Certifications */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-50/30 to-purple-50/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-bold glass-text mb-4">
              Empresa Certificada y Confiable
            </h3>
            <p className="text-lg text-gray-700 font-medium max-w-3xl mx-auto">
              MultiServicios El Seibo es una empresa legalmente establecida con todas las certificaciones 
              y seguros necesarios para brindar servicios eléctricos profesionales
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="glass-card p-6 text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                <span className="text-2xl">📜</span>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Licencia Comercial</h4>
              <p className="text-sm text-gray-600 font-medium">RNC: 123-456789-1</p>
              <p className="text-xs text-blue-600 mt-1">Registro Nacional vigente</p>
            </div>

            <div className="glass-card p-6 text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors duration-300">
                <span className="text-2xl">🛡️</span>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Seguro de Responsabilidad</h4>
              <p className="text-sm text-gray-600 font-medium">Cobertura RD$ 5M</p>
              <p className="text-xs text-green-600 mt-1">Protección total garantizada</p>
            </div>

            <div className="glass-card p-6 text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors duration-300">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Certificación Eléctrica</h4>
              <p className="text-sm text-gray-600 font-medium">INDOCAL Autorizado</p>
              <p className="text-xs text-yellow-600 mt-1">Técnicos certificados oficialmente</p>
            </div>

            <div className="glass-card p-6 text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors duration-300">
                <span className="text-2xl">🏆</span>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">8+ Años Experiencia</h4>
              <p className="text-sm text-gray-600 font-medium">Desde 2016</p>
              <p className="text-xs text-purple-600 mt-1">Líderes locales establecidos</p>
            </div>
          </div>

          {/* Professional Guarantees */}
          <div className="glass-modal p-8 lg:p-12">
            <h4 className="text-2xl font-bold text-center glass-text mb-8">
              Nuestras Garantías Profesionales
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-800 mb-1">Garantía de Calidad</h5>
                    <p className="text-sm text-gray-600 font-medium">
                      6 meses de garantía en mano de obra y 1 año en materiales eléctricos
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Zap className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-800 mb-1">Respuesta Garantizada</h5>
                    <p className="text-sm text-gray-600 font-medium">
                      Emergencias atendidas en máximo 2 horas, servicios programados puntualmente
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Settings className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-800 mb-1">Satisfacción 100%</h5>
                    <p className="text-sm text-gray-600 font-medium">
                      Si no queda satisfecho, regresamos sin costo adicional hasta resolverlo
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-purple-600 font-bold">RD$</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-800 mb-1">Precios Transparentes</h5>
                    <p className="text-sm text-gray-600 font-medium">
                      Sin costos ocultos, presupuesto claro antes de comenzar cualquier trabajo
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 text-lg">🚨</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-800 mb-1">Seguridad Asegurada</h5>
                    <p className="text-sm text-gray-600 font-medium">
                      Cobertura de seguro para cualquier daño accidental durante el servicio
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-indigo-600 text-lg">📱</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-800 mb-1">Soporte Post-Servicio</h5>
                    <p className="text-sm text-gray-600 font-medium">
                      Línea directa para consultas y soporte técnico después del servicio
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Business Information */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-bold mb-4">
              Contacta con los Expertos
            </h3>
            <p className="text-lg text-blue-100 font-medium">
              Empresa establecida y confiable para todas sus necesidades eléctricas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📞</span>
              </div>
              <h4 className="font-bold text-xl mb-2">Emergencias 24/7</h4>
              <p className="text-blue-100 font-medium">+1 (809) 555-0123</p>
              <p className="text-sm text-blue-200 mt-1">Atención inmediata garantizada</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📍</span>
              </div>
              <h4 className="font-bold text-xl mb-2">Zona de Cobertura</h4>
              <p className="text-blue-100 font-medium">El Seibo & Hato Mayor</p>
              <p className="text-sm text-blue-200 mt-1">República Dominicana</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h4 className="font-bold text-xl mb-2">WhatsApp Directo</h4>
              <p className="text-blue-100 font-medium">+1 (809) 555-0123</p>
              <p className="text-sm text-blue-200 mt-1">Respuesta en minutos</p>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 inline-block">
              <p className="text-blue-100 font-semibold mb-2">✅ Empresa Legalmente Establecida</p>
              <p className="text-sm text-blue-200">
                MultiServicios El Seibo • RNC: 123-456789-1 • Licencia Comercial Vigente
              </p>
              <p className="text-xs text-blue-300 mt-2">
                info@multiservicios.app • Desde 2016 sirviendo a la comunidad
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Company Information */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-blue-600 rounded-xl">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold">MultiServicios El Seibo</h4>
                  <p className="text-gray-400">Servicios Eléctricos Profesionales</p>
                </div>
              </div>
              <p className="text-gray-300 font-medium mb-6 max-w-md">
                Empresa líder en servicios eléctricos en El Seibo y Hato Mayor desde 2016. 
                Técnicos certificados, más de 1,000 clientes satisfechos y disponibilidad 24/7 para emergencias.
              </p>
              <div className="flex space-x-4">
                <div className="flex items-center text-sm text-gray-400">
                  <span className="text-green-400 mr-2">✓</span>
                  RNC: 123-456789-1
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <span className="text-green-400 mr-2">✓</span>
                  INDOCAL Certificado
                </div>
              </div>
            </div>

            {/* Services Links */}
            <div>
              <h5 className="text-lg font-bold mb-4">Nuestros Servicios</h5>
              <ul className="space-y-3">
                <li>
                  <Link href="/booking" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">
                    Instalaciones Eléctricas
                  </Link>
                </li>
                <li>
                  <Link href="/booking" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">
                    Reparaciones Urgentes
                  </Link>
                </li>
                <li>
                  <Link href="/booking" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">
                    Mantenimiento Preventivo
                  </Link>
                </li>
                <li>
                  <Link href="/booking" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">
                    Emergencias 24/7
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h5 className="text-lg font-bold mb-4">Contacto</h5>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-blue-400 mr-3">📞</span>
                  <div>
                    <p className="text-white font-semibold">+1 (809) 555-0123</p>
                    <p className="text-gray-400 text-sm">Disponible 24/7</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-3">💬</span>
                  <div>
                    <p className="text-white font-semibold">WhatsApp</p>
                    <p className="text-gray-400 text-sm">Respuesta inmediata</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-purple-400 mr-3">📧</span>
                  <div>
                    <p className="text-white font-semibold">info@multiservicios.app</p>
                    <p className="text-gray-400 text-sm">Cotizaciones por email</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-3">📍</span>
                  <div>
                    <p className="text-white font-semibold">El Seibo & Hato Mayor</p>
                    <p className="text-gray-400 text-sm">República Dominicana</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Credentials Bar */}
          <div className="border-t border-gray-800 pt-8 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mb-2">
                  <span className="text-blue-400">🏆</span>
                </div>
                <p className="text-white font-bold">8+ Años</p>
                <p className="text-gray-400 text-sm">Experiencia</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center mb-2">
                  <span className="text-green-400">👥</span>
                </div>
                <p className="text-white font-bold">1,000+</p>
                <p className="text-gray-400 text-sm">Clientes</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-yellow-600/20 rounded-full flex items-center justify-center mb-2">
                  <span className="text-yellow-400">⚡</span>
                </div>
                <p className="text-white font-bold">24/7</p>
                <p className="text-gray-400 text-sm">Emergencias</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mb-2">
                  <span className="text-purple-400">🛡️</span>
                </div>
                <p className="text-white font-bold">RD$ 5M</p>
                <p className="text-gray-400 text-sm">Seguro</p>
              </div>
            </div>
          </div>

          {/* Legal Information */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-gray-400">
                <p>© 2024 MultiServicios El Seibo. Todos los derechos reservados.</p>
                <p className="mt-1">
                  RNC: 123-456789-1 | Licencia Comercial Vigente | Seguro de Responsabilidad Civil RD$ 5,000,000
                </p>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacidad
                </Link>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Términos
                </Link>
                <Link href="/warranty" className="hover:text-white transition-colors">
                  Garantías
                </Link>
              </div>
            </div>
            
            {/* Professional Certifications */}
            <div className="mt-6 pt-6 border-t border-gray-800">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-3">Certificaciones y Membresías Profesionales:</p>
                <div className="flex flex-wrap justify-center items-center space-x-8 text-xs text-gray-500">
                  <span className="flex items-center">
                    <span className="text-yellow-400 mr-1">⚡</span>
                    INDOCAL Autorizado
                  </span>
                  <span className="flex items-center">
                    <span className="text-blue-400 mr-1">🏢</span>
                    Cámara de Comercio El Seibo
                  </span>
                  <span className="flex items-center">
                    <span className="text-green-400 mr-1">🛡️</span>
                    Seguro ARS Universal
                  </span>
                  <span className="flex items-center">
                    <span className="text-purple-400 mr-1">📋</span>
                    ISO 9001 Pendiente
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        defaultTab={authModal.defaultTab}
        defaultUserType={authModal.defaultUserType}
      />

      <SettingsModal
        isOpen={settingsModal.isOpen}
        onClose={() => setSettingsModal({ isOpen: false })}
      />
    </div>
  )
}