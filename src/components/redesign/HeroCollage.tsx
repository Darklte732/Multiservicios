'use client'

import Image from 'next/image'

const PHOTO_TOP_LEFT = '/41a4fd06-d34c-42a6-b234-46fa1debd1df.jpeg'
const PHOTO_BOTTOM_LEFT = '/cf629f37-1d13-4d7b-8774-7a5ce95bf946.jpeg'
const PHOTO_TOP_RIGHT = '/4ca1b64b-7b5f-4145-b7de-099d7806492f.jpeg'
const PHOTO_BOTTOM_RIGHT = '/db2d6452-ebcc-4f8a-8588-9df01d849b74.jpeg'

const ACCENT = '#F5B800'
const BEBAS_FONT_FAMILY = '"Bebas Neue", Impact, sans-serif'

type PhotoProps = {
  src: string
  height: number
  alt: string
  priority?: boolean
}

function Photo({ src, height, alt, priority }: PhotoProps) {
  return (
    <div
      style={{
        position: 'relative',
        height,
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden',
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 320px, 100vw"
        priority={priority}
        style={{ objectFit: 'cover' }}
      />
    </div>
  )
}

export function HeroCollage({ className }: { className?: string }) {
  return (
    <div
      className={`relative h-[720px] ${className ?? ''}`.trim()}
      style={{ position: 'relative', height: 720, overflow: 'visible' }}
    >
      {/* Inner 2-col grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          height: '100%',
        }}
      >
        {/* LEFT inner column */}
        <div style={{ display: 'grid', gap: 12 }}>
          <Photo
            src={PHOTO_TOP_LEFT}
            height={300}
            alt="Trabajo eléctrico de MultiServicios El Seibo"
            priority
          />
          <Photo
            src={PHOTO_BOTTOM_LEFT}
            height={240}
            alt="Instalación eléctrica realizada por Neno Báez"
          />
        </div>

        {/* RIGHT inner column — staggered with paddingTop 60 */}
        <div style={{ display: 'grid', gap: 12, paddingTop: 60 }}>
          <Photo
            src={PHOTO_TOP_RIGHT}
            height={240}
            alt="Reparación eléctrica profesional"
          />
          <Photo
            src={PHOTO_BOTTOM_RIGHT}
            height={300}
            alt="Mantenimiento eléctrico en El Seibo"
          />
        </div>
      </div>

      {/* Floating rating card — top-left, overhanging */}
      <div
        style={{
          position: 'absolute',
          top: 30,
          left: -20,
          background: '#fff',
          color: '#0A0A0B',
          borderRadius: 16,
          padding: '14px 18px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          zIndex: 3,
        }}
      >
        <div
          style={{
            fontFamily: BEBAS_FONT_FAMILY,
            fontSize: 32,
            lineHeight: 1,
            letterSpacing: -1,
            fontWeight: 900,
          }}
        >
          4.9
        </div>
        <div>
          <div style={{ fontSize: 14, color: '#eab308' }}>★★★★★</div>
          <div style={{ fontSize: 11, color: '#5a5a62', fontWeight: 600 }}>
            200+ reseñas verificadas
          </div>
        </div>
      </div>

      {/* Floating jobs counter — bottom-right, overhanging */}
      <div
        style={{
          position: 'absolute',
          bottom: 30,
          right: -10,
          background: ACCENT,
          color: '#000',
          borderRadius: 16,
          padding: '14px 18px',
          boxShadow: '0 20px 60px rgba(245,184,0,0.55)',
          zIndex: 3,
        }}
      >
        <div
          style={{
            fontFamily: BEBAS_FONT_FAMILY,
            fontSize: 32,
            lineHeight: 1,
            letterSpacing: -1,
            fontWeight: 900,
          }}
        >
          1,000+
        </div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.05em',
            marginTop: 2,
          }}
        >
          TRABAJOS COMPLETADOS
        </div>
      </div>

      {/* Floating live job glass card — middle-right, overhanging */}
      <div
        style={{
          position: 'absolute',
          top: '45%',
          right: -30,
          background: 'rgba(15,15,17,0.9)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 14,
          padding: '12px 14px',
          minWidth: 240,
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          zIndex: 3,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            fontSize: 10,
            fontWeight: 800,
            color: '#22c55e',
            letterSpacing: 1,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 6,
              height: 6,
              borderRadius: 999,
              background: '#22c55e',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
          EN PROGRESO
        </div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            marginTop: 6,
            color: '#fff',
          }}
        >
          Reparación de panel · Santa Cruz
        </div>
        <div style={{ fontSize: 11, color: '#8a8a92', marginTop: 2 }}>
          Iniciado hace 14 min
        </div>
      </div>
    </div>
  )
}
