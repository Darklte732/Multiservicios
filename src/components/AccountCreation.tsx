'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff, Check, X, Clock, Gift, Zap, Shield, Star, Users } from 'lucide-react'
import { validateServiceCodeFormat } from '@/lib/serviceCode'
import { cn } from '@/utils/cn'

interface AccountCreationProps {
  sessionData?: {
    serviceType: string
    customerName: string
    customerPhone: string
    serviceDate: string
    serviceCode: string
    finalPrice: number
  }
  onAccountCreated?: (userData: any) => void
  onSkip?: () => void
}

type LinkingMethod = 'automatic' | 'code' | 'none'

export function AccountCreation({ sessionData, onAccountCreated, onSkip }: AccountCreationProps) {
  const [step, setStep] = useState<'incentive' | 'form' | 'linking' | 'success'>('incentive')
  const [linkingMethod, setLinkingMethod] = useState<LinkingMethod>('automatic')
  const [formData, setFormData] = useState({
    name: sessionData?.customerName || '',
    phone: sessionData?.customerPhone || '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    preferredContact: 'whatsapp' as 'phone' | 'email' | 'whatsapp'
  })
  const [linkingCode, setLinkingCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Check if automatic linking is possible
  useEffect(() => {
    if (sessionData?.serviceCode) {
      setLinkingMethod('automatic')
    } else {
      setLinkingMethod('code')
    }
  }, [sessionData])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido'
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Formato de teléfono inválido'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Formato de email inválido'
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida'
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Debes aceptar los términos y condiciones'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateLinkingCode = () => {
    if (linkingMethod === 'code') {
      if (!linkingCode.trim()) {
        setErrors({ linkingCode: 'El código es requerido' })
        return false
      }
      if (!validateServiceCodeFormat(linkingCode)) {
        setErrors({ linkingCode: 'Formato de código inválido (MS-YYYY-XXXXX)' })
        return false
      }
    }
    setErrors({})
    return true
  }

  const handleCreateAccount = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    
    try {
      // Simulate account creation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const userData = {
        id: 'user-' + Date.now(),
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        preferredContact: formData.preferredContact,
        createdAt: new Date().toISOString()
      }

      // Proceed to linking step
      setStep('linking')
      
      // Simulate linking process
      setTimeout(async () => {
        if (linkingMethod === 'automatic' && sessionData?.serviceCode) {
          // Automatic linking with session data
          console.log('Linking automatically with service code:', sessionData.serviceCode)
        } else if (linkingMethod === 'code' && linkingCode) {
          // Manual code linking
          console.log('Linking with manual code:', linkingCode)
        }
        
        // Complete the process
        await new Promise(resolve => setTimeout(resolve, 1500))
        setStep('success')
        
        setTimeout(() => {
          onAccountCreated?.(userData)
        }, 2000)
      }, 1000)
      
    } catch (error) {
      console.error('Error creating account:', error)
      setErrors({ general: 'Error al crear la cuenta. Intenta nuevamente.' })
    } finally {
      setIsLoading(false)
    }
  }

  const incentives = [
    {
      icon: <Gift className="w-6 h-6 text-green-600" />,
      title: "10% de Descuento",
      description: "En tu próximo servicio eléctrico"
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-600" />,
      title: "Garantías Rastreables",
      description: "Seguimiento automático de todas tus garantías"
    },
    {
      icon: <Clock className="w-6 h-6 text-purple-600" />,
      title: "Reservas Rápidas",
      description: "Información guardada para reservas más rápidas"
    },
    {
      icon: <Star className="w-6 h-6 text-yellow-600" />,
      title: "Historial Completo",
      description: "Acceso a todo tu historial de servicios"
    },
    {
      icon: <Users className="w-6 h-6 text-indigo-600" />,
      title: "Técnicos Preferidos",
      description: "Solicita tus técnicos favoritos"
    },
    {
      icon: <Zap className="w-6 h-6 text-orange-600" />,
      title: "Prioridad en Emergencias",
      description: "Atención prioritaria para servicios de emergencia"
    }
  ]

  if (step === 'incentive') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold mb-2">¡Únete a MultiServicios!</h1>
            <p className="text-blue-100 text-lg">
              Disfruta de beneficios exclusivos creando tu cuenta
            </p>
          </div>
          
          <div className="p-8">
            {sessionData && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800">Servicio Completado</span>
                </div>
                <p className="text-green-700 text-sm">
                  Tu servicio de <strong>{sessionData.serviceType}</strong> fue completado exitosamente.
                  Crea tu cuenta para acceder a beneficios exclusivos.
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {incentives.map((incentive, index) => (
                <div key={index} className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex justify-center mb-3">
                    {incentive.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{incentive.title}</h3>
                  <p className="text-gray-600 text-sm">{incentive.description}</p>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setStep('form')}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Crear Mi Cuenta Gratis
              </button>
              {onSkip && (
                <button
                  onClick={onSkip}
                  className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Continuar Sin Cuenta
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'form') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Crear Cuenta</h1>
            <p className="text-gray-600">
              Completa la información para acceder a tus beneficios
            </p>
          </div>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
              <p className="text-red-700 text-sm">{errors.general}</p>
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); handleCreateAccount(); }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={cn(
                    "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                    errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
                  )}
                  placeholder="Tu nombre completo"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className={cn(
                    "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                    errors.phone ? "border-red-300 bg-red-50" : "border-gray-300"
                  )}
                  placeholder="+1 (809) 555-0123"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={cn(
                  "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                  errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
                )}
                placeholder="tu@email.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className={cn(
                      "w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                      errors.password ? "border-red-300 bg-red-50" : "border-gray-300"
                    )}
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Contraseña *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className={cn(
                      "w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                      errors.confirmPassword ? "border-red-300 bg-red-50" : "border-gray-300"
                    )}
                    placeholder="Confirma tu contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Método de Contacto Preferido
              </label>
              <select
                value={formData.preferredContact}
                onChange={(e) => setFormData(prev => ({ ...prev, preferredContact: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="phone">Teléfono</option>
                <option value="email">Email</option>
              </select>
            </div>

            {linkingMethod === 'code' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código de Servicio (Opcional)
                </label>
                <input
                  type="text"
                  value={linkingCode}
                  onChange={(e) => setLinkingCode(e.target.value.toUpperCase())}
                  className={cn(
                    "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                    errors.linkingCode ? "border-red-300 bg-red-50" : "border-gray-300"
                  )}
                  placeholder="MS-2025-XXXXX"
                />
                {errors.linkingCode && <p className="text-red-500 text-sm mt-1">{errors.linkingCode}</p>}
                <p className="text-gray-500 text-sm mt-1">
                  Ingresa el código de tu servicio reciente para vincularlo a tu cuenta
                </p>
              </div>
            )}

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData(prev => ({ ...prev, acceptTerms: e.target.checked }))}
                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="text-sm text-gray-600">
                Acepto los{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 underline">
                  términos y condiciones
                </a>{' '}
                y la{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 underline">
                  política de privacidad
                </a>
              </label>
            </div>
            {errors.acceptTerms && <p className="text-red-500 text-sm">{errors.acceptTerms}</p>}

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-semibold"
              >
                {isLoading ? 'Creando Cuenta...' : 'Crear Cuenta'}
              </button>
              <button
                type="button"
                onClick={() => setStep('incentive')}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Atrás
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  if (step === 'linking') {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Zap className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Vinculando Servicios
          </h2>
          <p className="text-gray-600 mb-6">
            {linkingMethod === 'automatic'
              ? 'Vinculando automáticamente tu servicio reciente...'
              : 'Verificando y vinculando tu código de servicio...'
            }
          </p>
          <div className="flex justify-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ¡Cuenta Creada Exitosamente!
          </h2>
          <p className="text-gray-600 mb-6">
            Tu cuenta ha sido creada y tus servicios han sido vinculados. 
            Ahora puedes acceder a todos los beneficios de MultiServicios.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">¿Qué sigue?</h3>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Accede a tu panel de cliente</li>
              <li>• Revisa tu historial de servicios</li>
              <li>• Programa tu próximo servicio con descuento</li>
              <li>• Configura tus preferencias</li>
            </ul>
          </div>
          
          <p className="text-gray-500 text-sm">
            Serás redirigido a tu panel en unos segundos...
          </p>
        </div>
      </div>
    )
  }

  return null
} 