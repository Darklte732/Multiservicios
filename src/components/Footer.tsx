'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Zap, MapPin, Phone, Mail, Facebook, Instagram, Twitter, Clock, Shield, FileText, Cookie } from 'lucide-react'

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white relative z-10">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0.8, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">MultiServicios El Seibo</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Servicios eléctricos profesionales en El Seibo, República Dominicana. 
              Más de 30 años brindando soluciones eléctricas confiables y seguras.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://facebook.com/multiservicios"
                className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com/multiservicios"
                className="p-2 bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com/multiservicios"
                className="p-2 bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0.8, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold text-blue-400">Servicios</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/booking" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  Instalaciones Eléctricas
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  Reparaciones de Emergencia
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  Mantenimiento Preventivo
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  Certificaciones Eléctricas
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  Consultoría Energética
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0.8, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-blue-400">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">
                  El Seibo, República Dominicana
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <a href="tel:+18095550123" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  +1 (809) 555-0123
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <a href="mailto:info@multiservicios.com" className="text-gray-300 hover:text-white transition-colors break-all cursor-pointer">
                  info@multiservicios.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Clock className="h-4 w-4 text-blue-400 mt-0.5" />
                <div className="text-gray-300">
                  <div>Lun - Vie: 8:00 AM - 6:00 PM</div>
                  <div>Emergencias: 24/7</div>
                </div>
              </li>
            </ul>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0.8, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold text-blue-400">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/gallery" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  Galería de Trabajos
                </Link>
              </li>
              <li>
                <Link href="/customer-dashboard" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  Panel de Cliente
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  Reservar Cita
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  Portal Técnicos
                </Link>
              </li>
              <li>
                <a href="tel:+18095550123" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  Contacto de Emergencia
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Legal Links */}
        <motion.div
          className="border-t border-gray-700 pt-8 mb-8"
          initial={{ opacity: 0.8, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 text-sm">
              <Link 
                href="/privacy-policy" 
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                <Shield className="h-4 w-4" />
                <span>Política de Privacidad</span>
              </Link>
              <Link 
                href="/terms-of-service" 
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                <FileText className="h-4 w-4" />
                <span>Términos de Servicio</span>
              </Link>
              <Link 
                href="/cookie-policy" 
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                <Cookie className="h-4 w-4" />
                <span>Política de Cookies</span>
              </Link>
            </div>
            
            {/* Trust Badges */}
            <div className="flex items-center justify-center space-x-3">
              <div className="flex items-center space-x-2 bg-green-600 px-3 py-1 rounded-full">
                <Shield className="h-4 w-4" />
                <span className="text-xs font-medium">SSL Seguro</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-600 px-3 py-1 rounded-full">
                <Zap className="h-4 w-4" />
                <span className="text-xs font-medium">Certificado</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Footer */}
        <motion.div
          className="border-t border-gray-700 pt-6"
          initial={{ opacity: 0.8, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} MultiServicios El Seibo. Todos los derechos reservados.
            </p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 text-xs text-gray-400">
              <span>Licencia Eléctrica #ES-2024-001</span>
              <span className="hidden sm:inline">•</span>
              <span>Seguros hasta $500,000</span>
              <span className="hidden sm:inline">•</span>
              <span>30+ años de experiencia</span>
            </div>
          </div>
        </motion.div>


      </div>
    </footer>
  )
} 