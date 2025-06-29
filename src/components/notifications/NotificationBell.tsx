'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Bell, BellRing, Check, Eye } from 'lucide-react'
import { useNotifications } from '@/contexts/NotificationContext'
import { cn } from '@/utils/cn'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface NotificationBellProps {
  className?: string
}

export function NotificationBell({ className }: NotificationBellProps) {
  const { notifications, unreadCount, connectionStatus, markAsRead, markAllAsRead } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'system':
        return 'ℹ️'
      case 'appointment':
        return '📅'
      case 'emergency':
        return '🚨'
      case 'marketing':
        return '📢'
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

  const hasUnread = unreadCount > 0

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
        aria-label={`Notificaciones${hasUnread ? ` (${unreadCount} nuevas)` : ''}`}
      >
        {hasUnread ? (
          <BellRing className="w-6 h-6" />
        ) : (
          <Bell className="w-6 h-6" />
        )}
        
        {/* Notification Badge */}
        {hasUnread && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}

        {/* Connection Status Indicator */}
        <div className={cn(
          "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white",
          connectionStatus === 'connected' ? "bg-green-500" : "bg-red-500"
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
                connectionStatus === 'connected' ? "bg-green-500" : "bg-red-500"
              )} />
              <span className={cn(
                connectionStatus === 'connected' ? "text-green-600" : "text-red-600"
              )}>
                {connectionStatus === 'connected' ? "Conectado en tiempo real" : 
                 connectionStatus === 'connecting' ? "Conectando..." : "Reconectando..."}
              </span>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No tienes notificaciones</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 hover:bg-gray-50 transition-colors cursor-pointer",
                      !notification.read && "bg-blue-50 border-l-4 border-l-blue-500"
                    )}
                    onClick={() => !notification.read && handleMarkAsRead(notification.id, {} as React.MouseEvent)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center mb-1">
                          <span className="text-lg mr-2" role="img" aria-label="notification type">
                            {getNotificationIcon(notification.type)}
                          </span>
                          <h4 className={cn(
                            "text-sm font-medium truncate",
                            notification.read ? "text-gray-900" : "text-blue-900"
                          )}>
                            {notification.title}
                          </h4>
                        </div>
                        <p className={cn(
                          "text-sm mb-2 line-clamp-2",
                          notification.read ? "text-gray-600" : "text-blue-700"
                        )}>
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatTime(notification.created_at)}
                          </span>
                          {notification.read && notification.read_at && (
                            <span className="text-xs text-gray-400 flex items-center">
                              <Eye className="w-3 h-3 mr-1" />
                              Leído {formatTime(notification.read_at)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Mark as read button */}
                      {!notification.read && (
                        <button
                          onClick={(e) => handleMarkAsRead(notification.id, e)}
                          className="ml-2 p-1 text-blue-600 hover:text-blue-800 rounded"
                          title="Marcar como leída"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <div className="text-center">
                <span className="text-xs text-gray-500">
                  {notifications.length} notificación{notifications.length !== 1 ? 'es' : ''} 
                  {unreadCount > 0 && ` · ${unreadCount} nueva${unreadCount !== 1 ? 's' : ''}`}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationBell 