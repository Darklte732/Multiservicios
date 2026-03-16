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
}

export const services: Service[] = [
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
