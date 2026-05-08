import type { NextConfig } from 'next'
import path from 'path'

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(self), geolocation=()',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://elevenlabs.io https://*.elevenlabs.io",
      // Google Fonts CSS is fetched via <link rel="stylesheet"> from fonts.googleapis.com.
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https:",
      "media-src 'self' blob: https://*.elevenlabs.io",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.elevenlabs.io wss://*.elevenlabs.io",
      // Allow OpenStreetMap embed used by the coverage map.
      "frame-src 'self' https://www.openstreetmap.org",
      // Google Fonts woff2 files are served from fonts.gstatic.com.
      "font-src 'self' https://fonts.gstatic.com",
      "worker-src 'self' blob:",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig