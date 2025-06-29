'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Eye, EyeOff, X, Zap, User, Phone, UserCheck, Mail, RefreshCw } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import type { UserType } from '@/types'
import { cn } from '@/utils/cn'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: 'login' | 'register'
  defaultUserType?: UserType
}

export function AuthModal({ isOpen, onClose, defaultTab = 'login', defaultUserType = 'customer' }: AuthModalProps) {
  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL LOGIC
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab)
  const [userType, setUserType] = useState<UserType>(defaultUserType)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    identifier: '',
    name: '',
    password: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Refs to track previous props to prevent unnecessary re-renders
  const prevPropsRef = useRef({ isOpen, defaultTab, defaultUserType })
  
  const { login, logout, isLoading, error, status, resetTestUser } = useAuthStore()

  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  // Check if current error is a password mismatch error
  const isPasswordError = error?.includes('Contraseña incorrecta') || error?.includes('Invalid password')

  // Only update state when props actually change
  useEffect(() => {
    const prevProps = prevPropsRef.current
    if (
      prevProps.isOpen !== isOpen ||
      prevProps.defaultTab !== defaultTab ||
      prevProps.defaultUserType !== defaultUserType
    ) {
      if (isOpen) {
        setActiveTab(defaultTab)
        setUserType(defaultUserType)
        setFormData({ identifier: '', name: '', password: '' })
        setShowPassword(false)
        setIsSubmitting(false)
      }
      prevPropsRef.current = { isOpen, defaultTab, defaultUserType }
    }
  }, [isOpen, defaultTab, defaultUserType])

  // Close modal when authentication is successful
  useEffect(() => {
    if (status === 'authenticated' && isOpen) {
      onClose()
    }
  }, [status, isOpen, onClose])

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleTabChange = useCallback((tab: 'login' | 'register') => {
    setActiveTab(tab)
    setFormData({ identifier: '', name: '', password: '' })
    setShowPassword(false)
    setIsSubmitting(false)
  }, [])

  const handleUserTypeChange = useCallback((type: UserType) => {
    setUserType(type)
  }, [])

  const handleResetTestUser = useCallback(async () => {
    if (!isDevelopment || !formData.identifier || !formData.password) {
      return
    }
    
    setIsSubmitting(true)
    try {
      await resetTestUser(formData.identifier, userType, formData.name || 'Test User', formData.password)
    } catch (error) {
      console.error('Reset test user failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [isDevelopment, formData, userType, resetTestUser])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSubmitting || isLoading) {
      return // Prevent multiple submissions
    }

    if (!formData.identifier || !formData.password) {
      return
    }

    if (activeTab === 'register' && !formData.name) {
      return
    }

    setIsSubmitting(true)
    
    try {
      await login(
        formData.identifier,
        userType,
        formData.name || 'Usuario',
        formData.password
      )
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [isSubmitting, isLoading, formData, activeTab, userType, login])

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev)
  }, [])

  // Handle modal visibility through CSS classes instead of early return
  // This ensures all hooks are called in the same order every render
  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center glass-modal-overlay transition-all duration-500",
      isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
    )}>
      <div className={cn(
        "relative w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto glass-modal transition-all duration-500 transform",
        isOpen ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-8 opacity-0"
      )}>
        {/* Glass Background Pattern */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-purple-400/5 to-pink-400/10"></div>
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]"></div>
        </div>

        {/* Close Button - Top Right */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 w-9 h-9 flex items-center justify-center glass-button text-gray-600 hover:text-gray-800 rounded-full transition-all duration-300 z-50"
          style={{ position: 'absolute', top: '12px', right: '12px' }}
        >
          <X size={16} />
        </button>

        {/* Header - More Compact */}
        <div className="relative p-6 text-center border-b border-white/20">
          <div className="flex items-center justify-center mb-3">
            <div className="p-3 glass-blue rounded-full">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold glass-text mb-2">
            MultiServicios El Seibo
          </h2>
          <p className="text-sm text-gray-600/80">
            {activeTab === 'login' ? 'Inicia sesión en tu cuenta' : 'Crea tu cuenta nueva'}
          </p>
        </div>

        {/* Tab Navigation - More Compact */}
        <div className="relative flex glass-base mx-4 mt-4 rounded-2xl overflow-hidden">
          <button
            onClick={() => handleTabChange('login')}
            className={cn(
              "flex-1 py-3 px-4 text-sm font-semibold transition-all duration-300 relative",
              activeTab === 'login'
                ? "glass-blue text-blue-700"
                : "text-gray-600/80 hover:text-gray-800 hover:bg-white/10"
            )}
          >
            <span className="relative z-10">Iniciar Sesión</span>
          </button>
          <button
            onClick={() => handleTabChange('register')}
            className={cn(
              "flex-1 py-3 px-4 text-sm font-semibold transition-all duration-300 relative",
              activeTab === 'register'
                ? "glass-blue text-blue-700"
                : "text-gray-600/80 hover:text-gray-800 hover:bg-white/10"
            )}
          >
            <span className="relative z-10">Registrarse</span>
          </button>
        </div>

        {/* Form - Reduced Padding */}
        <div className="relative p-6">
          {/* User Type Selection - More Compact */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700/90 mb-3">
              Tipo de Usuario
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleUserTypeChange('customer')}
                className={cn(
                  "glass-ripple flex items-center justify-center py-3 px-4 rounded-xl border-2 transition-all duration-300",
                  userType === 'customer'
                    ? "glass-blue border-blue-400/30 text-blue-700"
                    : "glass-base border-white/20 text-gray-600 hover:border-white/30 hover:text-gray-800"
                )}
              >
                <User className="w-4 h-4 mr-2" />
                <span className="font-medium text-sm">Cliente</span>
              </button>
              <button
                type="button"
                onClick={() => handleUserTypeChange('technician')}
                className={cn(
                  "glass-ripple flex items-center justify-center py-3 px-4 rounded-xl border-2 transition-all duration-300",
                  userType === 'technician'
                    ? "glass-blue border-blue-400/30 text-blue-700"
                    : "glass-base border-white/20 text-gray-600 hover:border-white/30 hover:text-gray-800"
                )}
              >
                <UserCheck className="w-4 h-4 mr-2" />
                <span className="font-medium text-sm">Técnico</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field (only for registration) - More Compact */}
            {activeTab === 'register' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700/90 mb-2">
                  Nombre Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="glass-input w-full pl-10 pr-4 py-3 text-gray-800 placeholder-gray-500 text-sm"
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email/Phone Field - More Compact */}
            <div>
              <label className="block text-sm font-semibold text-gray-700/90 mb-2">
                Email o Teléfono
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.identifier}
                  onChange={(e) => handleInputChange('identifier', e.target.value)}
                  className="glass-input w-full pl-10 pr-4 py-3 text-gray-800 placeholder-gray-500 text-sm"
                  placeholder="ejemplo@correo.com o 809-123-4567"
                  required
                />
              </div>
            </div>

            {/* Password Field - More Compact */}
            <div>
              <label className="block text-sm font-semibold text-gray-700/90 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="glass-input w-full pl-4 pr-12 py-3 text-gray-800 placeholder-gray-500 text-sm"
                  placeholder="Tu contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error Display - More Compact */}
            {error && (
              <div className="glass-red p-3 rounded-xl border border-red-300/30">
                <p className="text-xs text-red-700/90 font-medium">{error}</p>
                {isDevelopment && isPasswordError && (
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={handleResetTestUser}
                      disabled={isSubmitting || !formData.identifier || !formData.password}
                      className="flex items-center text-xs text-blue-600 hover:text-blue-800 disabled:text-gray-400 font-medium"
                    >
                      <RefreshCw size={10} className="mr-1" />
                      Resetear usuario de prueba
                    </button>
                    <p className="text-xs text-gray-500 mt-1">
                      Esto actualizará la contraseña del usuario existente
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button - More Compact */}
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="glass-button w-full py-3 px-6 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isSubmitting || isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  <span className="text-sm">Procesando...</span>
                </div>
              ) : (
                <span className="text-sm">
                  {activeTab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Bottom Glass Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
      </div>
    </div>
  )
} 