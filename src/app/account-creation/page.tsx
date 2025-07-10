'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { AccountCreation } from '@/components/AccountCreation'
import { useRouter } from 'next/navigation'
import { Footer } from '@/components/Footer'

function AccountCreationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Extract session data from URL parameters
  const sessionData = {
    serviceType: searchParams.get('service') || 'instalacion',
    customerName: searchParams.get('name') || 'Cliente',
    customerPhone: searchParams.get('phone') || '',
    serviceDate: searchParams.get('date') || 'Hoy',
    serviceCode: searchParams.get('code') || '',
    finalPrice: parseInt(searchParams.get('fee') || '400')
  }

  const isAutomatic = searchParams.get('auto') === 'true'

  const handleAccountCreated = (userData: any) => {
    // Redirect to customer dashboard
    router.push('/customer-dashboard')
  }

  const handleSkip = () => {
    // Redirect to home page
    router.push('/')
  }

  return (
    <div>
      <AccountCreation
        sessionData={sessionData}
        onAccountCreated={handleAccountCreated}
        onSkip={handleSkip}
      />
      <Footer />
    </div>
  )
}

function AccountCreationLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Preparando Creación de Cuenta
        </h2>
        <p className="text-gray-600">
          Configurando tus beneficios exclusivos...
        </p>
      </div>
    </div>
  )
}

export default function AccountCreationPage() {
  return (
    <Suspense fallback={<AccountCreationLoading />}>
      <AccountCreationContent />
    </Suspense>
  )
} 