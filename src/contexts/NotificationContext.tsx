'use client'

import React, { createContext, useContext, useReducer, useEffect, useRef, useCallback } from 'react'
import { db } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'
import type { DashboardNotification, NotificationType } from '@/types'

// Export types for component usage
export type { NotificationType, DashboardNotification } from '@/types'

export interface ToastNotification {
  id: string
  title: string
  message: string
  type: NotificationType
  duration: number
  timestamp: number
  actions?: ToastAction[]
}

export interface ToastAction {
  label: string
  action: () => void
  style?: 'primary' | 'secondary' | 'danger'
}

interface NotificationState {
  notifications: DashboardNotification[]
  unreadCount: number
  isConnected: boolean
  toasts: ToastNotification[]
  soundEnabled: boolean
  pushEnabled: boolean
}



type NotificationAction =
  | { type: 'SET_NOTIFICATIONS'; payload: DashboardNotification[] }
  | { type: 'ADD_NOTIFICATION'; payload: DashboardNotification }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'SET_CONNECTION_STATUS'; payload: boolean }
  | { type: 'ADD_TOAST'; payload: ToastNotification }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'TOGGLE_SOUND'; payload: boolean }
  | { type: 'TOGGLE_PUSH'; payload: boolean }

interface NotificationContextType {
  state: NotificationState
  addNotification: (notification: Omit<DashboardNotification, 'id' | 'created_at'>) => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  showToast: (toast: Omit<ToastNotification, 'id' | 'timestamp'>) => void
  removeToast: (id: string) => void
  toggleSound: () => void
  togglePush: () => void
  refreshNotifications: () => Promise<void>
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isConnected: false,
  toasts: [],
  soundEnabled: typeof window !== 'undefined' ? localStorage.getItem('notifications-sound') !== 'false' : true,
  pushEnabled: typeof window !== 'undefined' ? localStorage.getItem('notifications-push') === 'true' : false
}

function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter(n => !n.is_read).length
      }
    
    case 'ADD_NOTIFICATION':
      const newNotifications = [action.payload, ...state.notifications]
      return {
        ...state,
        notifications: newNotifications,
        unreadCount: newNotifications.filter(n => !n.is_read).length
      }
    
    case 'MARK_AS_READ':
      const updatedNotifications = state.notifications.map(n =>
        n.id === action.payload ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
      )
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.filter(n => !n.is_read).length
      }
    
    case 'MARK_ALL_AS_READ':
      const allReadNotifications = state.notifications.map(n => ({ 
        ...n, 
        is_read: true, 
        read_at: new Date().toISOString() 
      }))
      return {
        ...state,
        notifications: allReadNotifications,
        unreadCount: 0
      }
    
    case 'SET_CONNECTION_STATUS':
      return {
        ...state,
        isConnected: action.payload
      }
    
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, action.payload]
      }
    
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.payload)
      }
    
    case 'TOGGLE_SOUND':
      if (typeof window !== 'undefined') {
        localStorage.setItem('notifications-sound', action.payload.toString())
      }
      return {
        ...state,
        soundEnabled: action.payload
      }
    
    case 'TOGGLE_PUSH':
      if (typeof window !== 'undefined') {
        localStorage.setItem('notifications-push', action.payload.toString())
      }
      return {
        ...state,
        pushEnabled: action.payload
      }
    
    default:
      return state
  }
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState)
  const { user } = useAuthStore()
  const subscriptionRef = useRef<any>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  // Initialize audio context for notification sounds
  useEffect(() => {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      audioContextRef.current = new AudioContext()
    }
  }, [])

  // Play notification sound
  const playNotificationSound = useCallback(async (type: NotificationType) => {
    if (!state.soundEnabled || !audioContextRef.current) return

    try {
      // Create different tones for different notification types
      const frequencies = {
        info: 800,
        success: 1000,
        warning: 600,
        error: 400,
        service_update: 900,
        appointment_reminder: 750
      }

      const frequency = frequencies[type] || 800
      const oscillator = audioContextRef.current.createOscillator()
      const gainNode = audioContextRef.current.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)

      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime)
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.3, audioContextRef.current.currentTime + 0.1)
      gainNode.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 0.5)

      oscillator.start(audioContextRef.current.currentTime)
      oscillator.stop(audioContextRef.current.currentTime + 0.5)
    } catch (error) {
      console.warn('Could not play notification sound:', error)
    }
  }, [state.soundEnabled])

  // Request push notification permission
  const requestPushPermission = useCallback(async () => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      const permission = await Notification.requestPermission()
      const enabled = permission === 'granted'
      dispatch({ type: 'TOGGLE_PUSH', payload: enabled })
      return enabled
    }
    return false
  }, [])

  // Show browser push notification
  const showPushNotification = useCallback((notification: DashboardNotification) => {
    if (!state.pushEnabled || !('Notification' in window) || Notification.permission !== 'granted') {
      return
    }

    const notif = new Notification(notification.title, {
      body: notification.message,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      tag: notification.id,
      requireInteraction: notification.type === 'error' || notification.type === 'appointment_reminder',
      data: {
        notificationId: notification.id,
        actionUrl: notification.action_url
      }
    })

    notif.onclick = () => {
      window.focus()
      if (notification.action_url) {
        window.location.href = notification.action_url
      }
      notif.close()
    }

    // Auto-close after 10 seconds unless it requires interaction
    if (!notif.requireInteraction) {
      setTimeout(() => notif.close(), 10000)
    }
  }, [state.pushEnabled])

  // Load notifications from database
  const refreshNotifications = useCallback(async () => {
    if (!user?.id) return

    try {
      const notifications = await db.getNotifications(user.id)
      dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications || [] })
    } catch (error) {
      console.error('Error loading notifications:', error)
    }
  }, [user?.id])

  const removeToast = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id })
  }, [])

  const showToast = useCallback((toast: Omit<ToastNotification, 'id' | 'timestamp'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const toastWithId: ToastNotification = {
      ...toast,
      id,
      timestamp: Date.now()
    }

    dispatch({ type: 'ADD_TOAST', payload: toastWithId })

    // Auto-remove toast after duration
    setTimeout(() => {
      removeToast(id)
    }, toast.duration || 5000)
  }, [removeToast])

  // Setup real-time subscription
  useEffect(() => {
    if (!user?.id) return

    const setupSubscription = async () => {
      try {
        // Load initial notifications
        await refreshNotifications()

        // Setup real-time subscription
        subscriptionRef.current = db.subscribeToNotifications(user.id, (payload) => {
          console.log('Real-time notification:', payload)
          
          if (payload.eventType === 'INSERT') {
            const newNotification = payload.new as DashboardNotification
            
            // Add to state
            dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification })
            
            // Play sound
            playNotificationSound(newNotification.type)
            
            // Show push notification
            showPushNotification(newNotification)
            
            // Show toast
            showToast({
              title: newNotification.title,
              message: newNotification.message,
              type: newNotification.type,
              duration: 5000,
              actions: newNotification.action_url ? [{
                label: newNotification.action_label || 'Ver',
                action: () => window.location.href = newNotification.action_url!,
                style: 'primary'
              }] : undefined
            })
          }
        })

        dispatch({ type: 'SET_CONNECTION_STATUS', payload: true })
      } catch (error) {
        console.error('Error setting up notification subscription:', error)
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: false })
      }
    }

    setupSubscription()

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
      }
    }
  }, [user?.id, playNotificationSound, showPushNotification, refreshNotifications, showToast])

  // Context methods
  const addNotification = useCallback(async (notification: Omit<DashboardNotification, 'id' | 'created_at'>) => {
    if (!user?.id) return

    try {
      const newNotification: Omit<DashboardNotification, 'id'> = {
        ...notification,
        user_id: user.id,
        created_at: new Date().toISOString()
      }

      // Insert into database (this will trigger the real-time subscription)
      await db.createNotification(newNotification)

    } catch (error) {
      console.error('Error adding notification:', error)
    }
  }, [user?.id])

  const markAsRead = useCallback(async (id: string) => {
    try {
      await db.markNotificationAsRead(id)
      dispatch({ type: 'MARK_AS_READ', payload: id })
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return

    try {
      const unreadIds = state.notifications
        .filter(n => !n.is_read)
        .map(n => n.id)

      // Update all unread notifications in database
      await Promise.all(
        unreadIds.map(id => db.markNotificationAsRead(id))
      )

      dispatch({ type: 'MARK_ALL_AS_READ' })
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }, [user?.id, state.notifications])



  const toggleSound = useCallback(() => {
    dispatch({ type: 'TOGGLE_SOUND', payload: !state.soundEnabled })
  }, [state.soundEnabled])

  const togglePush = useCallback(async () => {
    if (!state.pushEnabled) {
      const enabled = await requestPushPermission()
      if (!enabled) return
    } else {
      dispatch({ type: 'TOGGLE_PUSH', payload: false })
    }
  }, [state.pushEnabled, requestPushPermission])

  const contextValue: NotificationContextType = {
    state,
    addNotification,
    markAsRead,
    markAllAsRead,
    showToast,
    removeToast,
    toggleSound,
    togglePush,
    refreshNotifications
  }

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

 