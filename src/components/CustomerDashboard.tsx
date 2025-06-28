'use client'

import { useState, useEffect, useCallback } from 'react'
import { Clock, Calendar, Star, Wrench, User, Shield, Phone, MapPin, CheckCircle, AlertCircle, Zap } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { db } from '@/lib/supabase'
import { LoadingSpinner } from './LoadingSpinner'
import { ServiceCard } from './dashboard/ServiceCard'
import { WarrantyCard } from './dashboard/WarrantyCard'
import { DashboardStats } from './dashboard/DashboardStats'

export function CustomerDashboard() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('current')
  const [isLoading, setIsLoading] = useState(true)
  const [serviceRequests, setServiceRequests] = useState<any[]>([])
  const [warranties, setWarranties] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])

  const loadCustomerData = useCallback(async () => {
    if (!user?.id) return
    
    try {
      setIsLoading(true)
      
      // Load service requests
      const requests = await db.getServiceRequests({ customerId: user.id })
      setServiceRequests(requests || [])
      
      // Load warranties
      const warrantyData = await db.getServiceWarranties()
      const customerWarranties = warrantyData?.filter(w => 
        requests?.some(r => r.id === w.service_request_id)
      ) || []
      setWarranties(customerWarranties)
      
      // Load notifications
      const notificationData = await db.getNotifications(user.id)
      setNotifications(notificationData || [])
      
      // No need to calculate stats here - DashboardStats component will handle it
      
    } catch (error) {
      console.error('Error loading customer data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (user?.id) {
      loadCustomerData()
    }
  }, [user?.id, loadCustomerData])

  const currentServices = serviceRequests.filter(r => 
    ['pending', 'confirmed', 'in_progress'].includes(r.status)
  )
  
  const completedServices = serviceRequests.filter(r => 
    r.status === 'completed'
  )

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600">Por favor inicia sesión para acceder al panel.</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Bienvenido, {user.name}
              </h1>
              <p className="text-gray-600">Panel de Cliente - MultiServicios</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 px-3 py-1 rounded-full">
                <span className="text-blue-700 text-sm font-medium">Cliente Activo</span>
              </div>
              {notifications.filter(n => !n.read).length > 0 && (
                <div className="bg-red-50 px-3 py-1 rounded-full">
                  <span className="text-red-700 text-sm font-medium">
                    {notifications.filter(n => !n.read).length} notificaciones
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <DashboardStats
          services={serviceRequests}
          warranties={warranties}
        />

        {/* Main Dashboard Content */}
        <div className="bg-white rounded-lg shadow mt-8">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'current', name: 'Servicios Actuales', count: currentServices.length },
                { id: 'history', name: 'Historial', count: completedServices.length },
                { id: 'warranties', name: 'Garantías', count: warranties.length },
                { id: 'notifications', name: 'Notificaciones', count: notifications.filter(n => !n.read).length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.name}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'current' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Servicios en Progreso</h3>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Solicitar Nuevo Servicio
                  </button>
                </div>

                {currentServices.length === 0 ? (
                  <div className="text-center py-8">
                    <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay servicios activos</h3>
                    <p className="text-gray-600">Solicita un nuevo servicio para comenzar.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentServices.map((service) => (
                      <ServiceCard key={service.id} service={service} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Historial de Servicios</h3>
                
                {completedServices.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay servicios completados</h3>
                    <p className="text-gray-600">Tus servicios completados aparecerán aquí.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {completedServices.map((service) => (
                      <ServiceCard key={service.id} service={service} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'warranties' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Garantías Activas</h3>
                
                {warranties.length === 0 ? (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay garantías activas</h3>
                    <p className="text-gray-600">Las garantías de tus servicios aparecerán aquí.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {warranties.map((warranty) => (
                      <WarrantyCard key={warranty.id} warranty={warranty} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Notificaciones</h3>
                
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay notificaciones</h3>
                    <p className="text-gray-600">Tus notificaciones aparecerán aquí.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div key={notification.id} className={`border rounded-lg p-4 ${
                        notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{notification.title}</h4>
                            <p className="text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-sm text-gray-500 mt-2">
                              {new Date(notification.created_at).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          {!notification.read && (
                            <button
                              onClick={async () => {
                                await db.markNotificationAsRead(notification.id)
                                loadCustomerData()
                              }}
                              className="text-blue-600 text-sm hover:text-blue-800"
                            >
                              Marcar como leída
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 