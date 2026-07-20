import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Proteger todas las rutas que empiecen con /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const basicAuth = request.headers.get('authorization');
    
    // Contraseña definida en tus variables de entorno
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminUser = process.env.ADMIN_USER || 'admin';

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');

      if (user === adminUser && pwd === adminPassword) {
        return NextResponse.next(); // Acceso permitido
      }
    }
    
    // Si no hay credenciales o son incorrectas, mostrar ventana de login del navegador
    return new NextResponse('Autenticación requerida', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Panel de Administración"',
      },
    });
  }
  
  return NextResponse.next();
}

// Aplicar este middleware solo a las rutas de /admin
export const config = {
  matcher: '/admin/:path*',
};