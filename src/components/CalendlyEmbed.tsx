'use client';

import { useEffect } from 'react';

interface CalendlyEmbedProps {
  selectedService: string | null;
}

const serviceUrls = {
  'emergencia': 'https://calendly.com/multiservicios1228/emergencia-electrica?primary_color=e02f17',
  'instalacion': 'https://calendly.com/multiservicios1228/instalacion-electrica',
  'mantenimiento': 'https://calendly.com/multiservicios1228/30min?primary_color=51cb30',
  'reparacion': 'https://calendly.com/multiservicios1228/reparacion-electrica?primary_color=a830d4'
};

const serviceFees = {
  'emergencia': '500',
  'instalacion': '400', 
  'mantenimiento': '350',
  'reparacion': '400'
};

export default function CalendlyEmbed({ selectedService }: CalendlyEmbedProps) {
  useEffect(() => {
    // Load Calendly script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  if (!selectedService) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Selecciona un servicio para continuar</p>
      </div>
    );
  }

  // Get service URL and fee
  const calendlyUrl = serviceUrls[selectedService as keyof typeof serviceUrls];
  const fee = serviceFees[selectedService as keyof typeof serviceFees];
  
  if (!calendlyUrl) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Servicio no disponible</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Service Context Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {selectedService === 'emergencia' ? 'E' :
               selectedService === 'instalacion' ? 'I' :
               selectedService === 'mantenimiento' ? 'M' : 'R'}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-blue-900">
              {selectedService === 'emergencia' ? 'Emergencia Eléctrica' :
               selectedService === 'instalacion' ? 'Instalación Eléctrica' :
               selectedService === 'mantenimiento' ? 'Mantenimiento Eléctrico' : 'Reparación Eléctrica'}
            </h3>
            <p className="text-sm text-blue-700">
              Evaluación técnica: RD$ {fee} • Cotización total después del diagnóstico
            </p>
          </div>
        </div>
      </div>

      {/* Calendly Widget */}
      <div 
        className="calendly-inline-widget" 
        data-url={calendlyUrl}
        style={{ minWidth: '320px', height: '580px' }}
      ></div>
    </div>
  );
}

// Extend window interface for Calendly
declare global {
  interface Window {
    Calendly: any;
  }
}