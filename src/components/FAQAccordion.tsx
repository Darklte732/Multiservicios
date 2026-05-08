'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: '¿La evaluación inicial es gratuita?',
    a: 'Sí, ofrecemos una evaluación técnica inicial sin costo. Si decides contratar el servicio completo, el costo de evaluación se descuenta del total. Sin compromiso.'
  },
  {
    q: '¿Atienden emergencias de noche y fines de semana?',
    a: 'Absolutamente. Contamos con servicio de emergencias 24 horas al día, 7 días a la semana, incluyendo feriados. Llama al +1 (809) 251-4329 para atención inmediata.'
  },
  {
    q: '¿Qué zonas o municipios cubren?',
    a: 'Cubrimos El Seibo y un radio de 60 km a la redonda, incluyendo Miches, Hato Mayor, Los Llanos, Sabana de la Mar y Bayaguana. ¿No ves tu municipio? Contáctanos y verificamos cobertura.'
  },
  {
    q: '¿Los trabajos tienen garantía?',
    a: 'Sí. Todos nuestros servicios incluyen garantía de 30 días sobre mano de obra. Si algo no funciona correctamente, regresamos sin costo adicional.'
  },
  {
    q: '¿Están asegurados y certificados?',
    a: 'Sí. Somos técnicos licenciados por la CDEEE y contamos con póliza de seguro de responsabilidad civil por hasta RD$500,000. Trabajas con total protección legal.'
  },
  {
    q: '¿Cómo reservo una cita?',
    a: 'Puedes reservar en línea directamente desde nuestra página web en menos de 2 minutos usando el calendario Calendly, o contactarnos por WhatsApp al +1 (809) 251-4329. Recibirás confirmación inmediata.'
  },
]

export const FAQAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="space-y-3 max-w-3xl mx-auto">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="dark-card overflow-hidden"
        >
          <button
            className="w-full flex items-center justify-between p-5 text-left"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <span className="font-semibold text-white pr-4">{faq.q}</span>
            <motion.div
              animate={{ rotate: openIndex === i ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0"
            >
              <ChevronDown className="h-5 w-5 text-electric" />
            </motion.div>
          </button>
          <AnimatePresence>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                  {faq.a}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
