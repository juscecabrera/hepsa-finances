// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Función para verificar si una IP es privada
function isPrivateIP(ip: string): boolean {
  // Rangos de IP privadas según RFC 1918
  const privateRanges = [
    /^10\./,                    // 10.0.0.0 - 10.255.255.255
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,  // 172.16.0.0 - 172.31.255.255
    /^192\.168\./,             // 192.168.0.0 - 192.168.255.255
    /^127\./,                  // localhost
    /^::1/,                    // localhost IPv6
    /^fc00::/,                 // Unique local address IPv6
  ]

  return privateRanges.some(range => range.test(ip))
}

export function middleware(request: NextRequest) {
    // Obtener la IP del cliente desde los headers
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    
    // Usar la primera IP en x-forwarded-for, o x-real-ip, o una IP por defecto
    const clientIP = forwardedFor?.split(',')[0].trim() || 
                    realIp || 
                    '127.0.0.1'  // Default a localhost si no se encuentra IP
  
    // Si no es una IP privada, redirigir a página de error
    if (!isPrivateIP(clientIP)) {
      return NextResponse.redirect(new URL('/acceso-denegado', request.url))
    }
  
    return NextResponse.next()
}

// Configurar en qué rutas se ejecutará el middleware
export const config = {
  matcher: ['/((?!acceso-denegado|_next/static|favicon.ico).*)'],
}





