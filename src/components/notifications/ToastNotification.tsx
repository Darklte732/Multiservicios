'use client'

import React, { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Zap, Calendar } from 'lucide-react'
import { useNotifications } from '@/contexts/NotificationContext'
import type { ToastNotification, NotificationType } from '@/contexts/NotificationContext'
import { cn } from '@/utils/cn'

interface ToastItemProps {
  toast: ToastNotification
  onRemove: (id: string) => void
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 50)
  }, [])

  const handleRemove = () => {
    setIsLeaving(true)
    setTimeout(() => onRemove(toast.id), 300)
  }

  const getIcon = (type: NotificationType) => {
    const iconClass = "w-5 h-5"
    switch (type) {
      case 'success':
        return <CheckCircle className={cn(iconClass, "text-green-600")} />
      case 'error':
        return <AlertCircle className={cn(iconClass, "text-red-600")} />
      case 'warning':
        return <AlertTriangle className={cn(iconClass, "text-yellow-600")} />
      case 'service_update':
        return <Zap className={cn(iconClass, "text-blue-600")} />
      case 'appointment_reminder':
        return <Calendar className={cn(iconClass, "text-purple-600")} />
      default:
        return <Info className={cn(iconClass, "text-blue-600")} />
    }
  }

  const getToastStyle = (type: NotificationType) => {
    const baseClasses = "border-l-4 shadow-lg"
    switch (type) {
      case 'success':
        return cn(baseClasses, "bg-green-50 border-green-500 text-green-900")
      case 'error':
        return cn(baseClasses, "bg-red-50 border-red-500 text-red-900")
      case 'warning':
        return cn(baseClasses, "bg-yellow-50 border-yellow-500 text-yellow-900")
      case 'service_update':
        return cn(baseClasses, "bg-blue-50 border-blue-500 text-blue-900")
      case 'appointment_reminder':
        return cn(baseClasses, "bg-purple-50 border-purple-500 text-purple-900")
      default:
        return cn(baseClasses, "bg-blue-50 border-blue-500 text-blue-900")
    }
  }

  return (
    <div
      className={cn(
        "mb-4 p-4 rounded-lg max-w-sm w-full transition-all duration-300 transform",
        getToastStyle(toast.type),
        isVisible && !isLeaving ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
        "hover:shadow-xl"
      )}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon(toast.type)}
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-medium">
            {toast.title}
          </p>
          <p className="mt-1 text-sm opacity-90">
            {toast.message}
          </p>
          
          {toast.actions && toast.actions.length > 0 && (
            <div className="mt-3 flex space-x-2">
              {toast.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    action.action()
                    handleRemove()
                  }}
                  className={cn(
                    "text-xs font-medium px-3 py-1 rounded-md transition-colors",
                    action.style === 'primary' && "bg-blue-600 text-white hover:bg-blue-700",
                    action.style === 'secondary' && "bg-gray-200 text-gray-800 hover:bg-gray-300",
                    action.style === 'danger' && "bg-red-600 text-white hover:bg-red-700",
                    !action.style && "bg-blue-600 text-white hover:bg-blue-700"
                  )}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={handleRemove}
            className="rounded-md inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function ToastContainer() {
  const { state, removeToast } = useNotifications()

  if (state.toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none">
      <div className="pointer-events-auto">
        {state.toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={removeToast}
          />
        ))}
      </div>
    </div>
  )
}

export default ToastContainer 