'use client'

import React from 'react'
import { NotificationDemo } from '@/components/notifications/NotificationDemo'
import { NotificationBell } from '@/components/notifications/NotificationBell'

export default function NotificationsTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Sistema de Notificaciones en Tiempo Real
              </h1>
              <p className="mt-2 text-gray-600">
                Prueba todas las funcionalidades del sistema de notificaciones
              </p>
            </div>
            
            {/* Notification Bell Demo */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Bell de Notificaciones:</span>
              <NotificationBell className="relative" />
            </div>
          </div>
        </div>

        {/* Demo Component */}
        <NotificationDemo />

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Instrucciones de Prueba
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Notificaciones de Base de Datos</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Se almacenan permanentemente en Supabase</li>
                <li>• Aparecen en el panel de notificaciones (campana)</li>
                <li>• Se sincronizan en tiempo real entre dispositivos</li>
                <li>• Incluyen estados de leído/no leído</li>
                <li>• Pueden incluir acciones (botones)</li>
                <li>• Se pueden marcar como leídas individualmente</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Notificaciones Toast</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Aparecen temporalmente en la esquina superior derecha</li>
                <li>• Se auto-ocultan después del tiempo configurado</li>
                <li>• Pueden incluir botones de acción</li>
                <li>• Diferentes estilos según el tipo</li>
                <li>• Se pueden cerrar manualmente</li>
                <li>• Incluyen animaciones suaves</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Configuración del Sistema:</h4>
            <div className="text-sm text-blue-800 grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-1">
                <li>• <strong>Sonidos:</strong> Diferentes tonos por tipo de notificación</li>
                <li>• <strong>Push:</strong> Notificaciones del navegador (permiso requerido)</li>
                <li>• <strong>Real-time:</strong> WebSocket de Supabase para sincronización</li>
              </ul>
              <ul className="space-y-1">
                <li>• <strong>Persistencia:</strong> Guardado automático en base de datos</li>
                <li>• <strong>Limpieza:</strong> Auto-eliminación después de 30 días</li>
                <li>• <strong>Seguridad:</strong> RLS activado para privacidad</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Detalles Técnicos
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Context API</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• NotificationContext</li>
                <li>• Estado global de notificaciones</li>
                <li>• Gestión de conexiones WebSocket</li>
                <li>• Control de configuración de usuario</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Componentes</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• NotificationBell - Panel principal</li>
                <li>• ToastNotification - Mensajes flotantes</li>
                <li>• NotificationDemo - Herramienta de prueba</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Base de Datos</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Tabla notifications con RLS</li>
                <li>• Índices optimizados</li>
                <li>• Triggers para updated_at</li>
                <li>• Función de limpieza automática</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Volver al Inicio
          </a>
        </div>
      </div>
    </div>
  )
} 