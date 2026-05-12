'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

// Initial photos per slot — these are the images that paint on first render.
// PHOTO_TOP_LEFT is the LCP candidate (top of left column, height 300, priority).
const PHOTO_TOP_LEFT = '/41a4fd06-d34c-42a6-b234-46fa1debd1df.jpeg'
const PHOTO_BOTTOM_LEFT = '/cf629f37-1d13-4d7b-8774-7a5ce95bf946.jpeg'
const PHOTO_TOP_RIGHT = '/4ca1b64b-7b5f-4145-b7de-099d7806492f.jpeg'
const PHOTO_BOTTOM_RIGHT = '/db2d6452-ebcc-4f8a-8588-9df01d849b74.jpeg'

// Rotation pool — every work photo we've shipped to /public, in a fixed order.
// Each slot starts at its initial photo's index and advances through the pool.
// Keep the four initial photos at the top of the list so their first-paint
// position matches their natural ordering for resource hints.
const WORK_PHOTOS: readonly string[] = [
  PHOTO_TOP_LEFT,
  PHOTO_BOTTOM_LEFT,
  PHOTO_TOP_RIGHT,
  PHOTO_BOTTOM_RIGHT,
  '/2394664b-563a-48aa-900e-7ff62152b422.jpeg',
  '/43a0a5cf-6fea-49e8-b174-7382d6ebfa5d.jpeg',
  '/6bb20545-9b5b-43f9-b5f8-d7bbb4bcbd5b.jpeg',
  '/7108a911-e716-4416-a620-97be93f4c140.jpeg',
  '/7c810f87-294b-4352-a3f6-7b9ace4d39c3.jpeg',
  '/ae496ec7-f200-41db-9e1d-54aa3de8fccd.jpeg',
  '/b420cfaa-cec4-47a5-a363-d8bebabcef4d.jpeg',
  '/cf856cdc-a1e1-40ef-b079-eeab55418c17.jpeg',
  '/e2f858db-6d50-48ad-b286-36a67483dfe5.jpeg',
]

const ACCENT = '#F5B800'
const BEBAS_FONT_FAMILY = '"Bebas Neue", Impact, sans-serif'

// One photo cycles every 5 s. The four slots are staggered 1.25 s apart so the
// crossfades are spread evenly across the cycle — there is almost always a
// gentle transition happening somewhere on the collage, but never two at once.
const ROTATION_INTERVAL_MS = 5000
const STAGGER_MS = 1250
const CROSSFADE_DURATION_S = 0.8

type RotatingPhotoProps = {
  startSrc: string
  delayMs: number
  height: number
  alt: string
  priority?: boolean
  sizes?: string
}

function RotatingPhoto({ startSrc, delayMs, height, alt, priority, sizes }: RotatingPhotoProps) {
  const startIndex = Math.max(0, WORK_PHOTOS.indexOf(startSrc))
  const [index, setIndex] = useState(startIndex)
  const [hasRotated, setHasRotated] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    let interval: ReturnType<typeof setInterval> | null = null
    const startTimer = setTimeout(() => {
      interval = setInterval(() => {
        setIndex((i) => (i + 1) % WORK_PHOTOS.length)
        setHasRotated(true)
      }, ROTATION_INTERVAL_MS)
    }, delayMs)

    return () => {
      clearTimeout(startTimer)
      if (interval) clearInterval(interval)
    }
  }, [reducedMotion, delayMs])

  const currentSrc = WORK_PHOTOS[index]

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
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSrc}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: CROSSFADE_DURATION_S, ease: 'easeInOut' }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <Image
            src={currentSrc}
            alt={alt}
            fill
            // Collage is hidden lg:block — only renders ≥1024px. Each photo is ~half of
            // the right hero column (~270-340px depending on viewport).
            sizes={sizes ?? '(min-width: 1536px) 340px, (min-width: 1280px) 300px, (min-width: 1024px) 270px, 320px'}
            // Only the first render of the LCP slot keeps `priority` — subsequent
            // rotations are normal lazy-decoded swaps so we don't spam preload tags.
            priority={priority && !hasRotated}
            style={{ objectFit: 'cover' }}
          />
        </motion.div>
      </AnimatePresence>
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
          {/* LCP candidate (desktop): largest above-fold collage photo — keep priority */}
          <RotatingPhoto
            startSrc={PHOTO_TOP_LEFT}
            delayMs={STAGGER_MS * 0}
            height={300}
            alt="Trabajo eléctrico de MultiServicios El Seibo"
            priority
          />
          <RotatingPhoto
            startSrc={PHOTO_BOTTOM_LEFT}
            delayMs={STAGGER_MS * 1}
            height={240}
            alt="Instalación eléctrica realizada por Neno Báez"
          />
        </div>

        {/* RIGHT inner column — staggered with paddingTop 60 */}
        <div style={{ display: 'grid', gap: 12, paddingTop: 60 }}>
          <RotatingPhoto
            startSrc={PHOTO_TOP_RIGHT}
            delayMs={STAGGER_MS * 2}
            height={240}
            alt="Reparación eléctrica profesional"
          />
          <RotatingPhoto
            startSrc={PHOTO_BOTTOM_RIGHT}
            delayMs={STAGGER_MS * 3}
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
