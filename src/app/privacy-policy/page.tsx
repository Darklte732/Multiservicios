'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Shield, Database, Users, Bell, Lock } from 'lucide-react'

export default function PrivacyPolicyPage() {
  const lastUpdated = "27 de Diciembre, 2024"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <motion.header 
        className="bg-white shadow-sm border-b"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver al inicio
          </Link>
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Política de Privacidad</h1>
              <p className="text-gray-600 mt-1">Última actualización: {lastUpdated}</p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introducción</h2>
            <p className="text-gray-700 leading-relaxed">
              En MultiServicios El Seibo, valoramos su privacidad y nos comprometemos a proteger su información personal. 
              Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos su información cuando 
              utiliza nuestros servicios eléctricos y nuestra plataforma web.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <div className="flex items-center mb-4">
              <Database className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Información que Recopilamos</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Información Personal</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Nombre completo y datos de contacto (teléfono, email, dirección)</li>
                  <li>Información de facturación y pago</li>
                  <li>Historial de servicios solicitados</li>
                  <li>Preferencias de comunicación</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Información Técnica</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Dirección IP y ubicación aproximada</li>
                  <li>Tipo de dispositivo y navegador</li>
                  <li>Páginas visitadas y tiempo de permanencia</li>
                  <li>Cookies y tecnologías similares</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Información de Servicios</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Detalles de las instalaciones eléctricas</li>
                  <li>Fotografías del trabajo realizado</li>
                  <li>Evaluaciones y comentarios</li>
                  <li>Historial de citas y servicios</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Cómo Usamos su Información</h2>
            </div>
            
            <ul className="list-disc list-inside space-y-3 text-gray-700 ml-4">
              <li>Proporcionar y mejorar nuestros servicios eléctricos</li>
              <li>Procesar reservas y gestionar citas</li>
              <li>Comunicarnos sobre servicios, citas y emergencias</li>
              <li>Procesar pagos y mantener registros financieros</li>
              <li>Enviar notificaciones importantes y actualizaciones</li>
              <li>Cumplir con obligaciones legales y regulatorias</li>
              <li>Mejorar la experiencia del usuario en nuestra plataforma</li>
              <li>Prevenir fraudes y garantizar la seguridad</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Compartir Información</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              No vendemos su información personal. Podemos compartir su información en las siguientes circunstancias:
            </p>
            
            <ul className="list-disc list-inside space-y-3 text-gray-700 ml-4">
              <li><strong>Técnicos autorizados:</strong> Para coordinar y realizar servicios</li>
              <li><strong>Proveedores de servicios:</strong> Para procesamiento de pagos y comunicaciones</li>
              <li><strong>Emergencias:</strong> Cuando sea necesario para garantizar la seguridad</li>
              <li><strong>Cumplimiento legal:</strong> Cuando lo requiera la ley o autoridades</li>
              <li><strong>Consentimiento:</strong> Con su autorización explícita</li>
            </ul>
          </section>

          {/* Notifications */}
          <section>
            <div className="flex items-center mb-4">
              <Bell className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Notificaciones</h2>
            </div>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              Enviamos notificaciones para mantenerlo informado sobre:
            </p>
            
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Confirmaciones de citas y recordatorios</li>
              <li>Estado de servicios en progreso</li>
              <li>Emergencias eléctricas en su área</li>
              <li>Actualizaciones importantes del servicio</li>
              <li>Ofertas especiales (solo con su consentimiento)</li>
            </ul>
            
            <p className="text-gray-600 text-sm mt-4 bg-blue-50 p-4 rounded-lg">
              <strong>Nota:</strong> Puede gestionar sus preferencias de notificación en su panel de usuario 
              o contactándonos directamente.
            </p>
          </section>

          {/* Data Security */}
          <section>
            <div className="flex items-center mb-4">
              <Lock className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Seguridad de Datos</h2>
            </div>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              Implementamos medidas de seguridad técnicas y organizativas para proteger su información:
            </p>
            
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Cifrado SSL/TLS para transmisión de datos</li>
              <li>Acceso restringido solo a personal autorizado</li>
              <li>Monitoreo regular de sistemas de seguridad</li>
              <li>Copias de seguridad regulares y seguras</li>
              <li>Capacitación continua del personal en protección de datos</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sus Derechos</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Usted tiene derecho a:
            </p>
            
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Acceder a su información personal</li>
              <li>Rectificar datos inexactos o incompletos</li>
              <li>Solicitar la eliminación de sus datos</li>
              <li>Limitar el procesamiento de su información</li>
              <li>Retirar su consentimiento en cualquier momento</li>
              <li>Presentar una queja ante las autoridades competentes</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Retención de Datos</h2>
            <p className="text-gray-700 leading-relaxed">
              Conservamos su información personal durante el tiempo necesario para proporcionar nuestros servicios 
              y cumplir con obligaciones legales. Los datos de servicios se mantienen por 7 años para fines de 
              garantía y cumplimiento regulatorio.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies y Tecnologías Similares</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Utilizamos cookies para mejorar su experiencia. Puede gestionar las cookies a través de la 
              configuración de su navegador. Para más información, consulte nuestra 
              <Link href="/cookie-policy" className="text-blue-600 hover:underline"> Política de Cookies</Link>.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contacto</h2>
            <p className="text-gray-700 mb-4">
              Para preguntas sobre esta Política de Privacidad o para ejercer sus derechos, contáctenos:
            </p>
            
            <div className="space-y-2 text-gray-700">
              <p><strong>MultiServicios El Seibo</strong></p>
              <p>Email: privacidad@multiservicios.com</p>
              <p>Teléfono: +1 (809) 555-0123</p>
              <p>Dirección: El Seibo, República Dominicana</p>
            </div>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Actualizaciones de esta Política</h2>
            <p className="text-gray-700 leading-relaxed">
              Podemos actualizar esta Política de Privacidad ocasionalmente. Le notificaremos sobre cambios 
              significativos a través de nuestro sitio web o por email. La fecha de la última actualización 
              se indica al inicio de este documento.
            </p>
          </section>
        </motion.div>
      </main>
    </div>
  )
} 