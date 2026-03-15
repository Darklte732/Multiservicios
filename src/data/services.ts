export type ServiceStatus = 'active' | 'coming_soon'

export interface Service {
  id: string
  name: string
  description: string
  shortDesc: string
  icon: string
  status: ServiceStatus
  fee?: string
  featured?: boolean
  emergencyCard?: boolean
}

export const services: Service[] = [
  {
    id: 'emergencia',
    name: 'Emergencia Eléctrica',
    description: 'Atención inmediata 24/7 para apagones, cortocircuitos y fallas críticas. Llegamos en menos de 30 minutos.',
    shortDesc: 'Atención inmediata 24/7',
    icon: '🚨',
    status: 'active',
    fee: '4,000 - 8,000',
    featured: true,
    emergencyCard: true,
  },
  {
    id: 'instalacion',
    name: 'Instalación Eléctrica',
    description: 'Instalaciones eléctricas para hogares y negocios. Paneles, tomacorrientes, luminarias y cableado completo.',
    shortDesc: 'Instalaciones nuevas y conexiones',
    icon: '🔌',
    status: 'active',
    fee: '3,000 - 6,000',
  },
  {
    id: 'mantenimiento',
    name: 'Mantenimiento Preventivo',
    description: 'Revisión periódica de tu sistema eléctrico para prevenir fallas costosas y garantizar seguridad.',
    shortDesc: 'Mantenimiento preventivo',
    icon: '🔧',
    status: 'active',
    fee: '3,000 - 5,000',
  },
  {
    id: 'reparacion',
    name: 'Reparación Eléctrica',
    description: 'Diagnóstico y reparación de fallas eléctricas en hogares y locales comerciales.',
    shortDesc: 'Reparación de fallas',
    icon: '⚡',
    status: 'active',
    fee: '3,000 - 7,000',
  },
  {
    id: 'solar',
    name: 'Paneles Solares',
    description: 'Instalación y mantenimiento de sistemas fotovoltaicos residenciales y comerciales.',
    shortDesc: 'Energía solar para tu hogar',
    icon: '☀️',
    status: 'coming_soon',
  },
  {
    id: 'generador',
    name: 'Generadores & Inversor',
    description: 'Instalación y mantenimiento de plantas eléctricas e inversores.',
    shortDesc: 'Soluciones de respaldo energético',
    icon: '🔋',
    status: 'coming_soon',
  },
  {
    id: 'climatizacion',
    name: 'Climatización',
    description: 'Instalación y mantenimiento de aires acondicionados y sistemas de ventilación.',
    shortDesc: 'Aire acondicionado e instalaciones',
    icon: '❄️',
    status: 'coming_soon',
  },
  {
    id: 'plomeria',
    name: 'Plomería',
    description: 'Instalaciones y reparaciones de plomería residencial y comercial.',
    shortDesc: 'Tuberías, llaves y cisternas',
    icon: '🔩',
    status: 'coming_soon',
  },
]

export const activeServices = services.filter(s => s.status === 'active')
export const comingSoonServices = services.filter(s => s.status === 'coming_soon')
