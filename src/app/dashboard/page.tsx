'use client'

import { TechnicianDashboard } from '@/components/TechnicianDashboard'
import { Footer } from '@/components/Footer'

export default function DashboardPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <TechnicianDashboard />
      <Footer />
    </div>
  )
} 