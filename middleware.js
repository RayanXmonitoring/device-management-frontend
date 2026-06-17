import { NextResponse } from 'next/server';
import { auth } from './src/lib/firebase';

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('authToken')?.value;

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/register', '/forgot-password'];
  const isPublicPath = publicPaths.includes(path);

  // If no token and trying to access protected route, redirect to login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If token exists and trying to access public path, redirect to dashboard
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Verify token for protected routes
  if (token && !isPublicPath) {
    try {
      // Verify Firebase token
      await auth.verifyIdToken(token);
      
      // Check user role for admin routes
      if (path.startsWith('/admin')) {
        // Get user role from token or session
        // For now, we'll check from cookie
        const userRole = request.cookies.get('userRole')?.value;
        if (userRole !== 'admin') {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }
    } catch (error) {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
