'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Cookie, Settings, BarChart, Shield, Users } from 'lucide-react'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'

export default function CookiePolicyPage() {
  const lastUpdated = "27 de Diciembre, 2024"

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      {/* Header */}
      <motion.header
        className="sticky top-0 z-40 dark-nav"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link
            href="/"
            className="inline-flex items-center text-gray-400 hover:text-electric transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver al inicio
          </Link>
          <div className="flex items-center">
            <Cookie className="h-8 w-8 text-electric mr-3" />
            <div>
              <h1
                className="text-3xl font-black gradient-text-electric leading-none"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Política de Cookies
              </h1>
              <p className="text-gray-500 mt-1 text-sm">Última actualización: {lastUpdated}</p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          className="dark-card p-8 space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">¿Qué son las Cookies?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita
              nuestro sitio web. Nos ayudan a mejorar su experiencia, recordar sus preferencias y proporcionar
              funcionalidades personalizadas.
            </p>

            <p className="text-gray-300 leading-relaxed">
              En MultiServicios El Seibo, utilizamos cookies de manera responsable y transparente para
              brindarle el mejor servicio posible mientras respetamos su privacidad.
            </p>
          </section>

          {/* Types of Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Tipos de Cookies que Utilizamos</h2>

            <div className="grid gap-6">
              {/* Essential Cookies */}
              <div className="border border-white/10 bg-navy-800 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Shield className="h-6 w-6 text-green-400 mr-3" />
                  <h3 className="text-xl font-semibold text-white">Cookies Esenciales</h3>
                  <span className="ml-auto bg-green-900/50 border border-green-500/30 text-green-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Necesarias
                  </span>
                </div>

                <p className="text-gray-300 mb-4">
                  Estas cookies son fundamentales para el funcionamiento del sitio web y no pueden ser desactivadas.
                </p>

                <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm">
                  <li>Gestión de sesiones de usuario</li>
                  <li>Autenticación y seguridad</li>
                  <li>Funcionamiento del carrito de servicios</li>
                  <li>Recordar preferencias de idioma</li>
                  <li>Prevención de fraudes</li>
                </ul>
              </div>

              {/* Functional Cookies */}
              <div className="border border-white/10 bg-navy-800 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Settings className="h-6 w-6 text-electric mr-3" />
                  <h3 className="text-xl font-semibold text-white">Cookies Funcionales</h3>
                  <span className="ml-auto bg-electric/10 border border-electric/30 text-electric text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Opcionales
                  </span>
                </div>

                <p className="text-gray-300 mb-4">
                  Mejoran la funcionalidad del sitio web y personalizan su experiencia.
                </p>

                <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm">
                  <li>Recordar preferencias de notificaciones</li>
                  <li>Configuraciones de accesibilidad</li>
                  <li>Preferencias de ubicación para servicios</li>
                  <li>Historial de servicios favoritos</li>
                  <li>Configuración de la interfaz de usuario</li>
                </ul>
              </div>

              {/* Analytics Cookies */}
              <div className="border border-white/10 bg-navy-800 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <BarChart className="h-6 w-6 text-purple-400 mr-3" />
                  <h3 className="text-xl font-semibold text-white">Cookies de Análisis</h3>
                  <span className="ml-auto bg-purple-900/50 border border-purple-500/30 text-purple-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Opcionales
                  </span>
                </div>

                <p className="text-gray-300 mb-4">
                  Nos ayudan a entender cómo los usuarios interactúan con nuestro sitio web.
                </p>

                <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm">
                  <li>Estadísticas de uso del sitio web</li>
                  <li>Páginas más visitadas</li>
                  <li>Tiempo de permanencia en el sitio</li>
                  <li>Identificación de errores técnicos</li>
                  <li>Optimización del rendimiento</li>
                </ul>
              </div>

              {/* Marketing Cookies */}
              <div className="border border-white/10 bg-navy-800 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Users className="h-6 w-6 text-orange-400 mr-3" />
                  <h3 className="text-xl font-semibold text-white">Cookies de Marketing</h3>
                  <span className="ml-auto bg-orange-900/50 border border-orange-500/30 text-orange-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Opcionales
                  </span>
                </div>

                <p className="text-gray-300 mb-4">
                  Utilizadas para mostrar contenido y ofertas relevantes basadas en sus intereses.
                </p>

                <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm">
                  <li>Personalización de ofertas de servicios</li>
                  <li>Seguimiento de campañas publicitarias</li>
                  <li>Contenido personalizado en redes sociales</li>
                  <li>Medición de efectividad de marketing</li>
                  <li>Remarketing para servicios de interés</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Third Party Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Cookies de Terceros</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Algunos de nuestros socios de confianza también pueden establecer cookies en su dispositivo:
            </p>

            <div className="bg-navy-800 border border-white/10 p-6 rounded-lg">
              <div className="grid gap-4">
                <div>
                  <h4 className="font-semibold text-electric mb-2">Google Analytics</h4>
                  <p className="text-gray-400 text-sm">
                    Para análisis de tráfico web y comportamiento de usuarios.{' '}
                    <a
                      href="https://policies.google.com/privacy"
                      className="text-electric hover:text-electric-bright underline transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Política de privacidad de Google
                    </a>
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-electric mb-2">ElevenLabs</h4>
                  <p className="text-gray-400 text-sm">
                    Para el widget de inteligencia artificial conversacional (Ana).{' '}
                    <a
                      href="https://elevenlabs.io/privacy"
                      className="text-electric hover:text-electric-bright underline transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Política de privacidad de ElevenLabs
                    </a>
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-electric mb-2">Supabase</h4>
                  <p className="text-gray-400 text-sm">
                    Para autenticación, gestión de cuentas y almacenamiento seguro de datos.{' '}
                    <a
                      href="https://supabase.com/privacy"
                      className="text-electric hover:text-electric-bright underline transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Política de privacidad de Supabase
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Cookie Management */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Gestión de Cookies</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-electric mb-3">Control en su navegador</h3>
                <p className="text-gray-300 mb-4">
                  Puede controlar las cookies directamente desde la configuración de su navegador:
                </p>

                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between items-center p-3 bg-navy-800 border border-white/5 rounded-lg">
                    <span className="font-medium text-white">Chrome</span>
                    <span className="text-gray-400">Configuración → Privacidad y seguridad → Cookies</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-navy-800 border border-white/5 rounded-lg">
                    <span className="font-medium text-white">Firefox</span>
                    <span className="text-gray-400">Opciones → Privacidad y seguridad</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-navy-800 border border-white/5 rounded-lg">
                    <span className="font-medium text-white">Safari</span>
                    <span className="text-gray-400">Preferencias → Privacidad</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-navy-800 border border-white/5 rounded-lg">
                    <span className="font-medium text-white">Edge</span>
                    <span className="text-gray-400">Configuración → Privacidad, búsqueda y servicios</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Cookie Retention */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Duración de las Cookies</h2>

            <div className="space-y-4">
              <div className="border-l-4 border-electric pl-4">
                <h4 className="font-semibold text-white mb-1">Cookies de Sesión</h4>
                <p className="text-gray-400 text-sm">
                  Se eliminan automáticamente cuando cierra su navegador
                </p>
              </div>

              <div className="border-l-4 border-green-400 pl-4">
                <h4 className="font-semibold text-white mb-1">Cookies Persistentes</h4>
                <p className="text-gray-400 text-sm">
                  Permanecen en su dispositivo por un período específico (máximo 2 años)
                </p>
              </div>

              <div className="border-l-4 border-purple-400 pl-4">
                <h4 className="font-semibold text-white mb-1">Cookies de Preferencias</h4>
                <p className="text-gray-400 text-sm">
                  Se mantienen hasta que las elimine manualmente o cambien las preferencias
                </p>
              </div>
            </div>
          </section>

          {/* Impact of Disabling Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Impacto de Desactivar Cookies</h2>

            <div className="bg-amber-900/30 border border-amber-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-amber-300 mb-3">Tenga en cuenta:</h3>
              <ul className="list-disc list-inside space-y-2 text-amber-200">
                <li>Algunas funcionalidades del sitio web pueden no funcionar correctamente</li>
                <li>Es posible que tenga que iniciar sesión repetidamente</li>
                <li>Sus preferencias no se recordarán entre visitas</li>
                <li>La experiencia de usuario puede verse reducida</li>
                <li>Algunas características personalizadas no estarán disponibles</li>
              </ul>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Sus Derechos</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Bajo las leyes de protección de datos aplicables, usted tiene derecho a:
            </p>

            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Ser informado sobre el uso de cookies</li>
              <li>Dar o retirar su consentimiento para cookies no esenciales</li>
              <li>Acceder a información sobre las cookies que almacenamos</li>
              <li>Solicitar la eliminación de cookies</li>
              <li>Presentar una queja ante las autoridades de protección de datos</li>
            </ul>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Actualizaciones de esta Política</h2>
            <p className="text-gray-300 leading-relaxed">
              Podemos actualizar esta Política de Cookies ocasionalmente para reflejar cambios en nuestro
              uso de cookies o por otros motivos operativos, legales o regulatorios. Le notificaremos
              sobre cambios significativos a través de nuestro sitio web.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-navy-800 border border-electric/20 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Contacto</h2>
            <p className="text-gray-300 mb-4">
              Si tiene preguntas sobre esta Política de Cookies o sobre nuestro uso de cookies, contáctenos:
            </p>

            <div className="space-y-2 text-gray-300">
              <p><strong className="text-electric">MultiServicios El Seibo</strong></p>
              <p>Email: <a href="mailto:cookies@multiservicios.app" className="text-electric hover:text-electric-bright transition-colors">cookies@multiservicios.app</a></p>
              <p>Teléfono: <a href="tel:+18092514329" className="text-electric hover:text-electric-bright transition-colors">+1 (809) 251-4329</a></p>
              <p>Dirección: El Seibo, República Dominicana</p>
            </div>
          </section>
        </motion.div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
