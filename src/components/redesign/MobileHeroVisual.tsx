'use client'

import Image from 'next/image'
import Link from 'next/link'

const HERO_PHONE = '/41a4fd06-d34c-42a6-b234-46fa1debd1df.jpeg'

/**
 * Mobile-only hero strip: real job photo + compact trust chips (desktop uses HeroCollage).
 */
export function MobileHeroVisual() {
  return (
    <div className="md:hidden mt-6 -mx-4 sm:-mx-6">
      <div className="relative mx-4 sm:mx-6 rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
        <div className="relative aspect-[16/10] w-full">
          {/* LCP candidate (mobile): above-fold hero image — keep priority */}
          <Image
            src={HERO_PHONE}
            alt="Trabajo eléctrico profesional — MultiServicios El Seibo"
            fill
            className="object-cover"
            sizes="(max-width: 767px) calc(100vw - 32px), 100vw"
            priority
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1.5 text-[11px] font-extrabold text-[#0A0A0B] shadow-lg"
                style={{ fontFamily: 'var(--font-sub)', letterSpacing: '0.04em' }}
              >
                <span className="text-[#ca8a04]">★★★★★</span> 4.9
              </span>
              <span
                className="inline-flex items-center rounded-lg px-2.5 py-1.5 text-[11px] font-extrabold text-black shadow-lg"
                style={{ background: '#F5B800', fontFamily: 'var(--font-sub)', letterSpacing: '0.06em' }}
              >
                1,000+ TRABAJOS
              </span>
            </div>
            <Link
              href="/gallery"
              className="text-[11px] font-extrabold text-white/95 underline-offset-2 hover:underline"
              style={{ fontFamily: 'var(--font-sub)', letterSpacing: '0.08em' }}
            >
              VER GALERÍA →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
