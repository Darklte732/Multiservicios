// Service Types — kept for content/brand surfaces (services data, booking flow).
// All user/account/dashboard types were removed when the customer portal was torn
// down; the site is a marketing landing page only.

export type ServiceType = 'reparacion' | 'instalacion' | 'mantenimiento' | 'emergencia'

export const SERVICE_TRANSLATIONS: Record<ServiceType, string> = {
  reparacion: 'Reparación Eléctrica',
  instalacion: 'Instalación Eléctrica',
  mantenimiento: 'Mantenimiento',
  emergencia: 'Emergencia 24/7',
}

export const SERVICE_PRICING: Record<ServiceType, { min: number; description: string }> = {
  instalacion: { min: 2000, description: 'Instalación Eléctrica completa' },
  reparacion: { min: 800, description: 'Reparación de problemas eléctricos' },
  emergencia: { min: 1500, description: 'Servicio de emergencia 24/7' },
  mantenimiento: { min: 600, description: 'Mantenimiento preventivo' },
}
