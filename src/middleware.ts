import { NextRequest, NextResponse } from 'next/server';

// Decode JWT payload without Node.js dependencies (Edge-compatible)
function decodeJwtPayload(token: string): { userId: number; role: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    // Check expiration
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Public routes
  const publicPaths = ['/', '/login', '/register', '/partner', '/support', '/impressum', '/datenschutz', '/agb'];
  const isPublic = publicPaths.includes(pathname) || pathname.startsWith('/payment');
  const isApi = pathname.startsWith('/api');

  if (isApi) return NextResponse.next();

  const payload = token ? decodeJwtPayload(token) : null;

  if (!payload && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (payload && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Admin route protection
  if (pathname.startsWith('/admin')) {
    if (!payload || payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg).*)'],
};
