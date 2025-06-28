import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: '⚡ MultiServicios El Seibo - Servicios Eléctricos Profesionales',
  description: 'Servicios eléctricos profesionales en El Seibo, República Dominicana. Instalaciones, reparaciones, mantenimiento y emergencias 24/7. Reserva tu cita en línea.',
  keywords: [
    'servicios eléctricos',
    'electricista',
    'El Seibo',
    'República Dominicana',
    'instalaciones eléctricas',
    'reparaciones',
    'emergencias',
    'mantenimiento eléctrico'
  ],
  authors: [{ name: 'MultiServicios El Seibo' }],
  creator: 'MultiServicios El Seibo',
  publisher: 'MultiServicios El Seibo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://multiservicios-elseibo.com'),
  alternates: {
    canonical: '/',
    languages: {
      'es-DO': '/',
    },
  },
  openGraph: {
    title: '⚡ MultiServicios El Seibo - Servicios Eléctricos',
    description: 'Servicios eléctricos profesionales en El Seibo, República Dominicana',
    url: 'https://multiservicios-elseibo.com',
    siteName: 'MultiServicios El Seibo',
    locale: 'es_DO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '⚡ MultiServicios El Seibo',
    description: 'Servicios eléctricos profesionales en El Seibo',
    creator: '@multiservicios_elseibo',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es-DO" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MultiServicios" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={`antialiased font-geist-sans min-h-screen`}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
} 