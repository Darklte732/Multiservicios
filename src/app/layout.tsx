import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'MultiServicios El Seibo - Servicios Eléctricos Profesionales',
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
  metadataBase: new URL('https://multiservicios.app'),
  alternates: {
    canonical: '/',
    languages: {
      'es-DO': '/',
    },
  },
  openGraph: {
    title: 'MultiServicios El Seibo - Servicios Eléctricos',
    description: 'Servicios eléctricos profesionales en El Seibo, República Dominicana',
    url: 'https://multiservicios.app',
    siteName: 'MultiServicios El Seibo',
    locale: 'es_DO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MultiServicios El Seibo',
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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon.ico',
        color: '#3b82f6',
      },
    ],
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es-DO">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512x512.png" />
        
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="mask-icon" href="/favicon.ico" color="#3b82f6" />
        
        <link rel="manifest" href="/manifest.json" />
        
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MultiServicios" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-TileImage" content="/icon-192x192.png" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        <meta name="application-name" content="MultiServicios El Seibo" />
        <meta name="format-detection" content="telephone=no" />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        <link rel="dns-prefetch" href="//calendly.com" />
        <link rel="dns-prefetch" href="//api.whatsapp.com" />
      </head>
      <body className="font-sans antialiased min-h-screen">
        <NotificationProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </NotificationProvider>
      </body>
    </html>
  )
} 