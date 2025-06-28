'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Bell, BellRing, Settings, Volume2, VolumeX, Smartphone, SmartphoneNfc, Check, Trash2, Eye, EyeOff } from 'lucide-react'
import { useNotifications } from '@/contexts/NotificationContext'
import { cn } from '@/utils/cn'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface NotificationBellProps {
  className?: string
}

export function NotificationBell({ className }: NotificationBellProps) {
  const { state, markAsRead, markAllAsRead, toggleSound, togglePush } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setShowSettings(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      case 'service_update':
        return '⚡'
      case 'appointment_reminder':
        return '📅'
      default:
        return 'ℹ️'
    }
  }

  const handleMarkAsRead = async (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    await markAsRead(notificationId)
  }

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
  }

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true, 
        locale: es 
      })
    } catch {
      return 'Hace un momento'
    }
  }

  const hasUnread = state.unreadCount > 0

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative p-2 rounded-full transition-colors duration-200",
          hasUnread 
            ? "text-blue-600 hover:text-blue-700 hover:bg-blue-50" 
            : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
        )}
        aria-label={`Notificaciones${hasUnread ? ` (${state.unreadCount} nuevas)` : ''}`}
      >
        {hasUnread ? (
          <BellRing className="w-6 h-6" />
        ) : (
          <Bell className="w-6 h-6" />
        )}
        
        {/* Notification Badge */}
        {hasUnread && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {state.unreadCount > 99 ? '99+' : state.unreadCount}
          </span>
        )}

        {/* Connection Status Indicator */}
        <div className={cn(
          "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white",
          state.isConnected ? "bg-green-500" : "bg-red-500"
        )} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Notificaciones
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-1 text-gray-500 hover:text-gray-700 rounded"
                  title="Configuración"
                >
                  <Settings className="w-4 h-4" />
                </button>
                {hasUnread && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Marcar todas como leídas
                  </button>
                )}
              </div>
            </div>
            
            {/* Connection Status */}
            <div className="mt-2 flex items-center text-sm">
              <div className={cn(
                "w-2 h-2 rounded-full mr-2",
                state.isConnected ? "bg-green-500" : "bg-red-500"
              )} />
              <span className={cn(
                state.isConnected ? "text-green-600" : "text-red-600"
              )}>
                {state.isConnected ? "Conectado en tiempo real" : "Reconectando..."}
              </span>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Configuración</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {state.soundEnabled ? (
                      <Volume2 className="w-4 h-4 text-gray-500 mr-2" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-gray-500 mr-2" />
                    )}
                    <span className="text-sm text-gray-700">Sonidos</span>
                  </div>
                  <button
                    onClick={toggleSound}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      state.soundEnabled ? "bg-blue-600" : "bg-gray-200"
                    )}
                  >
                    <span className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                      state.soundEnabled ? "translate-x-6" : "translate-x-1"
                    )} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {state.pushEnabled ? (
                      <SmartphoneNfc className="w-4 h-4 text-gray-500 mr-2" />
                    ) : (
                      <Smartphone className="w-4 h-4 text-gray-500 mr-2" />
                    )}
                    <span className="text-sm text-gray-700">Notificaciones push</span>
                  </div>
                  <button
                    onClick={togglePush}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      state.pushEnabled ? "bg-blue-600" : "bg-gray-200"
                    )}
                  >
                    <span className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                      state.pushEnabled ? "translate-x-6" : "translate-x-1"
                    )} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-64 overflow-y-auto">
            {state.notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm">No tienes notificaciones</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {state.notifications.slice(0, 10).map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 hover:bg-gray-50 transition-colors cursor-pointer",
                      !notification.is_read && "bg-blue-50"
                    )}
                    onClick={() => {
                      if (!notification.is_read) {
                        markAsRead(notification.id)
                      }
                      if (notification.action_url) {
                        window.location.href = notification.action_url
                      }
                    }}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 text-lg mr-3">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm font-medium text-gray-900",
                          !notification.is_read && "font-semibold"
                        )}>
                          {notification.title}
                        </p>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {formatTime(notification.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        {!notification.is_read && (
                          <button
                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                            className="p-1 text-blue-600 hover:text-blue-700 rounded"
                            title="Marcar como leída"
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                        )}
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.notifications.length > 10 && (
            <div className="p-4 border-t border-gray-200 text-center">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Ver todas las notificaciones
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationBell 