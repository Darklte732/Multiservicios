'use client'

import { MapPin } from 'lucide-react'

const towns = [
  { name: 'El Seibo', distance: '0 km', primary: true },
  { name: 'Miches', distance: '25 km', primary: false },
  { name: 'Hato Mayor', distance: '30 km', primary: false },
  { name: 'Los Llanos', distance: '35 km', primary: false },
  { name: 'Sabana de la Mar', distance: '40 km', primary: false },
  { name: 'Bayaguana', distance: '50 km', primary: false },
]

export const ServiceAreaMap = () => {
  return (
    <section className="section-secondary py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="electric-badge mb-4 inline-flex">
            <MapPin className="h-3 w-3" />
            Área de Cobertura
          </span>
          <h2 className="text-4xl font-bold text-white mb-4">
            Servimos todo el Este de la República Dominicana
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Cubrimos El Seibo y municipios cercanos con el mismo nivel de calidad y puntualidad.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Towns list */}
          <div className="space-y-3">
            {towns.map((town) => (
              <div
                key={town.name}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  town.primary
                    ? 'bg-electric/10 border-electric/40 text-electric'
                    : 'bg-navy-700 border-white/5 text-gray-300 hover:border-electric/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin className={`h-4 w-4 flex-shrink-0 ${town.primary ? 'text-electric' : 'text-gray-500'}`} />
                  <span className={`font-semibold ${town.primary ? 'text-electric' : 'text-white'}`}>
                    {town.name}
                  </span>
                  {town.primary && (
                    <span className="electric-badge text-xs">Sede Principal</span>
                  )}
                </div>
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                  town.primary
                    ? 'bg-electric/20 text-electric'
                    : 'bg-navy-600 text-gray-400'
                }`}>
                  {town.distance}
                </span>
              </div>
            ))}
            <p className="text-sm text-gray-500 mt-4 text-center">
              ¿No ves tu municipio? Cubrimos un radio de 60 km — <a href="tel:+18095550123" className="text-electric hover:underline">Llámanos</a>
            </p>
          </div>

          {/* Stylized map visual */}
          <div className="relative">
            <div className="bg-navy-700 border border-white/5 rounded-2xl p-8 flex items-center justify-center min-h-64 overflow-hidden">
              {/* Radial rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-20 h-20 rounded-full border border-electric/40 animate-ping" style={{ animationDuration: '3s' }} />
                <div className="absolute w-40 h-40 rounded-full border border-electric/20" />
                <div className="absolute w-60 h-60 rounded-full border border-electric/10" />
                <div className="absolute w-80 h-80 rounded-full border border-electric/5" />
              </div>
              {/* Center point */}
              <div className="relative z-10 text-center">
                <div className="w-12 h-12 bg-electric rounded-full flex items-center justify-center mx-auto mb-3 shadow-glow-md">
                  <MapPin className="h-6 w-6 text-navy-950" />
                </div>
                <p className="font-bold text-white">El Seibo</p>
                <p className="text-electric text-sm font-medium">Centro de Operaciones</p>
                <p className="text-gray-500 text-xs mt-1">Radio: 60 km</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
