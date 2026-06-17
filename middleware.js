import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('authToken')?.value;

  // Public paths
  const publicPaths = ['/login', '/register', '/forgot-password', '/api/auth'];
  const isPublicPath = publicPaths.some(p => path.startsWith(p));

  // If no token and trying to access protected route
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If token exists and trying to access public path
  if (token && path === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|icons).*)'],
};
