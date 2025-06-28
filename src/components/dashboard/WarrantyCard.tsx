'use client'

import { memo, useMemo } from 'react'
import { Shield, Calendar, AlertTriangle, CheckCircle } from 'lucide-react'
import type { ServiceWarranty } from '@/types'

interface WarrantyCardProps {
  warranty: ServiceWarranty
  onClaim?: (warrantyId: string) => void
}

export const WarrantyCard = memo(function WarrantyCard({ 
  warranty, 
  onClaim 
}: WarrantyCardProps) {
  const warrantyStatus = useMemo(() => {
    const now = new Date()
    const expiryDate = new Date(warranty.expires_at)
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysUntilExpiry < 0) {
      return {
        status: 'expired',
        text: 'Expirada',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        borderColor: 'border-red-200',
        icon: <AlertTriangle className="w-4 h-4" />,
        daysText: `Expiró hace ${Math.abs(daysUntilExpiry)} días`
      }
    } else if (daysUntilExpiry <= 30) {
      return {
        status: 'expiring',
        text: 'Por Expirar',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        borderColor: 'border-yellow-200',
        icon: <AlertTriangle className="w-4 h-4" />,
        daysText: `Expira en ${daysUntilExpiry} días`
      }
    } else {
      return {
        status: 'active',
        text: 'Activa',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        borderColor: 'border-green-200',
        icon: <CheckCircle className="w-4 h-4" />,
        daysText: `Válida por ${daysUntilExpiry} días más`
      }
    }
  }, [warranty.expires_at])

  const formattedCoverage = useMemo(() => {
    // Use warranty description to create coverage items
    if (warranty.description) {
      // Split by common separators to create coverage list
      const items = warranty.description
        .split(/[,;•\n]/)
        .map(item => item.trim())
        .filter(item => item.length > 0)
      
      return items.length > 0 ? items : [warranty.description]
    }
    
    // Fallback based on warranty type
    switch (warranty.warranty_type) {
      case 'materials':
        return ['Materiales defectuosos', 'Reemplazo de componentes', 'Garantía de fábrica']
      case 'labor':
        return ['Mano de obra', 'Reinstalación sin costo', 'Corrección de errores']
      case 'full':
        return ['Cobertura completa', 'Materiales y mano de obra', 'Reemplazo total si es necesario']
      default:
        return ['Cobertura estándar de garantía']
    }
  }, [warranty.description, warranty.warranty_type])

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-lg ${warrantyStatus.bgColor}`}>
            <Shield className={`w-5 h-5 ${warrantyStatus.color}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Garantía de Servicio
            </h3>
            <p className="text-sm text-gray-600">#{warranty.service_request_id}</p>
          </div>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${warrantyStatus.bgColor} ${warrantyStatus.color} ${warrantyStatus.borderColor}`}>
          {warrantyStatus.icon}
          <span className="ml-1">{warrantyStatus.text}</span>
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Válida hasta: {new Date(warranty.expires_at).toLocaleDateString('es-DO')}</span>
        </div>
        
        <div className="text-sm">
          <span className={`font-medium ${warrantyStatus.color}`}>
            {warrantyStatus.daysText}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Cobertura incluida:</h4>
        <ul className="space-y-1">
          {formattedCoverage.map((item, index) => (
            <li key={index} className="text-sm text-gray-600 flex items-start">
              <CheckCircle className="w-3 h-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {warranty.terms_conditions && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>Términos:</strong> {warranty.terms_conditions}
          </p>
        </div>
      )}

      {onClaim && warrantyStatus.status !== 'expired' && (
        <button
          onClick={() => onClaim(warranty.id)}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
        >
          Reclamar Garantía
        </button>
      )}

      {warrantyStatus.status === 'expired' && (
        <div className="w-full px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium text-center">
          Garantía Expirada
        </div>
      )}
    </div>
  )
}) 