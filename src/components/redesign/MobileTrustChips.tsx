'use client'

const BADGES = ['CDEEE', 'PRO-CONSUMIDOR', 'CÁMARA DE COMERCIO', 'SEGUROS UNIVERSAL'] as const

/** Compact horizontal trust row for small screens (mirrors desktop authority badges). */
export function MobileTrustChips() {
  return (
    <div className="lg:hidden mt-4 -mx-1">
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 px-1">
        {BADGES.map((label) => (
          <span
            key={label}
            className="authority-badge flex-shrink-0"
            style={{ fontFamily: 'var(--font-sub)' }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
