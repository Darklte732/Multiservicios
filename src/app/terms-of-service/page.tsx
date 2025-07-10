'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, FileText, AlertTriangle, Zap, Shield, CreditCard } from 'lucide-react'

export default function TermsOfServicePage() {
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
            <FileText className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Términos de Servicio</h1>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Aceptación de Términos</h2>
            <p className="text-gray-700 leading-relaxed">
              Al acceder y utilizar los servicios de MultiServicios El Seibo, usted acepta estar legalmente 
              obligado por estos Términos de Servicio. Si no está de acuerdo con alguno de estos términos, 
              no debe utilizar nuestros servicios.
            </p>
          </section>

          {/* Services Description */}
          <section>
            <div className="flex items-center mb-4">
              <Zap className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Descripción de Servicios</h2>
            </div>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              MultiServicios El Seibo proporciona servicios eléctricos profesionales que incluyen:
            </p>
            
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Instalaciones eléctricas residenciales y comerciales</li>
              <li>Reparaciones y mantenimiento eléctrico</li>
              <li>Servicios de emergencia 24/7</li>
              <li>Inspecciones y certificaciones eléctricas</li>
              <li>Consultoría en eficiencia energética</li>
              <li>Instalación de sistemas de iluminación</li>
            </ul>
          </section>

          {/* User Responsibilities */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Responsabilidades del Usuario</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Información Precisa</h3>
                <p className="text-gray-700">
                  Debe proporcionar información precisa y actualizada sobre su identidad, ubicación 
                  y necesidades del servicio.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Acceso a la Propiedad</h3>
                <p className="text-gray-700">
                  Debe garantizar acceso seguro y adecuado a las áreas donde se realizará el trabajo eléctrico.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Cumplimiento Legal</h3>
                <p className="text-gray-700">
                  Debe cumplir con todas las leyes y regulaciones locales aplicables a los servicios solicitados.
                </p>
              </div>
            </div>
          </section>

          {/* Service Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Términos del Servicio</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Reservas y Citas</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Las citas deben reservarse con al menos 24 horas de anticipación</li>
                  <li>Los servicios de emergencia están sujetos a tarifas adicionales</li>
                  <li>Las cancelaciones deben realizarse con 4 horas de anticipación mínima</li>
                  <li>Se aplicará una tarifa de cancelación tardía según nuestras políticas</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Calidad del Trabajo</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Todos los trabajos se realizan según estándares profesionales</li>
                  <li>Utilizamos materiales de calidad certificada</li>
                  <li>Proporcionamos garantías según el tipo de servicio</li>
                  <li>Cumplimos con códigos eléctricos nacionales e internacionales</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Garantías</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Garantía de 12 meses en instalaciones nuevas</li>
                  <li>Garantía de 6 meses en reparaciones</li>
                  <li>Garantía de 90 días en servicios de mantenimiento</li>
                  <li>Las garantías no cubren daños por mal uso o factores externos</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Pricing and Payment */}
          <section>
            <div className="flex items-center mb-4">
              <CreditCard className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Precios y Pagos</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Precios</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Los precios se proporcionan como cotizaciones estimadas</li>
                  <li>Los precios finales pueden variar según el trabajo realizado</li>
                  <li>Se aplicarán tarifas adicionales por servicios fuera del horario normal</li>
                  <li>Los materiales se cobran por separado a menos que se especifique</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Términos de Pago</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Se requiere pago al completar el servicio</li>
                  <li>Aceptamos efectivo, tarjetas de crédito y transferencias</li>
                  <li>Para proyectos grandes, se puede requerir un depósito del 50%</li>
                  <li>Los pagos atrasados están sujetos a recargos por intereses</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Liability and Insurance */}
          <section>
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Responsabilidad y Seguros</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Cobertura de Seguro</h3>
                <p className="text-gray-700 mb-3">
                  MultiServicios El Seibo mantiene seguros de responsabilidad civil y profesional que cubren:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Daños a la propiedad durante el trabajo</li>
                  <li>Lesiones accidentales relacionadas con nuestros servicios</li>
                  <li>Errores y omisiones profesionales</li>
                  <li>Cobertura de hasta $500,000 USD por incidente</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Limitaciones de Responsabilidad</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>No somos responsables por daños preexistentes</li>
                  <li>La responsabilidad está limitada al costo del servicio prestado</li>
                  <li>No cubrimos daños por desastres naturales o actos de terceros</li>
                  <li>El cliente debe notificar problemas dentro de 48 horas</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Safety Requirements */}
          <section>
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-orange-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Requisitos de Seguridad</h2>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-4">
              <h3 className="text-lg font-semibold text-orange-800 mb-3">Advertencias Importantes</h3>
              <ul className="list-disc list-inside space-y-2 text-orange-700">
                <li>Los servicios eléctricos deben ser realizados solo por profesionales certificados</li>
                <li>No intente reparaciones eléctricas por su cuenta</li>
                <li>Informe inmediatamente cualquier problema de seguridad eléctrica</li>
                <li>Mantenga el área de trabajo libre de obstrucciones</li>
              </ul>
            </div>

            <p className="text-gray-700">
              Todos nuestros técnicos están certificados y siguen protocolos estrictos de seguridad. 
              Sin embargo, el cliente debe cooperar para mantener un ambiente de trabajo seguro.
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Propiedad Intelectual</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Todo el contenido de nuestro sitio web, incluyendo diseños, logotipos, texto e imágenes, 
              está protegido por derechos de autor y otras leyes de propiedad intelectual.
            </p>
            
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>No puede reproducir nuestro contenido sin autorización</li>
              <li>Los documentos técnicos y planos siguen siendo nuestra propiedad</li>
              <li>Puede usar nuestros materiales solo para fines relacionados con nuestros servicios</li>
            </ul>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Terminación de Servicios</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Nos reservamos el derecho de terminar o suspender servicios en las siguientes circunstancias:
            </p>
            
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Violación de estos términos de servicio</li>
              <li>Comportamiento inapropiado hacia nuestro personal</li>
              <li>Falta de pago por servicios previos</li>
              <li>Condiciones de trabajo inseguras o ilegales</li>
              <li>Información falsa o engañosa proporcionada</li>
            </ul>
          </section>

          {/* Dispute Resolution */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Resolución de Disputas</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                En caso de disputas, seguimos este proceso de resolución:
              </p>
              
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                <li>Comunicación directa para resolver el problema</li>
                <li>Mediación a través de un tercero neutral si es necesario</li>
                <li>Arbitraje vinculante si la mediación falla</li>
                <li>Jurisdicción en los tribunales de El Seibo, República Dominicana</li>
              </ol>
            </div>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ley Aplicable</h2>
            <p className="text-gray-700 leading-relaxed">
              Estos términos se rigen por las leyes de la República Dominicana. Cualquier disputa 
              legal se resolverá en los tribunales competentes de El Seibo, República Dominicana.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contacto</h2>
            <p className="text-gray-700 mb-4">
              Para preguntas sobre estos Términos de Servicio, contáctenos:
            </p>
            
            <div className="space-y-2 text-gray-700">
              <p><strong>MultiServicios El Seibo</strong></p>
              <p>Email: legal@multiservicios.com</p>
              <p>Teléfono: +1 (809) 555-0123</p>
              <p>Dirección: El Seibo, República Dominicana</p>
              <p>Horario de atención: Lunes a Viernes, 8:00 AM - 6:00 PM</p>
            </div>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Modificaciones</h2>
            <p className="text-gray-700 leading-relaxed">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. 
              Los cambios entrarán en vigor inmediatamente después de su publicación en nuestro sitio web. 
              Su uso continuado de nuestros servicios constituye aceptación de los términos modificados.
            </p>
          </section>
        </motion.div>
      </main>
    </div>
  )
} 