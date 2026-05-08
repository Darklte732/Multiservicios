'use client'

import { useEffect, useState } from 'react'
import { X, Phone } from 'lucide-react'

const STORAGE_KEY = 'multiservicios:emergencyBannerDismissed'

export const EmergencyBanner = () => {
  // Render unconditionally on first paint to avoid SSR/CSR mismatch.
  // Hydrate the dismissed state from localStorage after mount.
  const [dismissed, setDismissed] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage.getItem(STORAGE_KEY) === '1') {
        setDismissed(true)
      }
    } catch {
      // localStorage may be unavailable (private mode, SSR). Fail open.
    }
    setHydrated(true)
  }, [])

  const handleDismiss = () => {
    setDismissed(true)
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, '1')
      }
    } catch {
      // Persisting failed — still hide for the rest of the session.
    }
  }

  // Hide once dismissed (post-hydration). Before hydration, show the banner so
  // the markup matches the server output and users on slow networks still see
  // the emergency CTA immediately.
  if (hydrated && dismissed) return null

  return (
    <div className="emergency-banner relative">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-3">
        <span className="text-lg">🚨</span>
        <span>
          <strong>EMERGENCIAS 24/7</strong> &bull; Llama Ahora:&nbsp;
          <a
            href="tel:+18092514329"
            className="underline hover:no-underline font-bold"
          >
            +1 (809) 251-4329
          </a>
          &nbsp;&bull; Respuesta en menos de 30 min
        </span>
        <Phone className="h-4 w-4 hidden sm:inline-flex flex-shrink-0" />
      </div>
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded transition-colors"
        aria-label="Cerrar"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
