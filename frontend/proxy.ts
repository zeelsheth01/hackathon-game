import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const token = request.cookies.get('next-auth.session-token') || request.cookies.get('__Secure-next-auth.session-token');

  if (pathname.startsWith('/game') && !token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  if (pathname.startsWith('/auth/signin') && token) {
    return NextResponse.redirect(new URL('/game', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/game/:path*', '/auth/signin'],
};
