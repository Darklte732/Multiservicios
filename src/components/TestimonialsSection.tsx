'use client'

import { Star } from 'lucide-react'
import { motion } from 'framer-motion'

const testimonials = [
  {
    name: 'María González',
    rating: 5,
    text: 'Excelente servicio. Neno llegó puntual y resolvió el problema eléctrico en menos de 2 horas. Muy profesional y el precio fue justo.',
    service: 'Reparación de Emergencia',
    location: 'El Seibo',
  },
  {
    name: 'Carlos Rodríguez',
    rating: 5,
    text: 'Instalación perfecta de mi panel eléctrico. Trabajo limpio, explicó todo el proceso paso a paso. 100% recomendado en Hato Mayor.',
    service: 'Instalación Eléctrica',
    location: 'Hato Mayor',
  },
  {
    name: 'Ana Pérez',
    rating: 5,
    text: 'Servicio excepcional. Muy honesto con los precios y la calidad del trabajo es de primera. Lo volveré a contratar sin duda.',
    service: 'Mantenimiento Preventivo',
    location: 'Miches',
  },
]

export const TestimonialsSection = () => {
  return (
    <section className="section-primary py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="electric-badge mb-4 inline-flex">★ Reseñas Verificadas</span>
          <h2 className="text-4xl font-bold text-white mb-4">Lo que dicen nuestros clientes</h2>
          <div className="flex items-center justify-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-electric text-electric" />
              ))}
            </div>
            <span className="text-2xl font-black text-electric ml-2">4.9/5</span>
            <span className="text-gray-400 ml-1">basado en 200+ reseñas</span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="testimonial-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-electric text-electric" />
                ))}
              </div>
              <p className="text-gray-300 italic mb-5 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">{t.name}</p>
                  <p className="text-xs text-electric">{t.service}</p>
                </div>
                <span className="electric-badge-outline text-xs">{t.location}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
