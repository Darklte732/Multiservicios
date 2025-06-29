'use client'

import React, { useState } from 'react'
import { useNotifications } from '@/contexts/NotificationContext'
import { useAuthStore } from '@/store/auth'
import { Bell, Send, TestTube } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export function NotificationDemo() {
  const { notifications, unreadCount, connectionStatus, addToast } = useNotifications()
  const { user } = useAuthStore()
  const [isCreating, setIsCreating] = useState(false)
  const [testNotification, setTestNotification] = useState({
    title: 'Nueva notificación de prueba',
    message: 'Esta es una notificación generada para probar el sistema.',
    type: 'system' as const
  })

  const handleCreateTestNotification = async () => {
    if (!user?.id) {
      addToast('Debes iniciar sesión para crear notificaciones', 'error')
      return
    }

    setIsCreating(true)
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title: testNotification.title,
          message: testNotification.message,
          type: testNotification.type,
          read: false
        })

      if (error) {
        throw error
      }

      addToast('Notificación de prueba creada exitosamente', 'success')
      
      // Reset form
      setTestNotification({
        title: 'Nueva notificación de prueba',
        message: 'Esta es una notificación generada para probar el sistema.',
        type: 'system'
      })
    } catch (error) {
      console.error('Error creating test notification:', error)
      addToast('Error al crear la notificación de prueba', 'error')
    } finally {
      setIsCreating(false)
    }
  }

  const handleToastTest = (type: 'success' | 'error' | 'loading' | 'custom') => {
    switch (type) {
      case 'success':
        addToast('¡Operación exitosa!', 'success')
        break
      case 'error':
        addToast('Error en la operación', 'error')
        break
      case 'loading':
        addToast('Procesando...', 'loading')
        break
      case 'custom':
        addToast('Notificación personalizada', 'custom')
        break
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Sistema de Notificaciones
        </h1>
        <p className="text-gray-600">
          Demostración del sistema de notificaciones en tiempo real
        </p>
      </div>

      {/* Connection Status */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Estado de Conexión
        </h2>
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-500' : 
            connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
          }`} />
          <span className="font-medium">
            {connectionStatus === 'connected' ? 'Conectado' : 
             connectionStatus === 'connecting' ? 'Conectando...' : 'Desconectado'}
          </span>
          <span className="text-gray-500">
            ({notifications.length} notificaciones, {unreadCount} sin leer)
          </span>
        </div>
      </div>

      {/* Toast Test Buttons */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">
          Prueba de Toasts
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => handleToastTest('success')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Toast Éxito
          </button>
          <button
            onClick={() => handleToastTest('error')}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Toast Error
          </button>
          <button
            onClick={() => handleToastTest('loading')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Toast Cargando
          </button>
          <button
            onClick={() => handleToastTest('custom')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Toast Personalizado
          </button>
        </div>
      </div>

      {/* Create Test Notification */}
      {user && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <TestTube className="w-5 h-5 mr-2" />
            Crear Notificación de Prueba
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                value={testNotification.title}
                onChange={(e) => setTestNotification({...testNotification, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mensaje
              </label>
              <textarea
                value={testNotification.message}
                onChange={(e) => setTestNotification({...testNotification, message: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                value={testNotification.type}
                onChange={(e) => setTestNotification({...testNotification, type: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="system">Sistema</option>
                <option value="appointment">Cita</option>
                <option value="emergency">Emergencia</option>
                <option value="marketing">Marketing</option>
              </select>
            </div>
            <button
              onClick={handleCreateTestNotification}
              disabled={isCreating}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>{isCreating ? 'Creando...' : 'Crear Notificación'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Current Notifications */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">
          Notificaciones Actuales ({notifications.length})
        </h2>
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No hay notificaciones para mostrar
          </p>
        ) : (
          <div className="space-y-3">
            {notifications.slice(0, 5).map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${
                  notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{notification.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(notification.created_at).toLocaleString('es-DO')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      notification.type === 'system' ? 'bg-blue-100 text-blue-800' :
                      notification.type === 'appointment' ? 'bg-green-100 text-green-800' :
                      notification.type === 'emergency' ? 'bg-red-100 text-red-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {notification.type}
                    </span>
                    {notification.read ? (
                      <span className="text-xs text-gray-500">Leída</span>
                    ) : (
                      <span className="text-xs text-blue-600 font-medium">Nueva</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {notifications.length > 5 && (
              <p className="text-sm text-gray-500 text-center">
                ... y {notifications.length - 5} más
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 