'use client';

import React from 'react';

type Testimonial = {
  name: string;
  loc: string;
  stars: number;
  q: string;
  date: string;
  col: string;
};

const testimonials: Testimonial[] = [
  {
    name: 'Rosa M.',
    loc: 'Comercio en Santa Cruz',
    stars: 5,
    q: 'Llamé a las 9pm porque mi panel echó chispas. Llegaron en 25 minutos, lo dejaron seguro esa misma noche y la garantía cubrió todo. Los recomiendo 100%.',
    date: 'Hace 3 días',
    col: '#d97757',
  },
  {
    name: 'Juan P.',
    loc: 'Casa familiar, El Seibo',
    stars: 5,
    q: 'Necesitaba cambiar todo el cableado de mi casa. Me dieron precio claro desde el primer día, sin sorpresas al final. Trabajo limpio y rápido.',
    date: 'Hace 1 semana',
    col: '#5a8dee',
  },
  {
    name: 'Carmen L.',
    loc: 'Colmado en Miches',
    stars: 5,
    q: 'Mantenimiento mensual de mi colmado por 2 años. Nunca un problema. Siempre puntuales, profesionales y con uniforme.',
    date: 'Hace 2 semanas',
    col: '#22c55e',
  },
  {
    name: 'Pedro R.',
    loc: 'Hato Mayor',
    stars: 5,
    q: 'Instalaron 6 abanicos de techo y un panel nuevo en un día. Excelente atención, todo funciona perfecto. Garantía clara y por escrito.',
    date: 'Hace 3 semanas',
    col: '#a855f7',
  },
];

export function TestimonialsRedesign() {
  return (
    <section>
      {/* DESKTOP */}
      <div className="hidden lg:block">
        <div className="py-24 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.5fr_2fr] lg:gap-16 items-start">
            {/* LEFT */}
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: '#F5B800',
                  fontWeight: 800,
                  letterSpacing: '0.2em',
                  fontFamily: 'var(--font-sub)',
                }}
              >
                CLIENTES
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  margin: '8px 0 16px',
                  letterSpacing: '-1.2px',
                  lineHeight: 1,
                  fontWeight: 400,
                }}
              >
                LO QUE DICE EL SEIBO
              </h2>
              <p style={{ fontSize: 14, color: '#8a8a92', lineHeight: 1.5 }}>
                200+ reseñas verificadas en Google, Facebook y nuestra plataforma. Cada cliente puede dejar comentario después del trabajo.
              </p>
              <div style={{ marginTop: 24, display: 'flex', gap: 8, alignItems: 'center' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 56,
                    color: '#F5B800',
                    lineHeight: 1,
                    fontWeight: 400,
                  }}
                >
                  4.9
                </div>
                <div>
                  <div style={{ fontSize: 18, color: '#eab308' }}>★★★★★</div>
                  <div style={{ fontSize: 12, color: '#8a8a92', fontWeight: 600 }}>
                    Promedio en 200+ reseñas
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 18,
                    padding: 22,
                  }}
                >
                  <div style={{ fontSize: 14, color: '#eab308', marginBottom: 10 }}>
                    {'★'.repeat(t.stars)}
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.55, color: '#cfcfd6', margin: 0 }}>
                    &quot;{t.q}&quot;
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      marginTop: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 100,
                        background: t.col,
                        display: 'grid',
                        placeItems: 'center',
                        fontWeight: 800,
                        color: '#fff',
                      }}
                    >
                      {t.name[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: '#8a8a92' }}>{t.loc}</div>
                    </div>
                    <div style={{ fontSize: 10, color: '#5a5a62' }}>{t.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="block lg:hidden">
        <div className="py-16 px-4">
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(245,184,0,0.08), transparent)',
              border: '1px solid rgba(245,184,0,0.20)',
              borderRadius: 20,
              padding: 18,
            }}
          >
            <div style={{ fontSize: 14, color: '#F5B800', marginBottom: 6 }}>★★★★★</div>
            <p style={{ fontSize: 15, lineHeight: 1.5, color: '#fff', margin: 0 }}>
              &quot;Llamé a las 9pm porque mi panel echó chispas. Llegaron en 25 minutos, lo dejaron seguro esa misma noche y la garantía cubrió todo. Los recomiendo 100%.&quot;
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginTop: 14,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 100,
                  background: 'linear-gradient(135deg, #d97757, #b85a3d)',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 800,
                  color: '#fff',
                }}
              >
                R
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Rosa M.</div>
                <div style={{ fontSize: 11, color: '#8a8a92' }}>
                  Comercio en Santa Cruz · Cliente verificada
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsRedesign;
