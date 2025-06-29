'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth'
import { NotificationDemo } from '@/components/notifications/NotificationDemo'

export default function NotificationsTestPage() {
  const { login, user, status, isLoading, error, logout } = useAuthStore()
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState<'customer' | 'technician'>('customer')

  // Pre-fill form for testing
  useEffect(() => {
    if (!phone) setPhone('9086205502')
    if (!name) setName('Usuario de Prueba')
    if (!password) setPassword('123456')
  }, [phone, name, password])

  const handleLogin = async () => {
    try {
      await login(phone, userType, name, password)
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          🧪 Prueba de Autenticación y Notificaciones
        </h1>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Authentication Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">🔐 Sistema de Autenticación</h3>
            
            {!user ? (
              <form onSubmit={(e) => {
                e.preventDefault()
                handleLogin()
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="809-555-0123"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Mínimo 6 caracteres"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Usuario
                  </label>
                  <select
                    value={userType}
                    onChange={(e) => setUserType(e.target.value as 'customer' | 'technician')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="customer">Cliente</option>
                    <option value="technician">Técnico</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  {isLoading ? 'Iniciando...' : '🔑 Probar Autenticación'}
                </button>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">Error: {error}</p>
                  </div>
                )}
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">✅ Autenticación exitosa!</h4>
                  
                  <div className="text-sm text-green-700 space-y-1">
                    <p><strong>ID:</strong> {user.id}</p>
                    <p><strong>Nombre:</strong> {user.name}</p>
                    <p><strong>Teléfono:</strong> {user.phone}</p>
                    <p><strong>Tipo:</strong> {user.user_type}</p>
                    <p><strong>Estado:</strong> {status}</p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  🚪 Cerrar Sesión
                </button>

                {/* Debug Info */}
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700">
                    🔍 Datos de Usuario (Debug)
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>

          {/* Notifications Section */}
          <NotificationDemo />
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">📋 Instrucciones de Prueba</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Primero, inicia sesión con cualquier teléfono y nombre</li>
            <li>Verifica que no aparezcan errores en la consola del navegador</li>
            <li>Observa que el estado de conexión de notificaciones esté &quot;Conectado&quot;</li>
            <li>Los datos de usuario deben aparecer correctamente</li>
            <li>Las notificaciones deben cargar sin errores de UUID</li>
          </ol>
        </div>
      </div>
    </div>
  )
} 