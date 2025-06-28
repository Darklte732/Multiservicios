'use client'

import { memo } from 'react'
import { Calendar, MapPin, User, Phone, Clock, CheckCircle, AlertCircle, Zap } from 'lucide-react'
import type { ServiceRequest } from '@/types'

interface ServiceCardProps {
  service: ServiceRequest
  onViewDetails?: (serviceId: string) => void
}

export const ServiceCard = memo(function ServiceCard({ 
  service, 
  onViewDetails 
}: ServiceCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'in-progress':
        return <Zap className="w-4 h-4 text-yellow-600" />
      case 'pending':
        return <Clock className="w-4 h-4 text-blue-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado'
      case 'in-progress':
        return 'En Progreso'
      case 'pending':
        return 'Pendiente'
      case 'cancelled':
        return 'Cancelado'
      default:
        return 'Desconocido'
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {service.service_type}
          </h3>
          <p className="text-sm text-gray-600">#{service.id}</p>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(service.status)}`}>
          {getStatusIcon(service.status)}
          <span className="ml-1">{getStatusText(service.status)}</span>
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{new Date(service.created_at).toLocaleDateString('es-DO')}</span>
        </div>
        
        {service.scheduled_date && (
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span>Programado: {new Date(service.scheduled_date).toLocaleDateString('es-DO')}</span>
          </div>
        )}

        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{service.location}</span>
        </div>

        {service.technician_id && (
          <div className="flex items-center text-sm text-gray-600">
            <User className="w-4 h-4 mr-2" />
            <span>Técnico asignado</span>
          </div>
        )}

        {service.customer?.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2" />
            <span>{service.customer.phone}</span>
          </div>
        )}
      </div>

      {service.description && (
        <div className="mb-4">
          <p className="text-sm text-gray-700">{service.description}</p>
        </div>
      )}

      {service.final_price && (
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-600">Total:</span>
          <span className="text-lg font-semibold text-gray-900">
            RD$ {service.final_price.toLocaleString('es-DO')}
          </span>
        </div>
      )}

      {onViewDetails && (
        <button
          onClick={() => onViewDetails(service.id)}
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Ver Detalles
        </button>
      )}
    </div>
  )
}) 