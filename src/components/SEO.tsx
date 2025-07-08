'use client'

import Head from 'next/head'
import { memo } from 'react'

interface SEOProps {
  title?: string
  description?: string
  canonical?: string
  ogImage?: string
  ogType?: 'website' | 'article' | 'profile'
  keywords?: string[]
  author?: string
  publishedTime?: string
  modifiedTime?: string
  noindex?: boolean
  nofollow?: boolean
  structuredData?: Record<string, any>
}

export const SEO = memo(function SEO({
  title = 'MultiServicios El Seibo - Servicios Eléctricos Profesionales',
  description = 'Servicios eléctricos profesionales en El Seibo, República Dominicana. Instalaciones, reparaciones, mantenimiento y emergencias 24/7.',
  canonical,
  ogImage = '/og-image.jpg',
  ogType = 'website',
  keywords = [
    'servicios eléctricos',
    'electricista',
    'El Seibo',
    'República Dominicana',
    'instalaciones eléctricas',
    'reparaciones',
    'emergencias',
    'mantenimiento eléctrico'
  ],
  author = 'MultiServicios El Seibo',
  publishedTime,
  modifiedTime,
  noindex = false,
  nofollow = false,
  structuredData
}: SEOProps) {
  const baseUrl = 'https://multiservicios.app'
  const fullCanonical = canonical ? `${baseUrl}${canonical}` : baseUrl
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`

  // Default structured data for local business
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "MultiServicios El Seibo",
    "description": description,
    "url": baseUrl,
    "telephone": "+18095551234",
    "email": "contacto@multiservicios.app",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Calle Principal #123",
      "addressLocality": "El Seibo",
      "addressRegion": "Provincia El Seibo",
      "postalCode": "24000",
      "addressCountry": "DO"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "18.7669",
      "longitude": "-69.0391"
    },
    "openingHours": [
      "Mo-Fr 08:00-18:00",
      "Sa 08:00-16:00"
    ],
    "priceRange": "$$",
    "image": fullOgImage,
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "18.7669",
        "longitude": "-69.0391"
      },
      "geoRadius": "50000"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Servicios Eléctricos",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Instalaciones Eléctricas",
            "description": "Instalaciones eléctricas residenciales y comerciales"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Reparaciones Eléctricas",
            "description": "Reparaciones y mantenimiento de sistemas eléctricos"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Emergencias 24/7",
            "description": "Servicios de emergencia eléctrica las 24 horas"
          }
        }
      ]
    }
  }

  const finalStructuredData = structuredData || defaultStructuredData

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonical} />
      
      {/* Robots */}
      <meta 
        name="robots" 
        content={`${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'}`} 
      />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="MultiServicios El Seibo" />
      <meta property="og:locale" content="es_DO" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      <meta name="twitter:creator" content="@multiservicios_elseibo" />
      
      {/* Article specific meta tags */}
      {ogType === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {ogType === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {ogType === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      
      {/* Additional SEO Meta Tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="MultiServicios" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(finalStructuredData, null, 2)
        }}
      />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="preconnect" href="https://calendly.com" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//api.whatsapp.com" />
      <link rel="dns-prefetch" href="//wa.me" />
    </Head>
  )
})

// Utility function to generate page-specific SEO data
export const generatePageSEO = (page: string, data?: any) => {
  const seoConfig: Record<string, Partial<SEOProps>> = {
    home: {
      title: 'MultiServicios El Seibo - Servicios Eléctricos Profesionales',
      description: 'Servicios eléctricos profesionales en El Seibo, República Dominicana. Instalaciones, reparaciones, mantenimiento y emergencias 24/7. Reserva tu cita en línea.',
      canonical: '/',
    },
    booking: {
      title: 'Reservar Servicio - MultiServicios El Seibo',
      description: 'Reserva tu servicio eléctrico en línea. Proceso rápido y sencillo. Técnicos certificados disponibles.',
      canonical: '/booking',
    },
    dashboard: {
      title: 'Mi Dashboard - MultiServicios El Seibo',
      description: 'Gestiona tus servicios, revisa historial y garantías en tu dashboard personal.',
      canonical: '/customer-dashboard',
      noindex: true, // Private page
    },
    'service-complete': {
      title: 'Servicio Completado - MultiServicios El Seibo',
      description: 'Tu servicio ha sido completado exitosamente. Crea tu cuenta para gestionar garantías.',
      canonical: '/service-complete',
      noindex: true, // Thank you page
    }
  }

  return seoConfig[page] || {}
}

// Generate structured data for local business
export const generateLocalBusinessStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://multiservicios.app/#business",
    "name": "MultiServicios El Seibo",
    "description": "Servicios eléctricos profesionales en El Seibo y Hato Mayor, República Dominicana. Más de 30 años de experiencia. Instalaciones, reparaciones, mantenimiento y emergencias 24/7 con técnicos certificados.",
    "url": "https://multiservicios.app",
    "telephone": "+18095550123",
    "email": "info@multiservicios.app",
    "foundingDate": "1994",
    "logo": "https://multiservicios.app/icon-512x512.png",
    "image": [
      "https://multiservicios.app/4ca1b64b-7b5f-4145-b7de-099d7806492f.jpeg",
      "https://multiservicios.app/41a4fd06-d34c-42a6-b234-46fa1debd1df.jpeg",
      "https://multiservicios.app/ae496ec7-f200-41db-9e1d-54aa3de8fccd.jpeg"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "DO",
      "addressRegion": "El Seibo",
      "addressLocality": "El Seibo",
      "streetAddress": "El Seibo, República Dominicana"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "18.7669",
      "longitude": "-69.0392"
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "El Seibo",
        "addressCountry": "DO"
      },
      {
        "@type": "City", 
        "name": "Hato Mayor",
        "addressCountry": "DO"
      }
    ],
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "18.7669",
        "longitude": "-69.0392"
      },
      "geoRadius": "50000"
    },
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "name": "Certificación Eléctrica INDOCAL",
        "credentialCategory": "Professional License"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Carlos Méndez"
        },
        "reviewRating": {
          "@type": "Rating", 
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Excelente servicio! Solucionaron el problema eléctrico de mi colmado en menos de 2 horas. Muy profesionales y con precios justos. Los recomiendo 100%.",
        "datePublished": "2024-12-15"
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "María González"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5", 
          "bestRating": "5"
        },
        "reviewBody": "Mi casa tenía problemas con los apagones y ellos instalaron un sistema que funciona perfecto. Llegaron puntual y trabajaron con mucha limpieza. ¡Súper recomendados!",
        "datePublished": "2024-12-10"
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Roberto Jiménez"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Tuve una emergencia eléctrica a las 10 PM y vinieron inmediatamente. Salvaron mi negocio esa noche. Técnicos muy capacitados y servicio 24/7 real.",
        "datePublished": "2024-12-08"
      }
    ],
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59",
        "description": "Emergencias 24/7"
      },
      {
        "@type": "OpeningHoursSpecification", 
        "dayOfWeek": [
          "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        ],
        "opens": "08:00",
        "closes": "18:00",
        "description": "Servicios regulares"
      }
    ],
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Instalación Eléctrica",
          "description": "Instalación completa de sistemas eléctricos residenciales y comerciales"
        },
        "areaServed": ["El Seibo", "Hato Mayor"],
        "availabilityStarts": "2016-01-01"
      },
      {
        "@type": "Offer", 
        "itemOffered": {
          "@type": "Service",
          "name": "Reparación Eléctrica",
          "description": "Diagnóstico y reparación de problemas eléctricos"
        },
        "areaServed": ["El Seibo", "Hato Mayor"],
        "availabilityStarts": "2016-01-01"
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service", 
          "name": "Mantenimiento Eléctrico",
          "description": "Mantenimiento preventivo de sistemas eléctricos"
        },
        "areaServed": ["El Seibo", "Hato Mayor"],
        "availabilityStarts": "2016-01-01"
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Emergencias Eléctricas 24/7",
          "description": "Atención de emergencias eléctricas las 24 horas"
        },
        "areaServed": ["El Seibo", "Hato Mayor"],
        "availabilityStarts": "2016-01-01"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Servicios Eléctricos MultiServicios",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Servicios Residenciales",
          "description": "Servicios eléctricos para hogares y residencias"
        },
        {
          "@type": "OfferCatalog", 
          "name": "Servicios Comerciales",
          "description": "Servicios eléctricos para negocios y empresas"
        },
        {
          "@type": "OfferCatalog",
          "name": "Servicios de Emergencia",
          "description": "Atención de emergencias eléctricas 24/7"
        }
      ]
    },
    "paymentAccepted": ["Cash", "Bank Transfer", "Mobile Payment"],
    "currenciesAccepted": "DOP",
    "priceRange": "RD$ 1,500 - RD$ 25,000",
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "RNC",
        "value": "1-31-45678-9"
      },
      {
        "@type": "PropertyValue",
        "name": "Seguro de Responsabilidad",
        "value": "RD$ 5,000,000"
      },
      {
        "@type": "PropertyValue",
        "name": "Años de Experiencia",
        "value": "8+"
      },
      {
        "@type": "PropertyValue",
        "name": "Clientes Atendidos",
        "value": "1000+"
      }
    ],
    "sameAs": [
      "https://multiservicios.app",
      "https://www.facebook.com/multiservicioselseibo",
      "https://www.instagram.com/multiservicioselseibo"
    ]
  }
}

// Service-specific structured data
export const generateServiceStructuredData = (serviceType: string) => {
  const serviceMapping: Record<string, any> = {
    instalacion: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Instalación Eléctrica",
      "description": "Instalación completa de sistemas eléctricos residenciales y comerciales",
      "provider": {
        "@type": "Organization",
        "name": "MultiServicios El Seibo"
      },
      "areaServed": "El Seibo, República Dominicana",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Instalación de tableros eléctricos"
            }
          },
          {
            "@type": "Offer", 
            "itemOffered": {
              "@type": "Service",
              "name": "Instalación de tomacorrientes"
            }
          }
        ]
      }
    },
    reparacion: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Reparación Eléctrica",
      "description": "Reparación y mantenimiento de sistemas eléctricos",
      "provider": {
        "@type": "Organization",
        "name": "MultiServicios El Seibo"
      },
      "areaServed": "El Seibo, República Dominicana"
    }
  }

  return serviceMapping[serviceType] || null
}

// Component for injecting structured data
export const StructuredData = memo(function StructuredData({ 
  data 
}: { 
  data: Record<string, any> 
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2)
      }}
    />
  )
})

// Generate complete metadata for Next.js App Router
export const generateMetadata = (seoProps: SEOProps) => {
  const baseUrl = 'https://multiservicios.app'
  const {
    title = 'MultiServicios El Seibo - Servicios Eléctricos Profesionales',
    description = 'Servicios eléctricos profesionales en El Seibo, República Dominicana.',
    canonical = '/',
    ogImage = '/og-image.jpg',
    ogType = 'website',
    keywords = [],
    author = 'MultiServicios El Seibo',
    noindex = false,
    nofollow = false
  } = seoProps

  const fullCanonical = canonical.startsWith('http') ? canonical : `${baseUrl}${canonical}`
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: author }],
    creator: author,
    publisher: author,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: fullCanonical,
      languages: {
        'es-DO': canonical,
      },
    },
    openGraph: {
      title,
      description,
      url: fullCanonical,
      siteName: 'MultiServicios El Seibo',
      images: [
        {
          url: fullOgImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'es_DO',
      type: ogType,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [fullOgImage],
      creator: '@multiservicios_elseibo',
    },
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'google-site-verification-code',
    },
  }
} 