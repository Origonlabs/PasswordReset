import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Security headers
  // Habilita/inhabilita con SECURITY_HEADERS_ENABLED=true
  if (process.env.SECURITY_HEADERS_ENABLED === 'true') {
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      // Permitir imágenes desde nuestros CDNs
      "img-src 'self' data: https://public.blob.opendex.dev https://cdn.bucket.opendex.dev",
      // Conexiones del cliente (no se conecta directo a Neon desde el navegador)
      "connect-src 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
    ].join('; ')
    response.headers.set('Content-Security-Policy', csp)

    // HSTS en HTTPS
    if (request.nextUrl.protocol === 'https:') {
      response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    }
  }

  // Cabeceras útiles para rutas API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
  }

  return response
}

export const config = {
  matcher: [
    // Excluir assets estáticos típicos
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
