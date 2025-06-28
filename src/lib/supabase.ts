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

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey) 