'use client'

import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'
import { capture } from '@/lib/analytics'

const WHATSAPP_OPENER = encodeURIComponent(
  '¡Hola Neno! Vi tu sitio web y me gustaría más información sobre tus servicios eléctricos. ¿Está disponible?'
)

export function StickyThumbBar() {
  return (
    <div
      className="lg:hidden"
      style={{
        position: 'fixed',
        bottom: 16,
        left: 12,
        right: 12,
        zIndex: 40,
        background: 'rgba(15,15,17,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 20,
        padding: 10,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 8,
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
      }}
    >
      <a
        href={`https://wa.me/18092514329?text=${WHATSAPP_OPENER}`}
        onClick={() => capture('whatsapp_clicked', { surface: 'sticky_thumb_bar' })}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          background: '#22c55e',
          color: '#fff',
          borderRadius: 14,
          padding: 14,
          minHeight: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          fontSize: 13,
          fontWeight: 800,
          textDecoration: 'none',
        }}
      >
        <WhatsAppIcon style={{ width: 18, height: 18 }} /> WHATSAPP
      </a>
      <a
        href="tel:+18092514329"
        onClick={() => capture('phone_clicked', { surface: 'sticky_thumb_bar' })}
        style={{
          background: '#F5B800',
          color: '#000',
          borderRadius: 14,
          padding: 14,
          minHeight: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          fontSize: 14,
          fontWeight: 800,
          textDecoration: 'none',
          lineHeight: 1,
        }}
      >
        <span style={{ fontSize: 18 }}>📞</span> LLAMAR
      </a>
    </div>
  )
}
