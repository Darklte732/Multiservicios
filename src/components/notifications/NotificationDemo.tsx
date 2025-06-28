'use client'

import React from 'react'
import { useNotifications } from '@/contexts/NotificationContext'
import { Bell, Zap, Calendar, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react'

export function NotificationDemo() {
  const { addNotification, showToast } = useNotifications()

  const triggerNotification = async (type: 'info' | 'success' | 'warning' | 'error' | 'service_update' | 'appointment_reminder') => {
    const notifications = {
      info: {
        title: 'Información',
        message: 'Esta es una notificación informativa de prueba',
        type: 'info' as const,
        action_url: '/dashboard',
        action_label: 'Ver Dashboard'
      },
      success: {
        title: 'Servicio Completado',
        message: 'Tu instalación eléctrica ha sido completada exitosamente',
        type: 'success' as const,
        action_url: '/customer-dashboard',
        action_label: 'Ver Detalles'
      },
      warning: {
        title: 'Cita Pendiente',
        message: 'Tu técnico llegará en 30 minutos. Por favor prepara el área de trabajo',
        type: 'warning' as const,
        action_url: '/booking',
        action_label: 'Ver Cita'
      },
      error: {
        title: 'Error de Conexión',
        message: 'No se pudo conectar con el servidor. Verificando conexión...',
        type: 'error' as const
      },
      service_update: {
        title: 'Actualización de Servicio',
        message: 'El técnico Juan Pérez está en camino a tu ubicación',
        type: 'service_update' as const,
        action_url: '/pre-service',
        action_label: 'Ver Estado'
      },
      appointment_reminder: {
        title: 'Recordatorio de Cita',
        message: 'Tu cita de mantenimiento eléctrico es mañana a las 2:00 PM',
        type: 'appointment_reminder' as const,
        action_url: '/confirmation',
        action_label: 'Ver Detalles'
      }
    }

    const notification = notifications[type]
    
    // Add to database (triggers real-time notification)
    await addNotification({
      user_id: 'demo-user',
      title: notification.title,
      message: notification.message,
      type: notification.type,
      is_read: false,
      action_url: notification.action_url,
      action_label: notification.action_label
    })
  }

  const triggerToast = (type: 'info' | 'success' | 'warning' | 'error' | 'service_update' | 'appointment_reminder') => {
    const toasts = {
      info: {
        title: 'Nueva Información',
        message: 'Toast de información con acción',
        type: 'info' as const,
        duration: 5000,
        actions: [{
          label: 'Ver Más',
          action: () => console.log('Ver más clicked'),
          style: 'primary' as const
        }]
      },
      success: {
        title: '¡Éxito!',
        message: 'Operación completada correctamente',
        type: 'success' as const,
        duration: 4000
      },
      warning: {
        title: 'Atención',
        message: 'Revisa la información antes de continuar',
        type: 'warning' as const,
        duration: 6000,
        actions: [
          {
            label: 'Revisar',
            action: () => console.log('Revisar clicked'),
            style: 'primary' as const
          },
          {
            label: 'Ignorar',
            action: () => console.log('Ignorar clicked'),
            style: 'secondary' as const
          }
        ]
      },
      error: {
        title: 'Error',
        message: 'Algo salió mal. Por favor intenta nuevamente',
        type: 'error' as const,
        duration: 8000,
        actions: [{
          label: 'Reintentar',
          action: () => console.log('Reintentar clicked'),
          style: 'danger' as const
        }]
      },
      service_update: {
        title: 'Actualización de Servicio',
        message: 'Tu técnico ha actualizado el estado del trabajo',
        type: 'service_update' as const,
        duration: 5000,
        actions: [{
          label: 'Ver Estado',
          action: () => console.log('Ver estado clicked'),
          style: 'primary' as const
        }]
      },
      appointment_reminder: {
        title: 'Recordatorio',
        message: 'Tu cita es en 1 hora',
        type: 'appointment_reminder' as const,
        duration: 7000,
        actions: [
          {
            label: 'Confirmar',
            action: () => console.log('Confirmar clicked'),
            style: 'primary' as const
          },
          {
            label: 'Reprogramar',
            action: () => console.log('Reprogramar clicked'),
            style: 'secondary' as const
          }
        ]
      }
    }

    showToast(toasts[type])
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Bell className="w-6 h-6 text-blue-600" />
          Demo de Notificaciones en Tiempo Real
        </h2>
        <p className="text-gray-600">
          Prueba el sistema de notificaciones con diferentes tipos y estilos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Database Notifications */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            Notificaciones de Base de Datos
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Estas notificaciones se guardan en la base de datos y aparecen en el panel de notificaciones
          </p>
          <div className="space-y-3">
            <button
              onClick={() => triggerNotification('info')}
              className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
            >
              <Info className="w-5 h-5 text-blue-600" />
              <span className="text-blue-800 font-medium">Información</span>
            </button>
            
            <button
              onClick={() => triggerNotification('success')}
              className="w-full flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors"
            >
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">Éxito</span>
            </button>
            
            <button
              onClick={() => triggerNotification('warning')}
              className="w-full flex items-center gap-3 p-3 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg transition-colors"
            >
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-800 font-medium">Advertencia</span>
            </button>
            
            <button
              onClick={() => triggerNotification('error')}
              className="w-full flex items-center gap-3 p-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
            >
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">Error</span>
            </button>
            
            <button
              onClick={() => triggerNotification('service_update')}
              className="w-full flex items-center gap-3 p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors"
            >
              <Zap className="w-5 h-5 text-purple-600" />
              <span className="text-purple-800 font-medium">Actualización de Servicio</span>
            </button>
            
            <button
              onClick={() => triggerNotification('appointment_reminder')}
              className="w-full flex items-center gap-3 p-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
            >
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span className="text-indigo-800 font-medium">Recordatorio de Cita</span>
            </button>
          </div>
        </div>

        {/* Toast Notifications */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            Notificaciones Toast
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Estas notificaciones aparecen temporalmente en la esquina superior derecha
          </p>
          <div className="space-y-3">
            <button
              onClick={() => triggerToast('info')}
              className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
            >
              <Info className="w-5 h-5 text-blue-600" />
              <span className="text-blue-800 font-medium">Toast Información</span>
            </button>
            
            <button
              onClick={() => triggerToast('success')}
              className="w-full flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors"
            >
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">Toast Éxito</span>
            </button>
            
            <button
              onClick={() => triggerToast('warning')}
              className="w-full flex items-center gap-3 p-3 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg transition-colors"
            >
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-800 font-medium">Toast Advertencia</span>
            </button>
            
            <button
              onClick={() => triggerToast('error')}
              className="w-full flex items-center gap-3 p-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
            >
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">Toast Error</span>
            </button>
            
            <button
              onClick={() => triggerToast('service_update')}
              className="w-full flex items-center gap-3 p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors"
            >
              <Zap className="w-5 h-5 text-purple-600" />
              <span className="text-purple-800 font-medium">Toast Servicio</span>
            </button>
            
            <button
              onClick={() => triggerToast('appointment_reminder')}
              className="w-full flex items-center gap-3 p-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
            >
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span className="text-indigo-800 font-medium">Toast Recordatorio</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Características del Sistema:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>Real-time:</strong> Notificaciones instantáneas vía Supabase WebSocket</li>
          <li>• <strong>Sonidos:</strong> Tonos diferentes para cada tipo de notificación</li>
          <li>• <strong>Push:</strong> Notificaciones del navegador (requiere permisos)</li>
          <li>• <strong>Persistencia:</strong> Las notificaciones se guardan en la base de datos</li>
          <li>• <strong>Acciones:</strong> Botones interactivos en toasts y notificaciones</li>
          <li>• <strong>Configuración:</strong> Control de sonidos y notificaciones push</li>
        </ul>
      </div>
    </div>
  )
}

export default NotificationDemo 