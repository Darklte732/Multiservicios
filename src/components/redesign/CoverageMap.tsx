'use client';

import React from 'react';

type Point = {
  lon: number;
  lat: number;
  name: string;
  main?: boolean;
};

const ALL_POINTS: Point[] = [
  { lon: -69.0421, lat: 18.7641, name: 'El Seibo · Base', main: true },
  { lon: -69.0397, lat: 18.9886, name: 'Miches' },
  { lon: -68.7079, lat: 18.6156, name: 'Higüey' },
  { lon: -69.2575, lat: 18.7625, name: 'Hato Mayor' },
  { lon: -69.3056, lat: 18.4539, name: 'San Pedro' },
  { lon: -69.3819, lat: 19.0606, name: 'Sabana de la Mar' },
];

const MOBILE_POINTS: Point[] = ALL_POINTS.slice(0, 4);

const CITIES = [
  'El Seibo',
  'Miches',
  'Higüey',
  'Hato Mayor',
  'Sabana de la Mar',
  'San Pedro de Macorís',
];

const ACCENT = '#F5B800';

function project(p: Point): { x: number; y: number } {
  const x = ((p.lon - -69.6) / 1.1) * 100;
  const y = (1 - (p.lat - 18.35) / 0.8) * 100;
  return { x, y };
}

function Marker({ p, mobile = false }: { p: Point; mobile?: boolean }) {
  const { x, y } = project(p);
  const dotSize = mobile ? (p.main ? 14 : 8) : p.main ? 18 : 10;
  const labelTop = mobile ? 16 : p.main ? 24 : 16;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: 999,
          background: p.main ? ACCENT : '#fff',
          boxShadow: p.main
            ? '0 0 0 8px rgba(245,184,0,0.33), 0 0 0 18px rgba(245,184,0,0.13), 0 2px 8px rgba(0,0,0,0.6)'
            : '0 2px 6px rgba(0,0,0,0.6)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: labelTop,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 11,
          fontWeight: 700,
          color: p.main ? ACCENT : '#fff',
          whiteSpace: 'nowrap',
          textShadow: '0 1px 4px rgba(0,0,0,0.9)',
        }}
      >
        {p.name}
      </div>
    </div>
  );
}

export function CoverageMap({ id }: { id?: string }) {
  return (
    <section id={id} className="py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-16 items-center">
          {/* LEFT */}
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.2em',
                color: ACCENT,
                fontFamily: 'var(--font-sub)',
              }}
            >
              COBERTURA
            </div>
            <h2
              style={{
                fontFamily: '"Bebas Neue", Impact, sans-serif',
                fontSize: 64,
                fontWeight: 400,
                lineHeight: 1,
                letterSpacing: '-1.2px',
                margin: '8px 0 16px',
              }}
            >
              SERVIMOS TODA LA<br />PROVINCIA Y MÁS
            </h2>
            <p style={{ fontSize: 15, color: '#cfcfd6', lineHeight: 1.55 }}>
              Base en El Seibo, atendemos toda la región Este de la República Dominicana. Tiempo de llegada promedio: 60 minutos.
            </p>
            <div
              className="hidden lg:grid"
              style={{
                gridTemplateColumns: '1fr 1fr',
                gap: 8,
                marginTop: 20,
              }}
            >
              {CITIES.map((c, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 14,
                    color: '#cfcfd6',
                  }}
                >
                  <span style={{ color: ACCENT }}>📍</span> {c}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — OSM iframe (per design handoff §2 item 8).
              aspect-[11/8] matches the bbox lon/lat range (1.1 / 0.8 = 1.375)
              so OSM renders edge-to-edge and our percent-based marker projection
              lands correctly. CSP allows openstreetmap.org via next.config.ts. */}
          <div
            className="relative aspect-[11/8] w-full overflow-hidden"
            style={{
              borderRadius: 20,
              border: '1px solid rgba(255,255,255,0.08)',
              background: '#0e0e12',
            }}
          >
            {/* IMPORTANT: pointerEvents:none locks the map so the user can't
                pan/zoom. If the user could pan, our percent-based marker
                projection would drift relative to the actual rendered tiles
                (markers would visually land on the wrong cities). The map is
                a marketing illustration, not an interactive tool — the iframe
                is purely a backdrop for the overlay markers. */}
            <iframe
              title="Cobertura"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-69.6%2C18.35%2C-68.5%2C19.15&layer=mapnik"
              loading="lazy"
              tabIndex={-1}
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                border: 0,
                pointerEvents: 'none',
                filter:
                  'invert(0.92) hue-rotate(180deg) saturate(0.7) brightness(0.95) contrast(0.95)',
              }}
            />

            {/* Desktop markers (full set) */}
            <div className="hidden lg:block absolute inset-0 pointer-events-none">
              {ALL_POINTS.map((p, i) => (
                <Marker key={i} p={p} />
              ))}
            </div>

            {/* Mobile markers (reduced set) */}
            <div className="block lg:hidden absolute inset-0 pointer-events-none">
              {MOBILE_POINTS.map((p, i) => (
                <Marker key={i} p={p} mobile />
              ))}
            </div>

            {/* Glass info card — desktop only */}
            <div
              className="hidden lg:block"
              style={{
                position: 'absolute',
                top: 16,
                left: 16,
                background: 'rgba(15,15,17,0.85)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                padding: '8px 12px',
                fontSize: 11,
                color: '#cfcfd6',
              }}
            >
              <div style={{ fontWeight: 800, color: ACCENT }}>
                ● 3 técnicos en ruta
              </div>
              <div style={{ marginTop: 2, fontSize: 10, color: '#8a8a92' }}>
                Próxima disponibilidad: 12 min
              </div>
            </div>

            {/* Attribution — desktop only */}
            <div
              className="hidden lg:block"
              style={{
                position: 'absolute',
                bottom: 8,
                right: 12,
                fontSize: 9,
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              © OpenStreetMap
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CoverageMap;
