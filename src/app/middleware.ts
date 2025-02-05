// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuthSession } from '../../utils/auth-utils';

export async function middleware(request: NextRequest) {
  const session = await getAuthSession();

  const securityHeaders = {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://localhost:3000;  base-uri 'self'; form-action 'self';",
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Referrer-Policy': 'no-referrer',
  };


  const response = NextResponse.next();

    // ถ้าไม่ต้องการให้เข้าถึง url ที่ขึ้นต้นด้วย api หรือ _next
    if (
        request.nextUrl.pathname.startsWith('/api') ||
        request.nextUrl.pathname.startsWith('/_next')
    ) {
        return response;
    }

    const isAuth = !!session;
    const isAuthRoute = request.nextUrl.pathname === '/login-secret';
    const protectedRoutes = ['/', '/send', '/send2'];


      if (isAuthRoute) {
        if (isAuth) {
          return NextResponse.redirect(new URL('/', request.url));
        }
        return response;
    }

    if (protectedRoutes.includes(request.nextUrl.pathname)) {
       if(!isAuth) {
        return NextResponse.redirect(new URL('/login-secret', request.url));
       }

    }

    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;

}
  export const config = {
    matcher: ['/((?!api|_next).*)'],
  };