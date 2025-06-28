'use client'

import { useCallback, useMemo } from 'react'
import { useAuthStore } from '@/store/auth'
import type { User, CustomerProfile, ElectricianProfile, UserType } from '@/types'

export const useOptimizedAuth = () => {
  const { 
    user, 
    status,
    login, 
    logout, 
    isLoading,
    error 
  } = useAuthStore()

  // Computed isAuthenticated from status
  const isAuthenticated = status === 'authenticated'

  // Memoized user profile data
  const userProfile = useMemo(() => {
    if (!user) return null
    
    return {
      id: user.id,
      phone: user.phone,
      fullName: user.name || user.electrician_profile?.name || '',
      email: user.email || '',
      profileType: user.customer_profile ? 'customer' : 'technician',
      isCustomer: !!user.customer_profile,
      isTechnician: !!user.electrician_profile,
    }
  }, [user])

  // Memoized customer data
  const customerData = useMemo(() => {
    if (!user?.customer_profile) return null
    return user.customer_profile
  }, [user?.customer_profile])

  // Memoized technician data  
  const technicianData = useMemo(() => {
    if (!user?.electrician_profile) return null
    return user.electrician_profile
  }, [user?.electrician_profile])

  // Optimized login function
  const handleLogin = useCallback(async (
    phone: string, 
    userType: UserType,
    name: string
  ) => {
    try {
      return await login(phone, userType, name)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }, [login])

  // Optimized logout function
  const handleLogout = useCallback(() => {
    logout()
  }, [logout])

  // Check if user has specific permissions
  const hasPermission = useCallback((permission: string) => {
    if (!user) return false
    
    // Customer permissions
    if (user.customer_profile) {
      const customerPermissions = [
        'view_services',
        'create_service_request', 
        'view_warranties',
        'update_profile'
      ]
      return customerPermissions.includes(permission)
    }
    
    // Technician permissions
    if (user.electrician_profile) {
      const technicianPermissions = [
        'view_assigned_jobs',
        'update_job_status',
        'view_earnings',
        'manage_availability',
        'view_analytics'
      ]
      return technicianPermissions.includes(permission)
    }
    
    return false
  }, [user])

  // Get user's full address
  const fullAddress = useMemo(() => {
    // Note: Both CustomerProfile and ElectricianProfile don't have address fields
    // Address information would be stored separately or added to the interfaces
    return ''
  }, [])

  return {
    // User data
    user,
    userProfile,
    customerData,
    technicianData,
    
    // Auth state
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    login: handleLogin,
    logout: handleLogout,
    
    // Utilities
    hasPermission,
    fullAddress,
    
    // Computed properties
    isCustomer: !!user?.customer_profile,
    isTechnician: !!user?.electrician_profile,
    userName: userProfile?.fullName || 'Usuario',
    userPhone: user?.phone || '',
  }
} 