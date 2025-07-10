'use client'

import { Suspense } from 'react'
import { CustomerDashboard } from '@/components/CustomerDashboard'
import { Footer } from '@/components/Footer'

function CustomerDashboardContent() {
  return (
    <div>
      <CustomerDashboard />
      <Footer />
    </div>
  )
}

function CustomerDashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Cargando tu Panel de Cliente
        </h2>
        <p className="text-gray-600">
          Obteniendo tus servicios y configuración...
        </p>
      </div>
    </div>
  )
}

export default function CustomerDashboardPage() {
  return (
    <Suspense fallback={<CustomerDashboardLoading />}>
      <CustomerDashboardContent />
    </Suspense>
  )
} 