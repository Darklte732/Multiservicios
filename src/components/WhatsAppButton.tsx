'use client'

import { MessageCircle } from 'lucide-react'

export const WhatsAppButton = () => {
  const message = encodeURIComponent('Hola, necesito un servicio eléctrico')

  return (
    <a
      href={`https://wa.me/18095550123?text=${message}`}
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  )
}
