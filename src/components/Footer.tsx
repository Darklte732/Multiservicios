'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Zap, MapPin, Phone, Mail, Facebook, Instagram, Twitter, Clock, Shield, FileText, Cookie } from 'lucide-react'

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-navy-800 to-navy-950 text-white relative z-10 border-t border-white/10">
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
              <div className="p-2 bg-navy-700 rounded-lg shadow-glow-sm">
                <Zap className="h-6 w-6 text-electric" />
              </div>
              <h3 className="text-xl font-bold">MultiServicios El Seibo</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Servicios eléctricos profesionales en El Seibo, República Dominicana.
              Más de 15 años brindando soluciones eléctricas confiables y seguras.
            </p>
            {/* Emergency phone */}
            <div className="p-3 bg-red-900/30 border border-red-500/30 rounded-lg">
              <p className="text-xs text-red-400 font-semibold uppercase tracking-wide mb-1">Emergencias 24/7</p>
              <a href="tel:+18092514329" className="text-electric font-bold text-lg hover:text-electric-bright transition-colors">
                +1 (809) 251-4329
              </a>
            </div>
            <div className="flex space-x-3">
              <a
                href="https://facebook.com/multiservicios"
                className="p-2 bg-navy-700 hover:bg-electric hover:text-navy-950 rounded-lg transition-all flex-shrink-0 cursor-pointer text-gray-400"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com/multiservicios"
                className="p-2 bg-navy-700 hover:bg-electric hover:text-navy-950 rounded-lg transition-all flex-shrink-0 cursor-pointer text-gray-400"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com/multiservicios"
                className="p-2 bg-navy-700 hover:bg-electric hover:text-navy-950 rounded-lg transition-all flex-shrink-0 cursor-pointer text-gray-400"
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
            <h4 className="text-lg font-semibold text-electric">Servicios</h4>
            <ul className="space-y-2 text-sm">
              {[
                'Instalaciones Eléctricas',
                'Reparaciones de Emergencia',
                'Mantenimiento Preventivo',
                'Certificaciones Eléctricas',
                'Consultoría Energética',
              ].map((service) => (
                <li key={service}>
                  <Link href="/booking" className="text-gray-400 hover:text-electric transition-colors cursor-pointer flex items-center gap-2">
                    <span className="text-electric/50">›</span>
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0.8, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-electric">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-electric mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">
                  El Seibo, República Dominicana
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-electric flex-shrink-0" />
                <a href="tel:+18092514329" className="text-gray-400 hover:text-electric transition-colors cursor-pointer">
                  +1 (809) 251-4329
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-electric flex-shrink-0" />
                <a href="mailto:info@multiservicios.app" className="text-gray-400 hover:text-electric transition-colors break-all cursor-pointer">
                  info@multiservicios.app
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Clock className="h-4 w-4 text-electric mt-0.5" />
                <div className="text-gray-400">
                  <div>Lun - Vie: 8:00 AM - 6:00 PM</div>
                  <div className="text-electric font-semibold">Emergencias: 24/7</div>
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
            <h4 className="text-lg font-semibold text-electric">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/gallery', label: 'Galería de Trabajos' },
                { href: '/booking', label: 'Reservar Cita' },
                { href: '/customer-dashboard', label: 'Panel de Cliente' },
                { href: '/dashboard', label: 'Portal Técnicos' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-electric transition-colors cursor-pointer flex items-center gap-2">
                    <span className="text-electric/50">›</span>
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href="tel:+18092514329" className="text-gray-400 hover:text-electric transition-colors cursor-pointer flex items-center gap-2">
                  <span className="text-red-400/70">›</span>
                  Contacto de Emergencia
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Legal Links */}
        <motion.div
          className="border-t border-white/10 pt-8 mb-8"
          initial={{ opacity: 0.8, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 text-sm">
              <Link
                href="/privacy-policy"
                className="flex items-center space-x-2 text-gray-400 hover:text-electric transition-colors cursor-pointer"
              >
                <Shield className="h-4 w-4" />
                <span>Política de Privacidad</span>
              </Link>
              <Link
                href="/terms-of-service"
                className="flex items-center space-x-2 text-gray-400 hover:text-electric transition-colors cursor-pointer"
              >
                <FileText className="h-4 w-4" />
                <span>Términos de Servicio</span>
              </Link>
              <Link
                href="/cookie-policy"
                className="flex items-center space-x-2 text-gray-400 hover:text-electric transition-colors cursor-pointer"
              >
                <Cookie className="h-4 w-4" />
                <span>Política de Cookies</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center space-x-3">
              <div className="flex items-center space-x-2 bg-green-900/40 border border-green-500/30 px-3 py-1 rounded-full">
                <Shield className="h-4 w-4 text-green-400" />
                <span className="text-xs font-medium text-green-400">SSL Seguro</span>
              </div>
              <div className="flex items-center space-x-2 bg-navy-700 border border-electric/30 px-3 py-1 rounded-full">
                <Zap className="h-4 w-4 text-electric" />
                <span className="text-xs font-medium text-electric">Certificado CDEEE</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Footer */}
        <motion.div
          className="border-t border-white/10 pt-6"
          initial={{ opacity: 0.8, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {currentYear} MultiServicios El Seibo. Todos los derechos reservados.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 text-xs text-gray-500">
              <span>Licencia Eléctrica #ES-2024-001</span>
              <span className="hidden sm:inline">•</span>
              <span>Seguros hasta RD$500,000</span>
              <span className="hidden sm:inline">•</span>
              <span>15+ años de experiencia</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
