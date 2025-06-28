import { createClient } from '@supabase/supabase-js'
import type {
  UsersTable,
  CustomersTable,
  AppointmentsTable,
  JobCompletionsTable,
  NotificationsTable,
  AvailabilitySlotsTable,
} from '@/types'

const supabaseUrl = 'https://ncnbwaxtugvswavbrpck.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jbmJ3YXh0dWd2c3dhdmJycGNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NDEwMDEsImV4cCI6MjA2NjUxNzAwMX0.2zVjucPTUBDPwNji9cW3SCdRVXvgQMudtgqkLqSEo80'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: UsersTable
        Insert: Omit<UsersTable, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<UsersTable, 'id' | 'created_at'>>
      }
      customers: {
        Row: CustomersTable
        Insert: Omit<CustomersTable, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<CustomersTable, 'id' | 'created_at'>>
      }
      customer_profiles: {
        Row: any
        Insert: any
        Update: any
      }
      electrician_profiles: {
        Row: any
        Insert: any
        Update: any
      }
      service_requests: {
        Row: any
        Insert: any
        Update: any
      }
      service_warranties: {
        Row: any
        Insert: any
        Update: any
      }
      appointments: {
        Row: AppointmentsTable
        Insert: Omit<AppointmentsTable, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<AppointmentsTable, 'id' | 'created_at'>>
      }
      job_completions: {
        Row: JobCompletionsTable
        Insert: Omit<JobCompletionsTable, 'id' | 'created_at'>
        Update: Partial<Omit<JobCompletionsTable, 'id' | 'created_at'>>
      }
      notifications: {
        Row: NotificationsTable
        Insert: Omit<NotificationsTable, 'id' | 'created_at'>
        Update: Partial<Omit<NotificationsTable, 'id' | 'created_at'>>
      }
      availability_slots: {
        Row: AvailabilitySlotsTable
        Insert: Omit<AvailabilitySlotsTable, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<AvailabilitySlotsTable, 'id' | 'created_at'>>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Database utility functions
export const db = {
  // Users and Authentication
  async getUser(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        customer_profile:customer_profiles(*),
        electrician_profile:electrician_profiles(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async getUserByPhone(phone: string) {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        customer_profile:customer_profiles(*),
        electrician_profile:electrician_profiles(*)
      `)
      .eq('phone', phone)
      .single()
    
    if (error) throw error
    return data
  },

  // Service Requests
  async getServiceRequests(filters: {
    customerId?: string
    electricianId?: string
    status?: string
    limit?: number
  } = {}) {
    let query = supabase
      .from('service_requests')
      .select(`
        *,
        customer:customers(*),
        assigned_electrician:users!assigned_electrician_id(*)
      `)
      .order('created_at', { ascending: false })

    if (filters.customerId) {
      query = query.eq('customer_id', filters.customerId)
    }
    
    if (filters.electricianId) {
      query = query.eq('assigned_electrician_id', filters.electricianId)
    }
    
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    
    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async createServiceRequest(request: any) {
    const { data, error } = await supabase
      .from('service_requests')
      .insert(request)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateServiceRequest(id: string, updates: any) {
    const { data, error } = await supabase
      .from('service_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Service Warranties
  async getServiceWarranties(serviceRequestId?: string) {
    let query = supabase
      .from('service_warranties')
      .select('*')
      .order('created_at', { ascending: false })

    if (serviceRequestId) {
      query = query.eq('service_request_id', serviceRequestId)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async createServiceWarranty(warranty: any) {
    const { data, error } = await supabase
      .from('service_warranties')
      .insert(warranty)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Electricians
  async getAvailableElectricians(serviceArea?: string) {
    let query = supabase
      .from('electrician_profiles')
      .select(`
        *,
        user:users(*)
      `)
      .eq('availability_status', 'available')
      .order('rating', { ascending: false })

    if (serviceArea) {
      query = query.ilike('service_area', `%${serviceArea}%`)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  // Notifications
  async getNotifications(userId: string, unreadOnly = false) {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (unreadOnly) {
      query = query.eq('read', false)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async markNotificationAsRead(id: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async createNotification(notification: Omit<NotificationsTable, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Real-time subscriptions
  subscribeToServiceRequests(callback: (payload: any) => void) {
    return supabase
      .channel('service_requests')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'service_requests' },
        callback
      )
      .subscribe()
  },

  subscribeToNotifications(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('notifications')
      .on('postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe()
  }
}

export default supabase 