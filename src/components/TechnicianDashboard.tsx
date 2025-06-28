'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Zap, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Phone, 
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  User,
  Bell,
  Star,
  Award,
  Target,
  Navigation,
  MessageCircle,
  Settings,
  BarChart3,
  Activity
} from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import type { Appointment, ServiceType } from '@/types'
import { SERVICE_TRANSLATIONS } from '@/types'
import { cn } from '@/utils/cn'

type TabType = 'pending' | 'today' | 'earnings' | 'notifications'

interface MockJob {
  id: string
  customerName: string
  serviceType: ServiceType
  location: string
  scheduledTime: string
  estimatedPrice: number
  customerPhone: string
  urgency: 'high' | 'medium' | 'low' | 'emergency'
  description: string
  date: string
}

export function TechnicianDashboard() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState<TabType>('pending')
  const [notifications, setNotifications] = useState<Array<{
    id: string
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
    isRead: boolean
    timestamp: string
  }>>([
    {
      id: '1',
      title: 'Nuevo Trabajo Asignado',
      message: 'Se te ha asignado una emergencia en Av. Libertad',
      type: 'info',
      isRead: false,
      timestamp: new Date().toISOString()
    },
    {
      id: '2', 
      title: 'Cliente Satisfecho',
      message: 'María González te calificó con 5 estrellas',
      type: 'success',
      isRead: false,
      timestamp: new Date(Date.now() - 3600000).toISOString()
    }
  ])
  const [technicianStats, setTechnicianStats] = useState({
    rating: 4.8,
    completedJobs: 156,
    monthlyEarnings: 45600,
    responseTime: '12 min',
    customerSatisfaction: 98
  })

  // Check if user is a technician
  if (!user?.electrician_profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600">Solo los técnicos pueden acceder a este panel.</p>
        </div>
      </div>
    )
  }

  // Mock data for demonstration - in a real app this would come from an API
  const mockJobs: MockJob[] = [
    {
      id: '1',
      customerName: 'María González',
      serviceType: 'instalacion',
      location: 'Calle Principal #123, El Seibo',
      scheduledTime: '09:00',
      estimatedPrice: 2500,
      customerPhone: '+18095551234',
      urgency: 'high',
      description: 'Instalación completa de sistema eléctrico en casa nueva',
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: '2',
      customerName: 'Carlos Martínez',
      serviceType: 'reparacion',
      location: 'Av. Libertad #456, El Seibo',
      scheduledTime: '14:30',
      estimatedPrice: 1200,
      customerPhone: '+18095555678',
      urgency: 'medium',
      description: 'Reparación de breaker principal que no funciona',
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: '3',
      customerName: 'Ana Rodríguez',
      serviceType: 'emergencia',
      location: 'Calle Duarte #789, El Seibo',
      scheduledTime: '16:00',
      estimatedPrice: 4000,
      customerPhone: '+18095559999',
      urgency: 'emergency',
      description: 'Emergencia: Corto circuito en cocina, sin electricidad',
      date: new Date().toISOString().split('T')[0]
    }
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 0,
    }).format(price).replace('DOP', 'RD$')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-DO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
        return 'Emergencia'
      case 'high':
        return 'Alta'
      case 'medium':
        return 'Media'
      case 'low':
        return 'Baja'
      default:
        return 'Normal'
    }
  }

  const handleAcceptJob = (jobId: string) => {
    alert(`Trabajo ${jobId} aceptado. El cliente será notificado.`)
  }

  const handleRejectJob = (jobId: string) => {
    alert(`Trabajo ${jobId} rechazado. Se buscará otro técnico disponible.`)
  }

  const handleCallCustomer = (phone: string, customerName: string) => {
    alert(`Llamando a ${customerName} al ${phone}`)
  }

  // Calculate stats
  const todayEarnings = mockJobs.reduce((total, job) => total + job.estimatedPrice, 0)
  const weeklyEarnings = todayEarnings * 1.5 // Mock weekly total
  const pendingJobs = mockJobs.length

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div className="flex items-center space-x-2">
                <Zap className="h-6 w-6 text-blue-600" />
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">Panel Técnico</h1>
                  <p className="text-sm text-gray-600">Bienvenido, {user.name}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions & Notifications */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button className="p-2 text-gray-600 hover:text-gray-900 relative">
                  <Bell className="h-6 w-6" />
                  {notifications.some(n => !n.isRead) && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {notifications.filter(n => !n.isRead).length}
                      </span>
                    </span>
                  )}
                </button>
              </div>

              {/* Quick Stats */}
              <div className="hidden md:flex items-center space-x-4 bg-gray-50 rounded-lg px-4 py-2">
                <div className="text-center">
                  <p className="text-xs text-gray-600">Trabajos Pendientes</p>
                  <p className="text-lg font-bold text-blue-600">{pendingJobs}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">Ganancia Hoy</p>
                  <p className="text-lg font-bold text-green-600">{formatPrice(todayEarnings)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">Calificación</p>
                  <p className="text-lg font-bold text-yellow-600">{technicianStats.rating}⭐</p>
                </div>
              </div>

              {/* Settings */}
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Settings className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Trabajos Pendientes</p>
                <p className="text-3xl font-bold text-blue-600">{pendingJobs}</p>
                <p className="text-xs text-gray-500 mt-1">Para hoy</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ganancia Diaria</p>
                <p className="text-3xl font-bold text-green-600">{formatPrice(todayEarnings)}</p>
                <p className="text-xs text-green-500 mt-1">+15% vs ayer</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Calificación</p>
                <p className="text-3xl font-bold text-yellow-600">{technicianStats.rating}</p>
                <p className="text-xs text-gray-500 mt-1">Promedio general</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tiempo Respuesta</p>
                <p className="text-3xl font-bold text-purple-600">{technicianStats.responseTime}</p>
                <p className="text-xs text-green-500 mt-1">Excelente</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Activity className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            Resumen de Rendimiento
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Award className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{technicianStats.completedJobs}</p>
              <p className="text-sm text-gray-600">Trabajos Completados</p>
              <p className="text-xs text-green-500 mt-1">+12 este mes</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{technicianStats.customerSatisfaction}%</p>
              <p className="text-sm text-gray-600">Satisfacción del Cliente</p>
              <p className="text-xs text-green-500 mt-1">Top 5% técnicos</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">{formatPrice(technicianStats.monthlyEarnings)}</p>
              <p className="text-sm text-gray-600">Ingresos del Mes</p>
              <p className="text-xs text-green-500 mt-1">+8% vs mes anterior</p>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'pending', name: 'Trabajos Pendientes', count: pendingJobs, icon: Clock },
                { id: 'today', name: 'Agenda de Hoy', count: mockJobs.length, icon: Calendar },
                { id: 'notifications', name: 'Notificaciones', count: notifications.filter(n => !n.isRead).length, icon: Bell },
                { id: 'earnings', name: 'Ganancias', count: null, icon: DollarSign }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={cn(
                    "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2",
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                  {tab.count !== null && tab.count > 0 && (
                    <span className={cn(
                      "ml-2 px-2 py-0.5 rounded-full text-xs font-medium",
                      activeTab === tab.id 
                        ? "bg-blue-100 text-blue-600" 
                        : "bg-gray-100 text-gray-600"
                    )}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'pending' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Trabajos Pendientes</h3>
                  <span className="text-sm text-gray-600">{pendingJobs} trabajos disponibles</span>
                </div>

                {mockJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay trabajos pendientes</h3>
                    <p className="text-gray-600">¡Buen trabajo! Has completado todos los trabajos asignados.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mockJobs.map((job) => (
                      <div key={job.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">{job.customerName}</h4>
                              <span className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium border",
                                getUrgencyColor(job.urgency)
                              )}>
                                {getUrgencyText(job.urgency)}
                              </span>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                {SERVICE_TRANSLATIONS[job.serviceType]}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-3">{job.description}</p>
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4" />
                                <span>{job.location}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4" />
                                <span>Programado para las {job.scheduledTime}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4" />
                                <span>{job.customerPhone}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right ml-6">
                            <p className="text-2xl font-bold text-green-600">{formatPrice(job.estimatedPrice)}</p>
                            <p className="text-sm text-gray-600">Precio estimado</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleCallCustomer(job.customerPhone, job.customerName)}
                              className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                            >
                              <Phone className="h-4 w-4" />
                              <span>Llamar</span>
                            </button>
                            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                              <Navigation className="h-4 w-4" />
                              <span>Navegar</span>
                            </button>
                          </div>

                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleRejectJob(job.id)}
                              className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                            >
                              <XCircle className="h-4 w-4" />
                              <span>Rechazar</span>
                            </button>
                            <button
                              onClick={() => handleAcceptJob(job.id)}
                              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span>Aceptar Trabajo</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'today' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Agenda de Hoy</h3>
                  <span className="text-sm text-gray-600">{formatDate(new Date().toISOString())}</span>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Resumen del Día</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-blue-800 font-medium">{mockJobs.length} Trabajos</p>
                      <p className="text-blue-600">Programados</p>
                    </div>
                    <div>
                      <p className="text-blue-800 font-medium">{formatPrice(todayEarnings)}</p>
                      <p className="text-blue-600">Ingresos Estimados</p>
                    </div>
                    <div>
                      <p className="text-blue-800 font-medium">8 horas</p>
                      <p className="text-blue-600">Tiempo Estimado</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {mockJobs.map((job, index) => (
                    <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{job.scheduledTime} - {job.customerName}</h4>
                            <p className="text-sm text-gray-600">{job.location}</p>
                            <p className="text-sm text-gray-500">{SERVICE_TRANSLATIONS[job.serviceType]}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{formatPrice(job.estimatedPrice)}</p>
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium border",
                            getUrgencyColor(job.urgency)
                          )}>
                            {getUrgencyText(job.urgency)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Notificaciones</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-700">
                    Marcar todas como leídas
                  </button>
                </div>

                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "border rounded-lg p-4",
                        notification.isRead ? "border-gray-200 bg-white" : "border-blue-200 bg-blue-50"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                          <p className="text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            {new Date(notification.timestamp).toLocaleString('es-DO')}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div className="w-3 h-3 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'earnings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Análisis de Ganancias</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 className="font-semibold text-green-900 mb-2">Ganancias de Hoy</h4>
                    <p className="text-3xl font-bold text-green-600">{formatPrice(todayEarnings)}</p>
                    <p className="text-sm text-green-700 mt-1">+15% vs ayer</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-900 mb-2">Ganancias Semanales</h4>
                    <p className="text-3xl font-bold text-blue-600">{formatPrice(weeklyEarnings)}</p>
                    <p className="text-sm text-blue-700 mt-1">+8% vs semana anterior</p>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <h4 className="font-semibold text-purple-900 mb-2">Ganancias Mensuales</h4>
                    <p className="text-3xl font-bold text-purple-600">{formatPrice(technicianStats.monthlyEarnings)}</p>
                    <p className="text-sm text-purple-700 mt-1">Meta: RD$50,000</p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Desglose por Tipo de Servicio</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Instalaciones Eléctricas</span>
                      <span className="font-bold text-gray-900">RD$18,500 (41%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Reparaciones</span>
                      <span className="font-bold text-gray-900">RD$15,200 (33%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Emergencias</span>
                      <span className="font-bold text-gray-900">RD$8,400 (18%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Mantenimiento</span>
                      <span className="font-bold text-gray-900">RD$3,500 (8%)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 