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
  const baseUrl = 'https://multiservicios-elseibo.com'
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
    "email": "contacto@multiservicios-elseibo.com",
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
      title: '⚡ MultiServicios El Seibo - Servicios Eléctricos Profesionales',
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
    "name": "MultiServicios El Seibo",
    "description": "Servicios eléctricos profesionales en El Seibo, República Dominicana",
    "url": "https://multiservicios-elseibo.com",
    "telephone": "+18095551234",
    "email": "contacto@multiservicios-elseibo.com",
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
    "image": "https://multiservicios-elseibo.com/og-image.jpg",
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
  const baseUrl = 'https://multiservicios-elseibo.com'
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