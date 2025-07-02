'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useSpring as useReactSpring, animated } from '@react-spring/web'
import Link from 'next/link'
import Image from 'next/image'
import { Zap, Wrench, Thermometer, Droplets, Hammer, Shield, LogIn, UserPlus, Settings, Bell, User, Menu, X, Star, Trophy, Gauge, Sparkles, Atom, Rocket, ArrowRight, CheckCircle, Heart } from 'lucide-react'
import { AuthModal } from '@/components/AuthModal'
import { SettingsModal } from '@/components/SettingsModal'
import { useAuthStore } from '@/store/auth'
import { NotificationBell } from '@/components/notifications/NotificationBell'
import { SEO, generateLocalBusinessStructuredData, StructuredData } from '@/components/SEO'

// Custom Cursor Component with Modern Effects
const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [cursorVariant, setCursorVariant] = useState('default')

  useEffect(() => {
    const cursor = cursorRef.current
    const cursorDot = cursorDotRef.current
    if (!cursor || !cursorDot) return

    const moveCursor = (e: MouseEvent) => {
      cursor.style.left = e.clientX + 'px'
      cursor.style.top = e.clientY + 'px'
      cursorDot.style.left = e.clientX + 'px'
      cursorDot.style.top = e.clientY + 'px'
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    // Add event listeners to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, .glass-card, .service-card')
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    document.addEventListener('mousemove', moveCursor)

    return () => {
      document.removeEventListener('mousemove', moveCursor)
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [])

  return (
    <>
      <motion.div
        ref={cursorRef}
        className="custom-cursor"
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.8 : 0.3,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
      <motion.div
        ref={cursorDotRef}
        className="custom-cursor-dot"
        animate={{
          scale: isHovering ? 0.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    </>
  )
}

// Floating Particles Background
const FloatingParticles = () => {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })
  const particles = Array.from({ length: 20 }, (_, i) => i)

  useEffect(() => {
    // Set initial dimensions on client side
    if (typeof window !== 'undefined') {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })

      // Update dimensions on window resize
      const handleResize = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        })
      }

      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="floating-particles">
      {particles.map((particle) => (
        <motion.div
          key={particle}
          className="particle"
          initial={{
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
            opacity: 0
          }}
          animate={{
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  )
}

// Achievement/Gamification Component
const AchievementBadge = ({ achievement, isUnlocked }: { achievement: any, isUnlocked: boolean }) => {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ 
        scale: isUnlocked ? 1 : 0.8, 
        rotate: 0,
        filter: isUnlocked ? "grayscale(0%)" : "grayscale(100%)"
      }}
      whileHover={{ scale: 1.1, y: -5 }}
      className={`achievement-badge ${isUnlocked ? 'unlocked' : 'locked'}`}
    >
      <div className="glass-base p-3 rounded-xl">
        <Trophy className={`h-6 w-6 ${isUnlocked ? 'text-yellow-500' : 'text-gray-400'}`} />
        <span className="text-xs mt-1">{achievement.name}</span>
      </div>
    </motion.div>
  )
}

// Modern Progress Indicator with Gamification
const ModernProgress = ({ currentStep, totalSteps }: { currentStep: number, totalSteps: number }) => {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="modern-progress-container">
      <motion.div 
        className="progress-track"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <motion.div
          className="progress-glow"
          animate={{ 
            x: `${progress}%`,
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            x: { duration: 1.5, ease: "easeOut" },
            opacity: { duration: 2, repeat: Infinity }
          }}
        />
      </motion.div>
      <motion.div 
        className="progress-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Sparkles className="h-4 w-4 text-blue-500" />
        <span className="text-sm font-medium">Paso {currentStep} de {totalSteps}</span>
      </motion.div>
    </div>
  )
}

export default function HomePage() {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [touchedCard, setTouchedCard] = useState<string | null>(null)
  const [loadingTime, setLoadingTime] = useState<number>(0)
  const [pageSpeed, setPageSpeed] = useState<'fast' | 'good' | 'slow'>('fast')
  const [userExperience, setUserExperience] = useState({
    level: 1,
    points: 0,
    achievements: ['first-visit'],
    completedActions: [] as string[]
  })
  
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

  // Mobile detection, performance monitoring, and responsive effects
  useEffect(() => {
    const startTime = performance.now()
    
    // Detect mobile device
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768
      setIsMobile(isMobileDevice)
      return isMobileDevice
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Only track mouse on desktop
      if (!checkMobile()) {
        setMousePosition({ x: e.clientX, y: e.clientY })
      }
    }

    const handleResize = () => {
      checkMobile()
    }
    
    // HOLY TRINITY: Speed Monitoring
    const measureSpeed = () => {
      const endTime = performance.now()
      const loadTime = endTime - startTime
      setLoadingTime(Math.round(loadTime))
      
      if (loadTime < 1000) {
        setPageSpeed('fast')
      } else if (loadTime < 2000) {
        setPageSpeed('good')
      } else {
        setPageSpeed('slow')
      }
    }
    
    // Initial checks
    checkMobile()
    setIsLoaded(true)
    
    // Add event listeners only for desktop
    if (!checkMobile()) {
      window.addEventListener('mousemove', handleMouseMove)
    }
    window.addEventListener('resize', handleResize)
    
    // Measure speed after all resources load
    if (document.readyState === 'complete') {
      measureSpeed()
    } else {
      window.addEventListener('load', measureSpeed)
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('load', measureSpeed)
    }
  }, [])

  // Enhanced service categories with holy trinity improvements
  const serviceCategories = [
    {
      id: 'electrical',
      icon: Zap,
      title: 'Servicios Eléctricos',
      subtitle: '⚡ ACTIVO AHORA - Técnicos Listos',
      description: '🔌 Emergencias 24/7 | 1000+ Clientes Satisfechos | Técnicos Certificados | Garantía Total',
      glassClass: 'glass-electric',
      iconColor: 'text-blue-600',
      available: true,
      badge: '✨ DISPONIBLE',
      badgeClass: 'glass-success',
      experience: 50,
      popularity: 98,
      rating: 4.9,
      completionTime: '30-60 min',
      features: ['Emergencias 24/7', 'Técnicos Certificados', 'Garantía Incluida'],
      gradient: 'from-blue-400 via-blue-500 to-blue-600',
      // HOLY TRINITY ENHANCEMENTS
      trustSignals: {
        certifications: ['Licencia CDEEE', 'Seguros ARS'],
        recentBookings: '23 servicios hoy',
        responseTime: '15 min promedio',
        satisfaction: '98% satisfacción'
      },
      instantBooking: true,
      priceRange: 'RD$ 800-2,500'
    },
    {
      id: 'plumbing',
      icon: Droplets,
      title: 'Servicios de Plomería',
      subtitle: 'Instalaciones y reparaciones profesionales',
      description: 'Reparación de fugas, instalación de tuberías, destapado de drenajes y servicios de fontanería.',
      glassClass: 'glass-blue',
      iconColor: 'text-cyan-500',
      available: false,
      badge: 'Próximamente Q1 2025',
      badgeClass: 'glass-purple',
      experience: 45,
      popularity: 85,
      rating: 4.7,
      completionTime: '45-90 min',
      features: ['Reparaciones', 'Instalaciones', 'Emergencias'],
      gradient: 'from-cyan-400 via-cyan-500 to-blue-500'
    },
    {
      id: 'hvac',
      icon: Thermometer,
      title: 'Aire Acondicionado',
      subtitle: 'Clima perfecto para tu hogar',
      description: 'Instalación, reparación y mantenimiento de sistemas de aire acondicionado y climatización.',
      glassClass: 'glass-blue',
      iconColor: 'text-green-500',
      available: false,
      badge: 'Próximamente Q2 2025',
      badgeClass: 'glass-purple',
      experience: 60,
      popularity: 92,
      rating: 4.8,
      completionTime: '60-120 min',
      features: ['Instalación', 'Mantenimiento', 'Reparación'],
      gradient: 'from-green-400 via-emerald-500 to-green-600'
    },
    {
      id: 'general',
      icon: Hammer,
      title: 'Servicios Generales',
      subtitle: 'Mantenimiento integral del hogar',
      description: 'Carpintería, pintura, reparaciones menores y servicios generales de mantenimiento.',
      glassClass: 'glass-blue',
      iconColor: 'text-orange-500',
      available: false,
      badge: 'Próximamente Q2 2025',
      badgeClass: 'glass-purple',
      experience: 40,
      popularity: 78,
      rating: 4.6,
      completionTime: '90-180 min',
      features: ['Carpintería', 'Pintura', 'Reparaciones'],
      gradient: 'from-orange-400 via-orange-500 to-red-500'
    },
    {
      id: 'security',
      icon: Shield,
      title: 'Seguridad',
      subtitle: 'Protección avanzada 24/7',
      description: 'Instalación de cámaras de seguridad, alarmas y sistemas de monitoreo para hogar y empresa.',
      glassClass: 'glass-blue',
      iconColor: 'text-purple-500',
      available: false,
      badge: 'Próximamente Q3 2025',
      badgeClass: 'glass-purple',
      experience: 70,
      popularity: 88,
      rating: 4.8,
      completionTime: '120-240 min',
      features: ['Cámaras', 'Alarmas', 'Monitoreo'],
      gradient: 'from-purple-400 via-purple-500 to-indigo-600'
    },
    {
      id: 'appliances',
      icon: Wrench,
      title: 'Electrodomésticos',
      subtitle: 'Reparación especializada',
      description: 'Reparación y mantenimiento de lavadoras, refrigeradoras, estufas y otros electrodomésticos.',
      glassClass: 'glass-blue',
      iconColor: 'text-red-500',
      available: false,
      badge: 'Próximamente Q3 2025',
      badgeClass: 'glass-purple',
      experience: 55,
      popularity: 82,
      rating: 4.7,
      completionTime: '60-150 min',
      features: ['Diagnóstico', 'Reparación', 'Mantenimiento'],
      gradient: 'from-red-400 via-red-500 to-pink-500'
    }
  ]

  // Achievements system
  const achievements = [
    { id: 'first-visit', name: 'Explorador', description: 'Primera visita al sitio', icon: Star },
    { id: 'service-selected', name: 'Decisivo', description: 'Seleccionó un servicio', icon: CheckCircle },
    { id: 'booking-completed', name: 'Comprometido', description: 'Completó una reserva', icon: Heart },
    { id: 'power-user', name: 'Usuario Experto', description: 'Múltiples servicios', icon: Trophy }
  ]

  const handleServiceSelect = async (serviceId: string) => {
    console.log('🚀 Service clicked:', serviceId)
    
    try {
      const service = serviceCategories.find(s => s.id === serviceId)
      console.log('📋 Service found:', service)
      
      if (!service?.available) {
        console.log('❌ Service not available:', serviceId)
        // Add micro-interaction for unavailable service
        return
      }
      
      console.log('✅ Service available, proceeding...')
      setSelectedService(serviceId)
      setIsNavigating(true)
      
      // Add achievement points
      setUserExperience(prev => ({
        ...prev,
        points: prev.points + service.experience,
        completedActions: [...prev.completedActions, 'service-selected']
      }))
      
      // Navigate with smooth animation
      if (serviceId === 'electrical') {
        console.log('⚡ Navigating to booking page')
        await new Promise(resolve => setTimeout(resolve, 800)) // Animation delay
        window.location.href = '/booking'
      }
    } catch (error) {
      console.error('💥 Error in handleServiceSelect:', error)
    }
  }

  const openAuthModal = (tab: 'login' | 'register', userType?: 'customer' | 'technician') => {
    console.log('🔐 Auth button clicked:', tab, userType)
    
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
    <div className="min-h-screen relative overflow-hidden">
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

      {/* Desktop-only effects */}
      {!isMobile && (
        <>
          {/* Custom Cursor */}
          <CustomCursor />
          {/* Floating Particles Background */}
          <FloatingParticles />
        </>
      )}

      {/* Enhanced Animated Glass Background */}
      <motion.div 
        className="modern-glass-background"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 20%, rgba(120, 119, 198, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 40% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%)',
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Enhanced Navigation with Micro-interactions */}
      <motion.header 
        className="glass-nav-modern sticky top-0 z-40"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 lg:py-6">
            {/* Enhanced Logo Section */}
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className="p-3 glass-electric rounded-2xl relative overflow-hidden"
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.6 }}
              >
                <Zap className="h-8 w-8 text-blue-600 relative z-10" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
              <div>
                <motion.h1 
                  className="text-2xl lg:text-3xl font-bold gradient-text"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  MultiServicios
                </motion.h1>
                <motion.p 
                  className="text-sm text-gray-600 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  El Seibo & Hato Mayor
                </motion.p>
              </div>
            </motion.div>

            {/* Enhanced User Experience Indicators */}
            <div className="hidden lg:flex items-center space-x-4">
              <motion.div 
                className="glass-base px-4 py-2 rounded-xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center space-x-2">
                  <Gauge className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Nivel {userExperience.level}</span>
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">{userExperience.points} pts</span>
                </div>
              </motion.div>

              {/* Achievement Badges */}
              <div className="flex space-x-2">
                {achievements.slice(0, 3).map((achievement, index) => (
                  <AchievementBadge 
                    key={achievement.id}
                    achievement={achievement}
                    isUnlocked={userExperience.achievements.includes(achievement.id)}
                  />
                ))}
              </div>
            </div>

            {/* Enhanced Auth Buttons */}
            <div className="flex items-center space-x-3">
              {user ? (
                <motion.div 
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <NotificationBell />
                  <motion.button
                    onClick={() => setSettingsModal({ isOpen: true })}
                    className="glass-button p-3 rounded-xl"
                    whileHover={{ scale: 1.05, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Settings className="h-5 w-5 text-gray-700" />
                  </motion.button>
                  <motion.button
                    onClick={logout}
                    className="glass-button px-4 py-2 rounded-xl text-red-600 font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Salir
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div 
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <motion.button
                    onClick={() => openAuthModal('login')}
                    className="glass-button px-4 py-2 rounded-xl font-medium flex items-center space-x-2"
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Iniciar Sesión</span>
                  </motion.button>
                  <motion.button
                    onClick={() => openAuthModal('register')}
                    className="modern-cta-button px-6 py-3 rounded-xl font-bold text-white flex items-center space-x-2"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Registrarse</span>
                    <Sparkles className="h-4 w-4" />
                  </motion.button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Modern Progress Indicator */}
      <ModernProgress currentStep={currentStep} totalSteps={totalSteps} />

      {/* Enhanced Main Content - Mobile First */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* HOLY TRINITY: Instant Trust Header - Mobile First */}
        <motion.div 
          className="mb-8 sm:mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="glass-success p-4 rounded-2xl">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
              >
                <div className="text-2xl font-black text-green-600">1000+</div>
                <div className="text-xs font-medium text-gray-700">Clientes Felices</div>
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <div className="text-2xl font-black text-blue-600">15min</div>
                <div className="text-xs font-medium text-gray-700">Respuesta Avg</div>
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <div className="text-2xl font-black text-yellow-600">4.9★</div>
                <div className="text-xs font-medium text-gray-700">Calificación</div>
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                <div className="text-2xl font-black text-purple-600">8años</div>
                <div className="text-xs font-medium text-gray-700">Experiencia</div>
              </motion.div>
            </div>
            
            {/* HOLY TRINITY: Speed Indicator */}
            {loadingTime > 0 && (
              <motion.div 
                className="mt-4 pt-4 border-t border-white/20"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center justify-center space-x-3">
                  <motion.div
                    animate={{ 
                      rotate: 360,
                      scale: pageSpeed === 'fast' ? [1, 1.1, 1] : 1
                    }}
                    transition={{ 
                      rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                      scale: { duration: 0.5, repeat: Infinity }
                    }}
                  >
                    <Gauge className={`h-5 w-5 ${
                      pageSpeed === 'fast' ? 'text-green-500' : 
                      pageSpeed === 'good' ? 'text-yellow-500' : 'text-red-500'
                    }`} />
                  </motion.div>
                  <div className="text-center">
                    <div className={`text-sm font-bold ${
                      pageSpeed === 'fast' ? 'text-green-600' : 
                      pageSpeed === 'good' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {loadingTime}ms - {
                        pageSpeed === 'fast' ? '⚡ SÚPER RÁPIDO' : 
                        pageSpeed === 'good' ? '🚀 RÁPIDO' : '⏳ OPTIMIZANDO'
                      }
                    </div>
                    <div className="text-xs text-gray-600">Tiempo de Carga</div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Hero Section with Advanced Animations - Mobile Optimized */}
        <motion.div 
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center space-x-2 glass-electric px-6 py-3 rounded-full mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
          >
            <Zap className="h-5 w-5 text-blue-600" />
            <span className="font-bold text-blue-800">¡23 Servicios Completados Hoy!</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <CheckCircle className="h-5 w-5 text-blue-600" />
            </motion.div>
          </motion.div>

          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black mb-4 sm:mb-6 px-4 sm:px-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Servicios Profesionales
            </span>
            <br />
            <motion.span 
              className="text-gray-800"
              animate={{ 
                textShadow: [
                  "0 0 20px rgba(59, 130, 246, 0.5)",
                  "0 0 30px rgba(59, 130, 246, 0.8)",
                  "0 0 20px rgba(59, 130, 246, 0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              que Transforman Hogares
            </motion.span>
          </motion.h1>

          <motion.p 
            className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium px-4 sm:px-6 lg:px-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            🏆 <strong>1000+ clientes satisfechos</strong> confían en nuestro trabajo profesional. 
            <br />
            ⚡ <strong>Técnicos certificados</strong> disponibles <strong>24/7</strong> para emergencias.
            <br />
            🎯 <strong>Garantía total</strong> en todos nuestros servicios.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {['⚡ Respuesta Inmediata', '🛡️ Totalmente Asegurado', '🏆 Satisfacción Garantizada'].map((feature, index) => (
              <motion.div
                key={feature}
                className="glass-base px-4 py-2 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2 + index * 0.1 }}
              >
                <span className="font-medium text-gray-700">{feature}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Enhanced Service Selection with Mobile-First Bento Box Design */}
        <motion.div 
          className="mb-12 sm:mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Elige tu Servicio
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Selecciona el servicio que necesitas y conecta instantáneamente con nuestros técnicos expertos
            </p>
          </motion.div>

          {/* Modern Bento Grid Layout */}
          <div className="bento-grid gap-6">
            {serviceCategories.map((service, index) => (
              <motion.div
                key={service.id}
                className={`service-card ${service.id === 'electrical' ? 'featured-card' : ''} ${service.available ? 'available' : 'coming-soon'}`}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: 1.6 + index * 0.1,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                whileHover={!isMobile ? { 
                  scale: 1.02,
                  y: -8,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                } : {}}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => !isMobile && setHoveredCard(service.id)}
                onHoverEnd={() => !isMobile && setHoveredCard(null)}
                onTouchStart={() => isMobile && setTouchedCard(service.id)}
                onTouchEnd={() => isMobile && setTimeout(() => setTouchedCard(null), 150)}
                onClick={() => handleServiceSelect(service.id)}
              >
                {/* Card Background with Gradient */}
                <motion.div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.gradient} opacity-10`}
                  animate={{
                    opacity: (hoveredCard === service.id || touchedCard === service.id) ? 0.2 : 0.1
                  }}
                />

                {/* Availability Badge */}
                <motion.div
                  className={`absolute top-4 right-4 ${service.badgeClass} px-3 py-1 rounded-full z-10`}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 2 + index * 0.1 }}
                >
                  <span className="text-xs font-bold">{service.badge}</span>
                </motion.div>

                {/* Service Icon with Enhanced Animation */}
                <motion.div
                  className="relative mb-6"
                  animate={{
                    rotate: (hoveredCard === service.id || touchedCard === service.id) ? [0, -10, 10, 0] : 0,
                    scale: (hoveredCard === service.id || touchedCard === service.id) ? 1.1 : 1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <div className={`p-4 ${service.glassClass} rounded-2xl inline-block relative overflow-hidden`}>
                    <service.icon className={`h-8 w-8 ${service.iconColor} relative z-10`} />
                    {service.available && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                        animate={{ x: [-100, 100] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                    )}
                  </div>
                </motion.div>

                {/* Service Content */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm font-semibold text-blue-600 mb-3">
                      {service.subtitle}
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* HOLY TRINITY: Trust Signals + Instant Booking */}
                  {service.available && (
                    <motion.div 
                      className="space-y-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.5 + index * 0.1 }}
                    >
                      {/* Trust Signals Bar */}
                      <div className="glass-success p-3 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span className="font-bold">{service.rating} • {service.trustSignals?.satisfaction}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-green-600 font-bold">
                            <span>🟢 {service.trustSignals?.recentBookings}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-blue-600 font-medium">⚡ {service.trustSignals?.responseTime}</span>
                          <span className="text-purple-600 font-medium">💰 {service.priceRange}</span>
                        </div>
                      </div>
                      
                      {/* Trust Certifications */}
                      <div className="flex flex-wrap gap-1">
                        {service.trustSignals?.certifications.map((cert, certIndex) => (
                          <motion.span
                            key={cert}
                            className="glass-base px-2 py-1 rounded-md text-xs font-bold text-green-700 border border-green-200"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 3 + index * 0.1 + certIndex * 0.05 }}
                          >
                            ✅ {cert}
                          </motion.span>
                        ))}
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-1">
                        {service.features.map((feature, featureIndex) => (
                          <motion.span
                            key={feature}
                            className="glass-base px-2 py-1 rounded-md text-xs font-medium"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 3 + index * 0.1 + featureIndex * 0.05 }}
                          >
                            {feature}
                          </motion.span>
                        ))}
                      </div>

                      {/* Instant Booking CTA */}
                      <div className="pt-2">
                        <motion.div
                          className="modern-cta-button w-full py-3 rounded-xl text-center font-bold text-white relative overflow-hidden"
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          animate={{ 
                            boxShadow: (hoveredCard === service.id || touchedCard === service.id) ? 
                              "0 8px 25px rgba(59, 130, 246, 0.4)" : 
                              "0 4px 15px rgba(59, 130, 246, 0.2)"
                          }}
                        >
                          <motion.div
                            className="flex items-center justify-center space-x-2"
                            animate={{ x: (hoveredCard === service.id || touchedCard === service.id) ? 5 : 0 }}
                          >
                            <Zap className="h-5 w-5" />
                            <span>¡RESERVAR AHORA!</span>
                            <ArrowRight className="h-5 w-5" />
                          </motion.div>
                          {/* Instant feedback animation */}
                          <motion.div
                            className="absolute inset-0 bg-white opacity-0"
                            animate={{
                              opacity: (touchedCard === service.id) ? [0, 0.3, 0] : 0
                            }}
                            transition={{ duration: 0.3 }}
                          />
                        </motion.div>
                        <p className="text-xs text-center text-gray-500 mt-1">
                          ⏱️ {service.completionTime} • 📞 Sin compromiso
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Coming Soon Content */}
                  {!service.available && (
                    <motion.div 
                      className="space-y-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.5 + index * 0.1 }}
                    >
                      <div className="text-center py-4">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                        </motion.div>
                        <p className="text-purple-600 font-bold text-sm">Próximamente</p>
                        <p className="text-xs text-gray-500 mt-1">+{service.experience} puntos de experiencia</p>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Desktop-only Hover Effects with Mouse Position */}
                {!isMobile && (
                  <AnimatePresence>
                    {hoveredCard === service.id && service.available && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`
                        }}
                      />
                    )}
                  </AnimatePresence>
                )}
                
                {/* Mobile Touch Effects */}
                {isMobile && (
                  <AnimatePresence>
                    {touchedCard === service.id && service.available && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        style={{
                          background: `radial-gradient(circle at center, rgba(59, 130, 246, 0.2) 0%, transparent 70%)`
                        }}
                      />
                    )}
                  </AnimatePresence>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust Indicators with Advanced Animations */}
        <motion.div 
          className="trust-section"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Confianza que Respalda Nuestro Trabajo
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Más de 8 años brindando servicios profesionales con la mejor tecnología y personal capacitado
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "100% Asegurado",
                description: "Cobertura total en todos nuestros servicios",
                color: "text-green-600",
                gradient: "from-green-400 to-emerald-500"
              },
              {
                icon: Star,
                title: "Calificación 4.9/5",
                description: "Basado en 1000+ reseñas verificadas",
                color: "text-yellow-600",
                gradient: "from-yellow-400 to-orange-500"
              },
              {
                icon: Zap,
                title: "Respuesta 24/7",
                description: "Emergencias atendidas en menos de 30 minutos",
                color: "text-blue-600",
                gradient: "from-blue-400 to-cyan-500"
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="glass-card p-8 text-center relative overflow-hidden group"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 3 + index * 0.2 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <motion.div
                  className={`p-4 rounded-2xl inline-block mb-6 bg-gradient-to-r ${item.gradient} opacity-20 group-hover:opacity-30 transition-opacity`}
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <item.icon className={`h-8 w-8 ${item.color}`} />
                </motion.div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
                
                {/* Hover Glow Effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at center, ${item.gradient.includes('green') ? 'rgba(34, 197, 94, 0.1)' : item.gradient.includes('yellow') ? 'rgba(251, 191, 36, 0.1)' : 'rgba(59, 130, 246, 0.1)'} 0%, transparent 70%)`
                  }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Loading State with Modern Animation */}
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-modal-overlay absolute inset-0"
              initial={{ backdropFilter: "blur(0px)" }}
              animate={{ backdropFilter: "blur(20px)" }}
            />
            <motion.div
              className="glass-modal p-8 rounded-3xl text-center relative z-10"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mb-4"
              >
                <Zap className="h-12 w-12 text-blue-600 mx-auto" />
              </motion.div>
              <h3 className="text-xl font-bold mb-2">¡Conectando con técnicos!</h3>
              <p className="text-gray-600">Preparando tu experiencia personalizada...</p>
              <motion.div
                className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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