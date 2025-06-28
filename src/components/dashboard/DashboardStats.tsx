'use client'

import { memo, useMemo } from 'react'
import { Calendar, CheckCircle, Clock, Star, TrendingUp, Shield } from 'lucide-react'
import type { ServiceRequest, ServiceWarranty } from '@/types'

interface DashboardStatsProps {
  services: ServiceRequest[]
  warranties: ServiceWarranty[]
  className?: string
}

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  subtitle?: string
}

const StatCard = memo(function StatCard({ 
  title, 
  value, 
  icon, 
  change, 
  changeType = 'neutral',
  subtitle 
}: StatCardProps) {
  const changeColorClass = useMemo(() => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600'
      case 'negative':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }, [changeType])

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
          {change && (
            <p className={`text-sm ${changeColorClass} mt-1`}>{change}</p>
          )}
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  )
})

export const DashboardStats = memo(function DashboardStats({ 
  services, 
  warranties,
  className = '' 
}: DashboardStatsProps) {
  const stats = useMemo(() => {
    // Service statistics
    const totalServices = services.length
    const completedServices = services.filter(s => s.status === 'completed').length
    const pendingServices = services.filter(s => s.status === 'pending').length
    const inProgressServices = services.filter(s => s.status === 'in_progress').length
    
    // Completion rate
    const completionRate = totalServices > 0 
      ? Math.round((completedServices / totalServices) * 100) 
      : 0
    
    // Average rating calculation
    const servicesWithRating = services.filter(s => s.customer_rating && s.customer_rating > 0)
    const averageRating = servicesWithRating.length > 0
      ? (servicesWithRating.reduce((sum, s) => sum + (s.customer_rating || 0), 0) / servicesWithRating.length).toFixed(1)
      : '0.0'
    
    // Recent services (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentServices = services.filter(s => 
      new Date(s.created_at) >= thirtyDaysAgo
    ).length
    
    // Active warranties
    const now = new Date()
    const activeWarranties = warranties.filter(w => 
      new Date(w.expires_at) > now
    ).length
    
    // Warranties expiring soon (within 30 days)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    const expiringWarranties = warranties.filter(w => {
      const expiryDate = new Date(w.expires_at)
      return expiryDate > now && expiryDate <= thirtyDaysFromNow
    }).length

    return {
      totalServices,
      completedServices,
      pendingServices,
      inProgressServices,
      completionRate,
      averageRating,
      recentServices,
      activeWarranties,
      expiringWarranties
    }
  }, [services, warranties])

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      <StatCard
        title="Total de Servicios"
        value={stats.totalServices}
        icon={<Calendar className="w-6 h-6 text-blue-600" />}
        subtitle="Desde el registro"
      />
      
      <StatCard
        title="Servicios Completados"
        value={stats.completedServices}
        icon={<CheckCircle className="w-6 h-6 text-green-600" />}
        change={`${stats.completionRate}% tasa de finalización`}
        changeType={stats.completionRate >= 80 ? 'positive' : stats.completionRate >= 60 ? 'neutral' : 'negative'}
      />
      
      <StatCard
        title="Servicios Pendientes"
        value={stats.pendingServices + stats.inProgressServices}
        icon={<Clock className="w-6 h-6 text-yellow-600" />}
        subtitle={`${stats.inProgressServices} en progreso`}
      />
      
      <StatCard
        title="Calificación Promedio"
        value={`${stats.averageRating}/5.0`}
        icon={<Star className="w-6 h-6 text-yellow-500" />}
        changeType={parseFloat(stats.averageRating) >= 4.0 ? 'positive' : 'neutral'}
      />
      
      <StatCard
        title="Servicios Recientes"
        value={stats.recentServices}
        icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
        subtitle="Últimos 30 días"
      />
      
      <StatCard
        title="Garantías Activas"
        value={stats.activeWarranties}
        icon={<Shield className="w-6 h-6 text-green-600" />}
        change={stats.expiringWarranties > 0 ? `${stats.expiringWarranties} expiran pronto` : 'Todas vigentes'}
        changeType={stats.expiringWarranties > 0 ? 'negative' : 'positive'}
      />
    </div>
  )
}) 