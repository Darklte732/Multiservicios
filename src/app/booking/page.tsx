'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Zap, Star, Shield, Clock, CheckCircle, Heart, Sparkles, Rocket, ArrowRight, Award, Eye, Users, Gauge, Trophy } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import CalendlyEmbed from '@/components/CalendlyEmbed'
import { ImageLightbox } from '@/components/ui/ImageLightbox'
import { ElevenLabsWidget } from '@/components/ElevenLabsWidget'
import { Footer } from '@/components/Footer'

// Custom Cursor Component (same as homepage)
const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)

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

// Floating Particles (same as homepage)
const FloatingParticles = () => {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })
  const [isClient, setIsClient] = useState(false)
  const [particles, setParticles] = useState<Array<{
    id: number;
    initialX: number;
    initialY: number;
    targetX: number;
    targetY: number;
    duration: number;
  }>>([])

  useEffect(() => {
    // Mark as client-side and set initial dimensions
    setIsClient(true)
    
    if (typeof window !== 'undefined') {
      const updateDimensions = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        })
      }

      updateDimensions()

      const handleResize = () => {
        updateDimensions()
      }

      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    // Generate particle data only on client side after dimensions are set
    if (isClient && dimensions.width > 0) {
      const particleData = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        initialX: Math.random() * dimensions.width,
        initialY: Math.random() * dimensions.height,
        targetX: Math.random() * dimensions.width,
        targetY: Math.random() * dimensions.height,
        duration: Math.random() * 25 + 15
      }))
      setParticles(particleData)
    }
  }, [isClient, dimensions])

  // Don't render particles on server side
  if (!isClient || particles.length === 0) {
    return <div className="floating-particles" />
  }

  return (
    <div className="floating-particles">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="particle"
          initial={{
            x: particle.initialX,
            y: particle.initialY,
            opacity: 0
          }}
          animate={{
            x: particle.targetX,
            y: particle.targetY,
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  )
}

// Enhanced Modern Progress with Gamification
const ModernProgress = ({ currentStep, totalSteps }: { currentStep: number, totalSteps: number }) => {
  const progress = (currentStep / totalSteps) * 100

  return (
    <motion.div 
      className="modern-progress-container"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div className="progress-track">
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
        <Rocket className="h-4 w-4 text-blue-500" />
        <span className="text-sm font-medium">Etapa {currentStep} de {totalSteps}</span>
        <Trophy className="h-4 w-4 text-yellow-500" />
      </motion.div>
    </motion.div>
  )
}

const services = [
  {
    id: 'emergencia',
    name: 'Emergencia Eléctrica',
    description: 'Atención inmediata 24/7 para problemas críticos',
    icon: 'Emergencia',
    iconComponent: Zap,
    color: 'glass-red',
    gradient: 'from-red-400 via-red-500 to-red-600',
    rating: 4.9,
    responseTime: '< 30 min',
    priority: 'ALTA',
    images: [
      '/2394664b-563a-48aa-900e-7ff62152b422.jpeg',
      '/4ca1b64b-7b5f-4145-b7de-099d7806492f.jpeg',
      '/ae496ec7-f200-41db-9e1d-54aa3de8fccd.jpeg'
    ],
    pricing: {
      diagnostic: 'RD$ 4,000 - 8,000',
      process: 'Evaluación de emergencia + reparación inmediata',
      included: [
        'Visita técnica especializada de emergencia',
        'Diagnóstico completo con equipo profesional',
        'Evaluación detallada del problema eléctrico',
        'Cotización transparente del trabajo necesario',
        'Cotización inmediata del trabajo de emergencia',
        'Garantía de 15 días en el trabajo realizado'
      ],
      note: 'Tarifa nocturna y fines de semana: +50% • Evaluación GRATIS si contratas el servicio',
      clarification: 'Si decides contratar nuestro servicio, la evaluación es COMPLETAMENTE GRATIS. Solo pagas si no contratas.',
      trustBadges: ['24/7 Disponible', 'Respuesta < 30min', '1000+ Emergencias Resueltas']
    }
  },
  {
    id: 'instalacion',
    name: 'Instalación Eléctrica',
    description: 'Instalaciones nuevas, conexiones y cableado profesional',
    icon: 'Instalación',
    iconComponent: Award,
    color: 'glass-blue',
    gradient: 'from-blue-400 via-blue-500 to-blue-600',
    rating: 4.8,
    responseTime: '< 2 horas',
    priority: 'ESTÁNDAR',
    images: [
      '/41a4fd06-d34c-42a6-b234-46fa1debd1df.jpeg',
      '/43a0a5cf-6fea-49e8-b174-7382d6ebfa5d.jpeg',
      '/6bb20545-9b5b-43f9-b5f8-d7bbb4bcbd5b.jpeg'
    ],
    pricing: {
      diagnostic: 'RD$ 3,000 - 6,000',
      process: 'Evaluación del proyecto + cotización detallada + instalación',
      included: [
        'Visita técnica y evaluación del sitio',
        'Análisis técnico completo del proyecto',
        'Medición y planificación de la instalación',
        'Cotización detallada de materiales y mano de obra',
        'Asesoría sobre mejores opciones y alternativas',
        'Garantía de 90 días en el trabajo completado'
      ],
      note: 'Evaluación GRATIS si contratas la instalación • Materiales se cotizan según el proyecto',
      clarification: 'Si decides contratar la instalación con nosotros, la evaluación es COMPLETAMENTE GRATIS. Solo pagas si no contratas.',
      trustBadges: ['Técnicos Certificados', 'Garantía 90 días', 'Materiales Premium']
    }
  },
  {
    id: 'mantenimiento',
    name: 'Mantenimiento Eléctrico',
    description: 'Mantenimiento preventivo y revisiones periódicas',
    icon: 'Mantenimiento',
    iconComponent: Shield,
    color: 'glass-green',
    gradient: 'from-green-400 via-green-500 to-green-600',
    rating: 4.7,
    responseTime: '< 4 horas',
    priority: 'PREVENTIVO',
    images: [
      '/7108a911-e716-4416-a620-97be93f4c140.jpeg',
      '/7c810f87-294b-4352-a3f6-7b9ace4d39c3.jpeg',
      '/b420cfaa-cec4-47a5-a363-d8bebabcef4d.jpeg'
    ],
    pricing: {
      diagnostic: 'RD$ 3,000 - 5,000',
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
      note: 'Evaluación GRATIS si contratas el mantenimiento • 20% descuento en mantenimientos programados',
      clarification: 'Si decides contratar el mantenimiento con nosotros, la evaluación es COMPLETAMENTE GRATIS. Solo pagas si no contratas.',
      trustBadges: ['Inspección Completa', '20% Descuento', 'Prevención Total']
    }
  },
  {
    id: 'reparacion',
    name: 'Reparación Eléctrica',
    description: 'Reparación de fallas y problemas eléctricos',
    icon: 'Reparación',
    iconComponent: Zap,
    color: 'glass-purple',
    gradient: 'from-purple-400 via-purple-500 to-purple-600',
    rating: 4.8,
    responseTime: '< 3 horas',
    priority: 'URGENTE',
    images: [
      '/cf629f37-1d13-4d7b-8774-7a5ce95bf946.jpeg',
      '/cf856cdc-a1e1-40ef-b079-eeab55418c17.jpeg',
      '/db2d6452-ebcc-4f8a-8588-9df01d849b74.jpeg'
    ],
    pricing: {
      diagnostic: 'RD$ 3,000 - 7,000',
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
      note: 'Evaluación GRATIS si contratas la reparación • Materiales especiales se cotizan por separado',
      clarification: 'Si decides contratar la reparación con nosotros, la evaluación es COMPLETAMENTE GRATIS. Solo pagas si no contratas.',
      trustBadges: ['Diagnóstico Avanzado', 'Garantía 45 días', 'Reparación Experta']
    }
  }
]

export default function BookingPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [touchedCard, setTouchedCard] = useState<string | null>(null)
  const [imageIndexes, setImageIndexes] = useState<{[key: string]: number}>({})
  
  // Lightbox state
  const [lightbox, setLightbox] = useState<{
    isOpen: boolean
    imageSrc: string
    imageTitle: string
    imageCategory: string
    currentIndex: number
  }>({
    isOpen: false,
    imageSrc: '',
    imageTitle: '',
    imageCategory: '',
    currentIndex: 0
  })

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768
      setIsMobile(isMobileDevice)
      return isMobileDevice
    }

    checkMobile()

    const handleResize = () => {
      checkMobile()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Auto-cycling image carousel
  useEffect(() => {
    const intervals: {[key: string]: NodeJS.Timeout} = {}

    services.forEach(service => {
      if (hoveredCard === service.id || touchedCard === service.id) {
        intervals[service.id] = setInterval(() => {
          setImageIndexes(prev => ({
            ...prev,
            [service.id]: ((prev[service.id] || 0) + 1) % service.images.length
          }))
        }, 1500) // Change image every 1.5 seconds
      }
    })

    return () => {
      Object.values(intervals).forEach(interval => clearInterval(interval))
    }
  }, [hoveredCard, touchedCard])

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId)
  }

  // Portfolio images data
  const portfolioImages = [
    { src: '/41a4fd06-d34c-42a6-b234-46fa1debd1df.jpeg', title: 'Instalación Moderna', category: 'Residencial' },
    { src: '/4ca1b64b-7b5f-4145-b7de-099d7806492f.jpeg', title: 'Panel Industrial', category: 'Comercial' },
    { src: '/ae496ec7-f200-41db-9e1d-54aa3de8fccd.jpeg', title: 'Cableado Completo', category: 'Industrial' },
    { src: '/2394664b-563a-48aa-900e-7ff62152b422.jpeg', title: 'Sistema Emergencia', category: 'Crítico' },
    { src: '/43a0a5cf-6fea-49e8-b174-7382d6ebfa5d.jpeg', title: 'Iluminación LED', category: 'Eficiente' },
    { src: '/6bb20545-9b5b-43f9-b5f8-d7bbb4bcbd5b.jpeg', title: 'Mantenimiento', category: 'Preventivo' },
    { src: '/7108a911-e716-4416-a620-97be93f4c140.jpeg', title: 'Reparación Pro', category: 'Especializada' },
    { src: '/7c810f87-294b-4352-a3f6-7b9ace4d39c3.jpeg', title: 'Instalación Total', category: 'Completa' }
  ]

  // Lightbox functions
  const openLightbox = (index: number) => {
    const image = portfolioImages[index]
    setLightbox({
      isOpen: true,
      imageSrc: image.src,
      imageTitle: image.title,
      imageCategory: image.category,
      currentIndex: index
    })
  }

  const closeLightbox = () => {
    setLightbox(prev => ({ ...prev, isOpen: false }))
  }

  const navigateLightbox = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? (lightbox.currentIndex - 1 + portfolioImages.length) % portfolioImages.length
      : (lightbox.currentIndex + 1) % portfolioImages.length
    
    const image = portfolioImages[newIndex]
    setLightbox(prev => ({
      ...prev,
      imageSrc: image.src,
      imageTitle: image.title,
      imageCategory: image.category,
      currentIndex: newIndex
    }))
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {!isMobile && (
        <>
          <CustomCursor />
          <FloatingParticles />
        </>
      )}

      <motion.div 
        className="modern-glass-background"
        animate={{
          background: [
            'radial-gradient(circle at 30% 40%, rgba(120, 119, 198, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 70% 60%, rgba(120, 119, 198, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 30%, rgba(120, 119, 198, 0.1) 0%, transparent 50%)',
          ]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      <motion.header 
        className="glass-nav-modern sticky top-0 z-40"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 lg:py-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/" className="flex items-center space-x-3 glass-button px-4 py-2 rounded-xl">
                <ArrowLeft className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-700">Volver al Inicio</span>
              </Link>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
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
                <h1 className="text-2xl lg:text-3xl font-bold gradient-text">
                  MultiServicios
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                  Reserva tu Servicio
                </p>
            </div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <ModernProgress currentStep={selectedService ? 3 : 2} totalSteps={5} />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <AnimatePresence mode="wait">
        {!selectedService ? (
            <motion.div 
              key="service-selection"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.6 }}
              className="space-y-8 sm:space-y-12"
            >
              <motion.div 
                className="text-center mb-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  className="inline-flex items-center space-x-2 glass-success px-6 py-3 rounded-full mb-8"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.4 }}
                >
                  <Clock className="h-5 w-5 text-green-600" />
                  <span className="font-bold text-green-800">15 Técnicos Activos Ahora</span>
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                    <Users className="h-5 w-5 text-green-600" />
                  </motion.div>
                </motion.div>

                <motion.h1 
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                    Reserva tu Servicio
                  </span>
                  <br />
                  <motion.span 
                    className="text-gray-800"
                    animate={{ 
                      textShadow: [
                        "0 0 20px rgba(59, 130, 246, 0.3)",
                        "0 0 30px rgba(59, 130, 246, 0.6)",
                        "0 0 20px rgba(59, 130, 246, 0.3)"
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    Eléctrico Profesional
                  </motion.span>
                </motion.h1>

                <motion.p 
                  className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  Selecciona el servicio que necesitas y conecta <strong>instantáneamente</strong> con nuestros técnicos certificados.
                  <br />
                                      <strong>Evaluación GRATIS</strong> si contratas el servicio • <strong>Garantía total</strong> incluida.
                </motion.p>

                <motion.div
                  className="mt-8 glass-success p-6 rounded-2xl max-w-4xl mx-auto"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.1 }}>
                      <div className="text-2xl font-black text-green-600">4.9</div>
                      <div className="text-xs font-medium text-gray-700">Calificación Promedio</div>
                    </motion.div>
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.2 }}>
                      <div className="text-2xl font-black text-blue-600">&lt; 30min</div>
                      <div className="text-xs font-medium text-gray-700">Tiempo Respuesta</div>
                    </motion.div>
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.3 }}>
                      <div className="text-2xl font-black text-purple-600">1000+</div>
                      <div className="text-xs font-medium text-gray-700">Clientes Satisfechos</div>
                    </motion.div>
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.4 }}>
                      <div className="text-2xl font-black text-orange-600">24/7</div>
                      <div className="text-xs font-medium text-gray-700">Emergencias</div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>

              <div className="bento-grid">
                {services.map((service, index) => (
                  <motion.div
                    key={service.id}
                    className={`service-card ${service.color} cursor-pointer relative overflow-hidden group`}
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      delay: 1.5 + index * 0.1,
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
                    {/* Priority Badge */}
                    <motion.div
                      className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold z-20 ${
                        service.priority === 'ALTA' ? 'bg-red-500/90 text-white border border-red-300/50' :
                        service.priority === 'URGENTE' ? 'bg-orange-500/90 text-white border border-orange-300/50' :
                        service.priority === 'PREVENTIVO' ? 'bg-green-500/90 text-white border border-green-300/50' :
                        'bg-blue-500/90 text-white border border-blue-300/50'
                      }`}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 2 + index * 0.1 }}
                    >
                      {service.priority}
                    </motion.div>

                    {/* Mini Carousel Section */}
                    <motion.div 
                      className="relative mb-6 overflow-hidden rounded-2xl bg-white/5 border border-white/10"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.8 + index * 0.1 }}
                    >
                      <div className="aspect-video relative">
                        <AnimatePresence mode="wait">
                          <motion.img
                            key={`${service.id}-${imageIndexes[service.id] || 0}`}
                            src={service.images[imageIndexes[service.id] || 0]}
                            alt={`${service.name} trabajo ${(imageIndexes[service.id] || 0) + 1}`}
                            className="w-full h-full object-cover"
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.5 }}
                          />
                        </AnimatePresence>
                        
                        {/* Image overlay during interaction */}
                        {(hoveredCard === service.id || touchedCard === service.id) && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end justify-between p-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <motion.div
                              className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full"
                              initial={{ scale: 0, x: -20 }}
                              animate={{ scale: 1, x: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              <Eye className="h-3 w-3 text-white" />
                              <span className="text-xs text-white font-medium">
                                {(imageIndexes[service.id] || 0) + 1} de {service.images.length}
                              </span>
                            </motion.div>
                            
                            <motion.div
                              className="flex space-x-1"
                              initial={{ scale: 0, x: 20 }}
                              animate={{ scale: 1, x: 0 }}
                              transition={{ delay: 0.3 }}
                            >
                              {service.images.map((_, imgIndex) => (
                                <div
                                  key={imgIndex}
                                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    imgIndex === (imageIndexes[service.id] || 0)
                                      ? 'bg-white scale-125'
                                      : 'bg-white/50'
                                  }`}
                                />
                              ))}
                            </motion.div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>

                    <div className="space-y-4">
                      {/* Service Info */}
                      <div>
                        <div className="flex items-center space-x-3 mb-3">
                          <motion.div
                            className="p-3 bg-white/10 backdrop-blur-sm rounded-xl relative overflow-hidden"
                            animate={{
                              rotate: (hoveredCard === service.id || touchedCard === service.id) ? [0, -10, 10, 0] : 0,
                              scale: (hoveredCard === service.id || touchedCard === service.id) ? 1.1 : 1
                            }}
                            transition={{ duration: 0.6 }}
                          >
                            <service.iconComponent className="h-8 w-8 text-gray-700 relative z-10" />
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                              animate={{ x: [-100, 100] }}
                              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />
                          </motion.div>
                          <div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
                              {service.name}
                            </h3>
                            <div className="flex items-center space-x-2 text-sm">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="font-bold">{service.rating}</span>
                              <div className="flex items-center space-x-1 text-blue-600">
                                <Clock className="h-3 w-3" />
                                <span className="font-medium">{service.responseTime}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm font-medium text-gray-600 mb-4">
                          {service.description}
                        </p>
                      </div>

                      {/* Trust Badges */}
                      <div className="flex flex-wrap gap-2">
                        {service.pricing.trustBadges.slice(0, 2).map((badge, badgeIndex) => (
                          <motion.span
                            key={badge}
                            className="bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 border border-white/30"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 2.2 + index * 0.1 + badgeIndex * 0.05 }}
                          >
                            ✅ {badge}
                          </motion.span>
                        ))}
                      </div>

                      {/* Pricing */}
                      <motion.div 
                        className="bg-white/40 backdrop-blur-sm p-4 rounded-xl border border-white/30"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2.5 + index * 0.1 }}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-semibold text-gray-700 text-sm">Evaluación:</span>
                          <span className="font-bold text-lg text-gray-800">
                            {service.pricing.diagnostic}
                          </span>
                        </div>
                        
                        <div className="bg-green-100/80 backdrop-blur-sm p-3 rounded-lg mb-3 border border-green-200/50">
                          <p className="text-xs text-green-800 font-medium">
                            GRATIS si contratas el servicio
                          </p>
                        </div>
                      </motion.div>
                      
                      {/* CTA Button */}
                      <motion.div
                        className="pt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.8 + index * 0.1 }}
                      >
                        <motion.div
                          className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 w-full py-3 rounded-xl text-center font-bold text-white relative overflow-hidden group shadow-lg"
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
                            animate={{ x: (hoveredCard === service.id || touchedCard === service.id) ? 3 : 0 }}
                          >
                            <service.iconComponent className="h-5 w-5" />
                            <span>¡SOLICITAR AHORA!</span>
                            <ArrowRight className="h-5 w-5" />
                          </motion.div>
                          
                          <motion.div
                            className="absolute inset-0 bg-white opacity-0"
                            animate={{
                              opacity: (touchedCard === service.id) ? [0, 0.2, 0] : 0
                            }}
                            transition={{ duration: 0.3 }}
                          />
                          
                          {/* Shimmer effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                            animate={{ x: [-100, 100] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          />
                        </motion.div>
                        
                        <p className="text-xs text-center text-gray-600 mt-2 font-medium">
                          Sin compromiso • Garantía incluida
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
              ))}
            </div>
            
              {/* Enhanced Trust Building Section */}
              <motion.div 
                className="glass-card p-8 mt-12"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5 }}
              >
                <motion.h3 
                  className="font-bold text-2xl lg:text-3xl text-gray-900 mb-8 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.7 }}
                >
                  Nuestra Garantía de <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Transparencia Total</span>
                </motion.h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-8">
                  {[
                    {
                      icon: 'P',
                      title: 'Precios Transparentes',
                      description: 'Solo pagas lo que acordamos. Sin costos sorpresa al final del trabajo.'
                    },
                    {
                      icon: 'C',
                      title: 'Cotización Detallada',
                      description: 'Te explicamos cada material y hora de trabajo antes de comenzar.'
                    },
                    {
                      icon: 'T',
                      title: 'Trabajo Garantizado',
                      description: 'Si algo falla por nuestro trabajo, lo reparamos sin costo adicional.'
                    }
                  ].map((item, index) => (
                    <motion.div
                      key={item.title}
                      className="glass-base p-6 rounded-xl group hover:scale-105 transition-transform"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 3 + index * 0.2 }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="text-4xl mb-4">{item.icon}</div>
                      <div className="font-bold text-lg text-gray-700 mb-2">{item.title}</div>
                      <div className="text-gray-600 text-sm leading-relaxed">{item.description}</div>
                    </motion.div>
                  ))}
              </div>
              
              {/* Additional trust elements */}
                <motion.div 
                  className="border-t border-gray-200 pt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3.5 }}
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
                    {[
                      { label: '✓ Materiales de Calidad', sub: 'Marcas reconocidas', color: 'text-green-700' },
                      { label: '✓ Técnicos Certificados', sub: 'Años de experiencia', color: 'text-blue-700' },
                      { label: '✓ Diagnóstico Honesto', sub: 'Te decimos lo que necesitas', color: 'text-purple-700' },
                      { label: '✓ Precios Justos', sub: 'Competitivos en El Seibo', color: 'text-orange-700' }
                    ].map((item, index) => (
                      <motion.div 
                        key={item.label}
                        className="flex flex-col items-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 3.8 + index * 0.1, type: "spring" }}
                      >
                        <span className={`font-bold ${item.color}`}>{item.label}</span>
                        <span className="text-gray-600 text-xs mt-1">{item.sub}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
              
              {/* Professional Work Gallery */}
              <motion.div 
                className="glass-card p-8 mt-12"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 4 }}
              >
                <motion.h3 
                  className="font-bold text-2xl lg:text-3xl text-gray-900 mb-8 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 4.2 }}
                >
                  Trabajos <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Profesionales Realizados</span>
                </motion.h3>
                
                {/* Image Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                  {portfolioImages.map((work, index) => (
                    <motion.div
                      key={work.src}
                      className="relative group cursor-pointer overflow-hidden rounded-xl"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 4.4 + index * 0.1, type: "spring" }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openLightbox(index)}
                    >
                      <div className="aspect-square relative overflow-hidden rounded-xl glass-base border-2 border-white/20">
                        <Image 
                          src={work.src}
                          alt={work.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Content */}
                        <motion.div 
                          className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                        >
                          <h4 className="font-bold text-sm">{work.title}</h4>
                          <p className="text-xs opacity-80">{work.category}</p>
                        </motion.div>
                        
                        {/* Quality indicator */}
                        <motion.div 
                          className="absolute top-2 right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          whileHover={{ scale: 1.1 }}
                        >
                          <CheckCircle className="h-4 w-4 text-white" />
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Stats Row */}
                <motion.div 
                  className="border-t border-gray-200 pt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 5 }}
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
                    {[
                      { label: '✓ +500 Proyectos', sub: 'Completados exitosamente', color: 'text-green-700' },
                      { label: '✓ 30+ Años', sub: 'De experiencia profesional', color: 'text-blue-700' },
                      { label: '✓ 100% Garantía', sub: 'En todos nuestros trabajos', color: 'text-purple-700' },
                      { label: '✓ Materiales Premium', sub: 'Calidad certificada', color: 'text-orange-700' }
                    ].map((item, index) => (
                      <motion.div 
                        key={item.label}
                        className="flex flex-col items-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 5.2 + index * 0.1, type: "spring" }}
                      >
                        <span className={`font-bold ${item.color}`}>{item.label}</span>
                        <span className="text-gray-600 text-xs mt-1">{item.sub}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="calendly-embed"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <motion.button
                  onClick={() => setSelectedService(null)}
                  className="flex items-center gap-2 glass-button px-4 py-3 rounded-xl font-medium"
                  whileHover={{ scale: 1.05, x: -5 }}
                  whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={20} />
              Cambiar servicio
                </motion.button>
                
                <motion.div
                  className="glass-success px-6 py-3 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  <span className="font-bold text-green-800">
                    ✅ Servicio seleccionado: {services.find(s => s.id === selectedService)?.name}
                  </span>
                </motion.div>
              </motion.div>
              
              <motion.div
                className="glass-card p-4 rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
            <CalendlyEmbed selectedService={selectedService} />
              </motion.div>
            </motion.div>
        )}
        </AnimatePresence>
      </main>

      {/* Image Lightbox */}
      <ImageLightbox
        isOpen={lightbox.isOpen}
        onClose={closeLightbox}
        imageSrc={lightbox.imageSrc}
        imageTitle={lightbox.imageTitle}
        imageCategory={lightbox.imageCategory}
        images={portfolioImages}
        currentIndex={lightbox.currentIndex}
        onNavigate={navigateLightbox}
      />

      {/* ElevenLabs Convai Widget - Disabled due to account limitations */}
      {/* <ElevenLabsWidget agentId="agent_01jzjp0q3sekq8jddpvd0q8xrq" /> */}

      {/* Footer */}
      <Footer />
    </div>
  )
} 