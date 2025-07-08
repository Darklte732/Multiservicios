'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'
import type { DashboardNotification, NotificationType } from '@/types'
import toast from 'react-hot-toast'

// Notification Context Types
interface NotificationContextType {
  notifications: DashboardNotification[]
  unreadCount: number
  connectionStatus: 'connected' | 'disconnected' | 'connecting'
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  fetchNotifications: () => Promise<void>
  addToast: (message: string, type?: 'success' | 'error' | 'loading' | 'custom') => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore()
  const [notifications, setNotifications] = useState<DashboardNotification[]>([])
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected')
  
  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length

  // Add toast notification using React Hot Toast
  const addToast = useCallback((message: string, type: 'success' | 'error' | 'loading' | 'custom' = 'custom') => {
    switch (type) {
      case 'success':
        toast.success(message)
        break
      case 'error':
        toast.error(message)
        break
      case 'loading':
        toast.loading(message)
        break
      default:
        toast(message, {
          icon: '🔔',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        })
    }
  }, [])

  // Fetch notifications from database
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) {
      setNotifications([])
      return
    }

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.warn('Error fetching notifications:', error)
        // Don't show error toast if it's just a missing table or RLS issue
        // Instead, set empty notifications and continue
        setNotifications([])
        return
      }
      
      // Transform data to match DashboardNotification type
      const transformedNotifications: DashboardNotification[] = (data || []).map(notification => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type as NotificationType,
        read: notification.is_read || false,
        created_at: notification.created_at,
        read_at: notification.read_at || undefined,
        user_id: notification.user_id
      }))

      setNotifications(transformedNotifications)
      setConnectionStatus('connected')
    } catch (error) {
      console.warn('Unexpected error fetching notifications:', error)
      // Set empty notifications instead of showing error
      setNotifications([])
      setConnectionStatus('disconnected')
    }
  }, [user?.id, addToast])

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!user?.id) return

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ 
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error marking notification as read:', error)
        addToast('Error updating notification', 'error')
        return
      }

      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true, read_at: new Date().toISOString() }
            : notification
        )
      )
    } catch (error) {
      console.error('Unexpected error marking notification as read:', error)
      addToast('Failed to update notification', 'error')
    }
  }, [user?.id, addToast])

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user?.id || unreadCount === 0) return

    try {
      const unreadIds = notifications
        .filter(n => !n.read)
        .map(n => n.id)

      if (unreadIds.length === 0) return

      const { error } = await supabase
        .from('notifications')
        .update({ 
          is_read: true,
          read_at: new Date().toISOString()
        })
        .in('id', unreadIds)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error marking all notifications as read:', error)
        addToast('Error updating notifications', 'error')
        return
      }

      // Update local state
      const readAt = new Date().toISOString()
      setNotifications(prev => 
        prev.map(notification => 
          !notification.read 
            ? { ...notification, read: true, read_at: readAt }
            : notification
        )
      )

      addToast('All notifications marked as read', 'success')
    } catch (error) {
      console.error('Unexpected error marking all notifications as read:', error)
      addToast('Failed to update notifications', 'error')
    }
  }, [user?.id, notifications, unreadCount, addToast])

  // Set up real-time subscription
  useEffect(() => {
    if (!user?.id) {
      setConnectionStatus('disconnected')
      return
    }

    setConnectionStatus('connecting')

    // Initial fetch
    fetchNotifications()

    // Set up real-time subscription
    const subscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newNotification = payload.new as any
            const transformedNotification: DashboardNotification = {
              id: newNotification.id,
              title: newNotification.title,
              message: newNotification.message,
              type: newNotification.type as NotificationType,
              read: newNotification.read || false,
              created_at: newNotification.created_at,
              read_at: newNotification.read_at || undefined,
              user_id: newNotification.user_id
            }
            
            setNotifications(prev => [transformedNotification, ...prev])
            
            // Show toast for new notification
            addToast(`${newNotification.title}: ${newNotification.message}`, 'custom')
          } else if (payload.eventType === 'UPDATE') {
            const updatedNotification = payload.new as any
            const transformedNotification: DashboardNotification = {
              id: updatedNotification.id,
              title: updatedNotification.title,
              message: updatedNotification.message,
              type: updatedNotification.type as NotificationType,
              read: updatedNotification.read || false,
              created_at: updatedNotification.created_at,
              read_at: updatedNotification.read_at || undefined,
              user_id: updatedNotification.user_id
            }
            
            setNotifications(prev => 
              prev.map(notification => 
                notification.id === updatedNotification.id 
                  ? transformedNotification
                  : notification
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setNotifications(prev => 
              prev.filter(notification => notification.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe((status) => {
        setConnectionStatus(status === 'SUBSCRIBED' ? 'connected' : 'disconnected')
      })

    // Cleanup subscription
    return () => {
      subscription.unsubscribe()
      setConnectionStatus('disconnected')
    }
  }, [user?.id, fetchNotifications, addToast])

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    connectionStatus,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
    addToast
  }

  return (
    <NotificationContext.Provider value={value}>
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

// Export types for component usage  
export type { NotificationType, DashboardNotification } from '@/types'

 