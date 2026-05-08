import type { ServiceCode } from '@/types'

/**
 * Service Code Generation and Management
 * Format: MS-YYYY-XXXXX (e.g., MS-2025-A1B2C)
 * Used for linking services to customer accounts
 */

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const CODE_LENGTH = 5

/**
 * Generate a unique service code
 * @returns string in format MS-YYYY-XXXXX
 */
export function generateServiceCode(): string {
  const year = new Date().getFullYear()
  const randomPart = Array.from({ length: CODE_LENGTH }, () => 
    ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  ).join('')
  
  return `MS-${year}-${randomPart}`
}

/**
 * Validate service code format
 * @param code - Service code to validate
 * @returns boolean indicating if code format is valid
 */
export function validateServiceCodeFormat(code: string): boolean {
  const pattern = /^MS-\d{4}-[A-Z0-9]{5}$/
  return pattern.test(code)
}

/**
 * Parse service code to extract components
 * @param code - Service code to parse
 * @returns object with year and identifier parts
 */
export function parseServiceCode(code: string): { year: number; identifier: string } | null {
  if (!validateServiceCodeFormat(code)) {
    return null
  }
  
  const parts = code.split('-')
  return {
    year: parseInt(parts[1]),
    identifier: parts[2]
  }
}

/**
 * Check if service code is expired
 * @param expiresAt - ISO string of expiration date
 * @returns boolean indicating if code is expired
 */
export function isServiceCodeExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date()
}

/**
 * Generate expiration date for service code
 * @param hoursFromNow - Hours from now when code expires (default: 48)
 * @returns ISO string of expiration date
 */
export function generateCodeExpiration(hoursFromNow: number = 48): string {
  const expiration = new Date()
  expiration.setHours(expiration.getHours() + hoursFromNow)
  return expiration.toISOString()
}

/**
 * Create service code entry for database
 * @param serviceRequestId - ID of the service request
 * @param hoursValid - Hours the code should be valid (default: 48)
 * @returns ServiceCode object ready for database insertion
 */
export function createServiceCodeEntry(
  serviceRequestId: string, 
  hoursValid: number = 48
): Omit<ServiceCode, 'id'> {
  const code = generateServiceCode()
  const expiresAt = generateCodeExpiration(hoursValid)
  
  return {
    code,
    service_request_id: serviceRequestId,
    is_used: false,
    expires_at: expiresAt,
    created_at: new Date().toISOString()
  }
}

/**
 * Generate linking code display information
 * @param code - Service code
 * @returns formatted code information for display
 */
export function formatCodeForDisplay(code: string): {
  formatted: string;
  parts: string[];
  description: string;
} {
  const parts = code.split('-')
  return {
    formatted: code,
    parts,
    description: `Código de servicio generado en ${parts[1]}`
  }
}

/**
 * Generate instructions for code usage
 * @param code - Service code
 * @param expiresAt - Expiration date
 * @returns user-friendly instructions
 */
export function generateCodeInstructions(code: string, expiresAt: string): {
  title: string;
  instructions: string[];
  expiration: string;
  urgency: 'low' | 'medium' | 'high';
} {
  const expiration = new Date(expiresAt)
  const hoursUntilExpiration = Math.ceil((expiration.getTime() - Date.now()) / (1000 * 60 * 60))
  
  let urgency: 'low' | 'medium' | 'high' = 'low'
  if (hoursUntilExpiration <= 6) urgency = 'high'
  else if (hoursUntilExpiration <= 24) urgency = 'medium'
  
  return {
    title: 'Código de Vinculación de Servicio',
    instructions: [
      'Guarda este código para vincular el servicio a tu cuenta',
      'Ve a "Crear Cuenta" en la app o sitio web',
      `Ingresa el código: ${code}`,
      'Tu historial de servicios se vinculará automáticamente'
    ],
    expiration: expiration.toLocaleDateString('es-DO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    urgency
  }
}

/**
 * Generate WhatsApp message with service code
 * @param customerName - Customer's name
 * @param serviceType - Type of service
 * @param code - Service code
 * @param expiresAt - Expiration date
 * @returns formatted WhatsApp message
 */
export function generateWhatsAppCodeMessage(
  customerName: string,
  serviceType: string,
  code: string,
  expiresAt: string
): string {
  const expiration = new Date(expiresAt).toLocaleDateString('es-DO', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  
  return `🔌 *MultiServicios El Seibo*

Hola ${customerName},

Tu servicio de *${serviceType}* ha sido completado exitosamente ✅

🎟️ *Código de Cuenta:* \`${code}\`

💡 *Beneficios de crear cuenta:*
• Historial completo de servicios
• Garantías rastreables
• Descuentos en futuros servicios
• Reservas más rápidas

⏰ Código válido hasta: ${expiration}

¿Preguntas? Responde a este mensaje.
¡Gracias por confiar en nosotros! ⚡`
}

/**
 * Generate email with service code
 * @param customerName - Customer's name
 * @param serviceType - Type of service
 * @param code - Service code
 * @param expiresAt - Expiration date
 * @returns email content object
 */
export function generateEmailCodeContent(
  customerName: string,
  serviceType: string,
  code: string,
  expiresAt: string
): {
  subject: string;
  html: string;
  text: string;
} {
  const expiration = new Date(expiresAt).toLocaleDateString('es-DO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  
  const subject = `✅ Servicio Completado - Tu Código de Cuenta: ${code}`
  
  const text = `
Hola ${customerName},

Tu servicio de ${serviceType} ha sido completado exitosamente.

Código de Cuenta: ${code}

Beneficios de crear cuenta:
- Historial completo de servicios
- Garantías rastreables  
- Descuentos en futuros servicios
- Reservas más rápidas

Código válido hasta: ${expiration}

Visita nuestra web o responde este email para crear tu cuenta.

Gracias por confiar en MultiServicios El Seibo.
  `
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2563eb;">⚡ MultiServicios El Seibo</h1>
      
      <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #1e40af; margin-top: 0;">✅ Servicio Completado</h2>
        <p>Hola <strong>${customerName}</strong>,</p>
        <p>Tu servicio de <strong>${serviceType}</strong> ha sido completado exitosamente.</p>
      </div>
      
      <div style="background: #065f46; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
        <h3 style="margin-top: 0;">🎟️ Tu Código de Cuenta</h3>
        <div style="font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 10px 0;">
          ${code}
        </div>
        <p style="margin-bottom: 0; opacity: 0.9;">Guarda este código para crear tu cuenta</p>
      </div>
      
      <div style="background: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #92400e; margin-top: 0;">💡 Beneficios de crear cuenta:</h3>
        <ul style="color: #92400e;">
          <li>Historial completo de servicios</li>
          <li>Garantías rastreables</li>
          <li>Descuentos en futuros servicios</li>
          <li>Reservas más rápidas</li>
        </ul>
      </div>
      
      <p><strong>⏰ Código válido hasta:</strong> ${expiration}</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="#" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Crear Mi Cuenta Ahora
        </a>
      </div>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      
      <p style="color: #6b7280; font-size: 14px;">
        ¿Preguntas? Contáctanos por WhatsApp: +1 (809) 251-4329<br>
        Gracias por confiar en MultiServicios El Seibo ⚡
      </p>
    </div>
  `
  
  return { subject, html, text }
} 