'use client'

import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'

const DEFAULT_MESSAGE =
  '¡Hola Neno! Vi tu sitio web y me gustaría más información sobre tus servicios eléctricos. ¿Está disponible?'

export const WhatsAppButton = () => {
  const message = encodeURIComponent(DEFAULT_MESSAGE)

  return (
    <a
      href={`https://wa.me/18092514329?text=${message}`}
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
    >
      <WhatsAppIcon className="h-6 w-6" />
    </a>
  )
}
