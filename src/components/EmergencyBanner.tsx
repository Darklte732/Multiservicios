'use client'

import { useState } from 'react'
import { X, Phone } from 'lucide-react'

export const EmergencyBanner = () => {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="emergency-banner relative">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-3">
        <span className="text-lg">🚨</span>
        <span>
          <strong>EMERGENCIAS 24/7</strong> &bull; Llama Ahora:&nbsp;
          <a
            href="tel:+18095550123"
            className="underline hover:no-underline font-bold"
          >
            +1 (809) 555-0123
          </a>
          &nbsp;&bull; Respuesta en menos de 30 min
        </span>
        <Phone className="h-4 w-4 hidden sm:inline-flex flex-shrink-0" />
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded transition-colors"
        aria-label="Cerrar"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
