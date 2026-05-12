import { LOGO_PATH, OG_IMAGE_PATH, SITE_ORIGIN } from '@/lib/site-branding'

const fullLogo = `${SITE_ORIGIN}${LOGO_PATH}`
const fullOgImage = `${SITE_ORIGIN}${OG_IMAGE_PATH}`

const DEFAULT_PHONE =
  process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? '+18092514329'
const DEFAULT_RATING_VALUE = 4.9
const DEFAULT_REVIEW_COUNT = 200

export interface LocalBusinessOpts {
  /** Override the business phone (defaults to NEXT_PUBLIC_BUSINESS_PHONE). */
  phone?: string
  /** Override aggregate rating value (defaults to 4.9). */
  ratingValue?: number
  /** Override aggregate review count (defaults to 200, matches visible "200+"). */
  reviewCount?: number
}

/**
 * Single source of truth for LocalBusiness JSON-LD (AEO / Google).
 *
 * Canonical values are pinned to the visible marketing copy on `/`:
 *   - 15+ años de experiencia
 *   - Calle Duarte #45, El Seibo, RD
 *   - 200 reseñas verificadas, 4.9 / 5
 *   - Lun–Sáb 7am–7pm; domingos: solo emergencias 24/7
 */
export function generateLocalBusinessStructuredData(
  opts: LocalBusinessOpts = {}
): Record<string, unknown> {
  const telephone = opts.phone ?? DEFAULT_PHONE
  const ratingValue = opts.ratingValue ?? DEFAULT_RATING_VALUE
  const reviewCount = opts.reviewCount ?? DEFAULT_REVIEW_COUNT

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_ORIGIN}/#business`,
    name: 'MultiServicios El Seibo',
    alternateName: 'MultiServicios — Electricistas en El Seibo',
    description:
      'Servicios eléctricos profesionales en El Seibo y la región Este, República Dominicana. Más de 15 años de experiencia. Instalaciones, reparaciones, mantenimiento y emergencias 24/7 con técnicos certificados.',
    url: SITE_ORIGIN,
    telephone,
    email: 'info@multiservicios.app',
    foundingDate: '2010',
    logo: fullLogo,
    image: [
      fullLogo,
      fullOgImage,
      `${SITE_ORIGIN}/4ca1b64b-7b5f-4145-b7de-099d7806492f.jpeg`,
      `${SITE_ORIGIN}/41a4fd06-d34c-42a6-b234-46fa1debd1df.jpeg`,
      `${SITE_ORIGIN}/ae496ec7-f200-41db-9e1d-54aa3de8fccd.jpeg`,
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'DO',
      addressRegion: 'Provincia El Seibo',
      addressLocality: 'El Seibo',
      streetAddress: 'Calle Duarte #45',
      postalCode: '24000',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '18.7647',
      longitude: '-69.0387',
    },
    areaServed: [
      { '@type': 'City', name: 'El Seibo', addressCountry: 'DO' },
      { '@type': 'City', name: 'Hato Mayor', addressCountry: 'DO' },
    ],
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: '18.7647',
        longitude: '-69.0387',
      },
      geoRadius: '35000',
    },
    founder: {
      '@type': 'Person',
      name: 'Neno Báez',
      jobTitle: 'Maestro Electricista',
      description:
        'Electricista certificado con más de 15 años de experiencia en El Seibo y la región Este, RD.',
    },
    employee: [
      {
        '@type': 'Person',
        name: 'Neno Báez',
        jobTitle: 'Maestro Electricista',
      },
    ],
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'Certificación Eléctrica INDOCAL',
        credentialCategory: 'Professional License',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: ratingValue.toString(),
      reviewCount: reviewCount.toString(),
      bestRating: '5',
      worstRating: '1',
    },
    review: [
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Carlos Méndez' },
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody:
          'Excelente servicio! Solucionaron el problema eléctrico de mi colmado en menos de 2 horas. Muy profesionales y con precios justos. Los recomiendo 100%.',
        datePublished: '2024-12-15',
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'María González' },
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody:
          'Mi casa tenía problemas con los apagones y ellos instalaron un sistema que funciona perfecto. Llegaron puntual y trabajaron con mucha limpieza. ¡Súper recomendados!',
        datePublished: '2024-12-10',
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Roberto Jiménez' },
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody:
          'Tuve una emergencia eléctrica a las 10 PM y vinieron inmediatamente. Salvaron mi negocio esa noche. Técnicos muy capacitados y servicio 24/7 real.',
        datePublished: '2024-12-08',
      },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '07:00',
        closes: '19:00',
        description: 'Servicios regulares Lun–Sáb (7am–7pm)',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday'],
        opens: '00:00',
        closes: '23:59',
        description: 'Domingos: solo emergencias eléctricas (línea 24/7)',
      },
    ],
    makesOffer: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Instalación Eléctrica',
          description: 'Instalación completa de sistemas eléctricos residenciales y comerciales',
        },
        areaServed: ['El Seibo', 'Hato Mayor'],
        availabilityStarts: '2010-01-01',
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Reparación Eléctrica',
          description: 'Diagnóstico y reparación de problemas eléctricos',
        },
        areaServed: ['El Seibo', 'Hato Mayor'],
        availabilityStarts: '2010-01-01',
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Mantenimiento Eléctrico',
          description: 'Mantenimiento preventivo de sistemas eléctricos',
        },
        areaServed: ['El Seibo', 'Hato Mayor'],
        availabilityStarts: '2010-01-01',
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Emergencias Eléctricas 24/7',
          description: 'Atención de emergencias eléctricas las 24 horas, todos los días',
        },
        areaServed: ['El Seibo', 'Hato Mayor'],
        availabilityStarts: '2010-01-01',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Servicios Eléctricos MultiServicios',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Servicios Residenciales',
          description: 'Servicios eléctricos para hogares y residencias',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Servicios Comerciales',
          description: 'Servicios eléctricos para negocios y empresas',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Servicios de Emergencia',
          description: 'Atención de emergencias eléctricas 24/7',
        },
      ],
    },
    paymentAccepted: ['Cash', 'Credit Card', 'Bank Transfer', 'Mobile Payment'],
    currenciesAccepted: 'DOP',
    priceRange: '$$',
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Años de Experiencia',
        value: '15+',
      },
      {
        '@type': 'PropertyValue',
        name: 'Clientes Atendidos',
        value: '1000+',
      },
      {
        '@type': 'PropertyValue',
        name: 'Garantía de Servicio',
        value: 'Hasta 1 año según tipo de servicio',
      },
      {
        '@type': 'PropertyValue',
        name: 'Respuesta a Emergencias',
        value: 'Menos de 30 minutos',
      },
    ],
    // sameAs: pending real social profiles — leaving commented to avoid pointing
    // crawlers at empty/404 pages.
    // sameAs: [
    //   'https://www.facebook.com/multiservicioselseibo',
    //   'https://www.instagram.com/multiservicioselseibo',
    // ],
  }
}
